/**
 * @file api/data/route.ts
 * @description Route API dengan caching, rate limiting, dan deduplikasi Redis.
 *
 * Digunakan sebagai endpoint alternatif yang menambahkan lapisan performa
 * (cache + lock) di atas unified AI service.
 */

import { streamChat } from "@/lib/services/ai";
import { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rate-limiter";
import {
  generateCacheKey,
  getCachedResponse,
  setCachedResponse,
  acquireLock,
  releaseLock,
  waitForCachedResponse,
} from "@/lib/redis";
import { createClient as createSupabaseClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "anonymous";
    const { success, remaining, reset } = checkRateLimit(ip);

    if (!success) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again in a minute." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": "5",
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        }
      );
    }

    // 2. Validasi body
    let body: any;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { message, history, attachments, chatId } = body;

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Caching & Deduplication
    const cacheKey = generateCacheKey(message, history, attachments);

    const cachedResponse = await getCachedResponse(cacheKey);
    if (cachedResponse) {
      console.log(`[Valora AI] Cache hit for key: ${cacheKey.substring(0, 8)}...`);
      return new Response(cachedResponse, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
        },
      });
    }

    let hasLock = await acquireLock(cacheKey);
    // Jika hasLock === false (artinya dikunci oleh proses lain). 
    // Jika hasLock === null (Redis error), maka abaikan antrean dan langsung ke stream (fail-open)
    if (hasLock === false) {
      const waitedResponse = await waitForCachedResponse(cacheKey);
      if (waitedResponse) {
        return new Response(waitedResponse, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-cache",
          },
        });
      }

      hasLock = await acquireLock(cacheKey);
      if (hasLock === false) {
        return new Response(
          JSON.stringify({ error: "Request sedang diproses" }),
          { status: 429, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // 4. Stream dari unified AI service
    const aiStream = await streamChat(message, history, attachments);

    let accumulatedResponse = "";
    const readableStream = new ReadableStream({
      async start(controller) {
        const reader = aiStream.getReader();
        const decoder = new TextDecoder();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const text = decoder.decode(value, { stream: true });
            accumulatedResponse += text;
            controller.enqueue(value);
          }

          // Final flush
          accumulatedResponse += decoder.decode();

          if (accumulatedResponse.trim()) {
            console.log(`[Valora AI] Saving response to cache (${accumulatedResponse.length} chars)`);
            await setCachedResponse(cacheKey, accumulatedResponse);

            if (chatId) {
              try {
                const supabase = await createSupabaseClient();
                await supabase.from("messages").insert({
                  chat_id: chatId,
                  role: "assistant",
                  content: accumulatedResponse,
                });
                await supabase
                  .from("chats")
                  .update({ updated_at: new Date().toISOString() })
                  .eq("id", chatId);
              } catch (dbErr) {
                console.error("[Valora AI] Failed to save to DB:", dbErr);
              }
            }
          }
        } catch (err) {
          console.error("[Valora AI] Stream reading error:", err);
          controller.error(err);
        } finally {
          await releaseLock(cacheKey);
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: any) {
    console.error("[Valora AI] Data API Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

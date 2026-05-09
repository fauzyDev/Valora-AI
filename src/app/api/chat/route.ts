/**
 * @file api/chat/route.ts
 * @description Endpoint API utama untuk memproses chat dengan caching, rate limiting, dan deduplikasi Redis.
 */

import { NextRequest } from "next/server";
import { streamChat } from "@/lib/services/ai";
import { createClient } from "@/utils/supabase/server";
import { checkRateLimit } from "@/lib/rate-limiter";
import {
  generateCacheKey,
  getCachedResponse,
  setCachedResponse,
  acquireLock,
  releaseLock,
  waitForCachedResponse,
} from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "anonymous";
    const { success, remaining, reset } = await checkRateLimit(ip);

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
    const body = await req.json();
    const { message, history, attachments, chatId } = body;

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Caching & Deduplication (Redis)
    const cacheKey = generateCacheKey(message, history, attachments);

    // Cek apakah ada di cache
    const cachedResponse = await getCachedResponse(cacheKey);
    if (cachedResponse) {
      console.log(`[Velora AI] Cache hit for key: ${cacheKey.substring(0, 8)}...`);
      
      // Penting: Tetap simpan ke Supabase jika belum ada (untuk persistensi saat refresh)
      if (chatId && cachedResponse.trim()) {
        try {
          const supabase = await createClient();
          await supabase.from("messages").insert({
            chat_id: chatId,
            role: "assistant",
            content: cachedResponse,
          });
          await supabase
            .from("chats")
            .update({ updated_at: new Date().toISOString() })
            .eq("id", chatId);
        } catch (dbErr) {
          console.error("[Velora AI] Failed to save cached response to DB:", dbErr);
        }
      }

      return new Response(cachedResponse, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
        },
      });
    }

    // Locking untuk deduplikasi (mencegah request ganda yang sama diproses serentak)
    let hasLock = await acquireLock(cacheKey);
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

    // 4. Dapatkan stream dari unified AI service
    const aiStream = await streamChat(message, history, attachments);

    // 5. Bungkus stream untuk DB persistence dan Redis caching
    let fullResponse = "";

    const readableStream = new ReadableStream({
      async start(controller) {
        const reader = aiStream.getReader();
        const decoder = new TextDecoder();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const text = decoder.decode(value, { stream: true });
            fullResponse += text;
            controller.enqueue(value);
          }

          // Final flush untuk decoder
          fullResponse += decoder.decode();

          if (fullResponse.trim()) {
            // Simpan ke Cache Redis
            console.log(`[Velora AI] Saving response to cache (${fullResponse.length} chars)`);
            await setCachedResponse(cacheKey, fullResponse);

            // Simpan ke Supabase
            if (chatId) {
              try {
                const supabase = await createClient();
                await supabase.from("messages").insert({
                  chat_id: chatId,
                  role: "assistant",
                  content: fullResponse,
                });
                await supabase
                  .from("chats")
                  .update({ updated_at: new Date().toISOString() })
                  .eq("id", chatId);
              } catch (dbErr) {
                console.error("[Velora AI] Failed to save response to DB:", dbErr);
              }
            }
          }
        } catch (err) {
          console.error("[Velora AI] Streaming error:", err);
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
    console.error("[Velora AI] Chat API Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

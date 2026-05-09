"use client";

import { useState, useRef, useEffect, FC, useCallback } from "react";
import { Sidebar } from "@/components/chat/sidebar/Sidebar";
import { TopNav } from "@/components/chat/top-nav/TopNav";
import { UserMessage } from "@/components/chat/messages/UserMessage";
import { AIMessage } from "@/components/chat/messages/AIMessage";
import { TypingIndicator } from "@/components/chat/messages/TypingIndicator";
import { InputArea } from "@/components/chat/input/InputArea";
import { ChatSession, Message, Attachment } from "@/components/chat/types";
import { chatService } from "@/lib/services/chat-service";
import { storageService } from "@/lib/services/storage-service";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageSquare, Code, Search, ArrowDown } from "lucide-react";

/**
 * @component VeloraAIChat
 * @description Komponen utama antarmuka chat. Mengelola riwayat percakapan,
 * pemilihan model AI, pengiriman pesan, dan streaming respons.
 */

const QUICK_ACTIONS = [
    { icon: <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />, label: "Explain a complex concept", detail: "like quantum physics" },
    { icon: <Code className="w-4 h-4 text-purple-600 dark:text-purple-400" />, label: "Write a React component", detail: "using Tailwind CSS" },
    { icon: <Search className="w-4 h-4 text-green-600 dark:text-emerald-400" />, label: "Analyze this document", detail: "summarize key points" },
    { icon: <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />, label: "Brainstorm ideas", detail: "for a new SaaS product" },
];

interface VeloraAIChatProps {
    isDemo?: boolean;
}

const VeloraAIChat: FC<VeloraAIChatProps> = ({ isDemo = false }) => {
    const [chatList, setChatList] = useState<ChatSession[]>([]);
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editInputValue, setEditInputValue] = useState<string>("");
    const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
    const [inputHeight, setInputHeight] = useState(0);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    
    // Demo State
    const [demoRequestCount, setDemoRequestCount] = useState<number>(0);

    // Load demo request count from localStorage
    useEffect(() => {
        if (isDemo) {
            const savedCount = localStorage.getItem("velora_demo_requests");
            if (savedCount) setDemoRequestCount(parseInt(savedCount));
        }
    }, [isDemo]);

    // Persistence: Load active chat from URL or localStorage on mount
    useEffect(() => {
        if (isDemo) return; // Skip in demo
        const params = new URLSearchParams(window.location.search);
        const urlId = params.get("id");
        const savedId = localStorage.getItem("velora_last_chat_id");
        
        const idToSet = urlId || (savedId && savedId !== "null" ? savedId : null);
        if (idToSet) {
            setActiveChatId(idToSet);
        }
    }, [isDemo]);

    // Persistence: Sync active chat to URL and localStorage
    useEffect(() => {
        if (isDemo) return; // Skip in demo
        if (activeChatId) {
            localStorage.setItem("velora_last_chat_id", activeChatId);
            const url = new URL(window.location.href);
            url.searchParams.set("id", activeChatId);
            window.history.replaceState({}, "", url.toString());
        } else if (activeChatId === null) {
            localStorage.removeItem("velora_last_chat_id");
            const url = new URL(window.location.href);
            url.searchParams.delete("id");
            window.history.replaceState({}, "", url.toString());
        }
    }, [activeChatId, isDemo]);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const inputContainerRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const isSendingRef = useRef(false);
    const skipNextFetchRef = useRef(false);
    const isReceivingStreamRef = useRef(false);
    
    // Memory Leak Prevention: Abort ongoing requests on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const activeChat = chatList.find((c) => c.id === activeChatId);
    const messages = activeChat ? activeChat.messages : [];

    const updateChatMessages = useCallback((chatId: string, updater: (prev: Message[]) => Message[]) => {
        setChatList((prevList) => {
            const chatIndex = prevList.findIndex(c => c.id === chatId);
            if (chatIndex === -1) return prevList;

            const chat = prevList[chatIndex];
            const nextMessages = updater(chat.messages);
            
            // Deduplicate messages by ID efficiently
            const uniqueMessages = nextMessages.filter((msg, index, self) => {
                return self.findIndex((m) => m.id === msg.id) === index;
            });
            
            let title = chat.title;
            if (title === "New Chat" && uniqueMessages.length > 0) {
                const firstMsg = uniqueMessages.find((m) => m.role === "user");
                if (firstMsg) {
                    title = firstMsg.content.substring(0, 40) + (firstMsg.content.length > 40 ? "..." : "");
                }
            }

            const updatedChat = { ...chat, title, updatedAt: new Date(), messages: uniqueMessages };
            const newList = [...prevList];
            newList[chatIndex] = updatedChat;
            return newList;
        });
    }, []);

    const handleCreateChat = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setIsTyping(false);
        setActiveChatId(null);
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    const handleSelectChat = (id: string) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setIsTyping(false);
        setActiveChatId(id);
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    const handleDeleteChat = async (id: string) => {
        try {
            await chatService.deleteChat(id);
            setChatList((prev) => prev.filter((chat) => chat.id !== id));
            if (activeChatId === id) {
                setActiveChatId(null);
            }
        } catch (err) {
            toast.error("Failed to delete chat");
        }
    };

    const handleRenameChat = async (id: string, newTitle: string) => {
        try {
            await chatService.renameChat(id, newTitle);
            setChatList((prev) =>
                prev.map((chat) => (chat.id === id ? { ...chat, title: newTitle } : chat))
            );
        } catch (err) {
            toast.error("Failed to rename chat");
        }
    };

    useEffect(() => {
        const init = async () => {
            if (isDemo) return; // Skip auth in demo mode
            try {
                const supabase = createClient();
                const { data: { session } } = await supabase.auth.getSession();
                
                if (!session) {
                    window.location.href = "/login";
                    return;
                }

                const chats = await chatService.fetchChats();
                setChatList(chats);
            } catch (err) {
                console.error("Failed to load chats", err);
            }
        };
        init();
    }, [isDemo]);

    useEffect(() => {
        if (isDemo || !activeChatId || chatList.length === 0) return;
        
        // Cek jika pesan sudah dimuat untuk chat ini (hindari fetch ulang jika sudah ada)
        const currentChat = chatList.find(c => c.id === activeChatId);
        if (currentChat && currentChat.messages.length > 0) return;

        if (skipNextFetchRef.current) {
            skipNextFetchRef.current = false;
            return;
        }

        let isCurrent = true;
        const loadMessages = async () => {
            setIsLoadingMessages(true);
            try {
                const msgs = await chatService.fetchMessages(activeChatId);
                if (isCurrent) {
                    updateChatMessages(activeChatId, () => msgs);
                }
            } catch (err) {
                if (isCurrent) {
                    console.error("Failed to load messages", err);
                }
            } finally {
                if (isCurrent) setIsLoadingMessages(false);
            }
        };
        loadMessages();
        return () => {
            isCurrent = false;
        };
    }, [activeChatId, chatList.length > 0, isDemo]);

    useEffect(() => {
        if (!inputContainerRef.current) return;
        
        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                // Use getBoundingClientRect to include padding and margins
                const height = entry.target.getBoundingClientRect().height;
                setInputHeight(height);
            }
        });
        
        observer.observe(inputContainerRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        let prevWidth = typeof window !== "undefined" ? window.innerWidth : 0;
        
        const handleResize = () => {
            const currentWidth = window.innerWidth;
            const isDesktop = currentWidth >= 768;
            const wasDesktop = prevWidth >= 768;

            // Hanya tutup sidebar jika layar berubah dari desktop ke mobile
            if (!isDesktop && wasDesktop) {
                setIsSidebarOpen(false);
            }
            
            prevWidth = currentWidth;
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
        if (scrollContainerRef.current) {
            const { scrollHeight } = scrollContainerRef.current;
            scrollContainerRef.current.scrollTo({
                top: scrollHeight,
                behavior
            });
        }
    }, []);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        let ticking = false;

        const handleScrollInternal = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const { scrollTop, scrollHeight, clientHeight } = container;
                    // Slightly larger threshold for better UX on high-DPI screens
                    const isAtBottom = scrollHeight - scrollTop - clientHeight < 40;
                    
                    if (isAtBottom !== shouldAutoScroll) {
                        setShouldAutoScroll(isAtBottom);
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        container.addEventListener("scroll", handleScrollInternal, { passive: true });
        return () => container.removeEventListener("scroll", handleScrollInternal);
    }, [shouldAutoScroll]);

    useEffect(() => {
        if (shouldAutoScroll && (isReceivingStreamRef.current || messages.length > 0)) {
            const frame = requestAnimationFrame(() => {
                scrollToBottom("auto");
            });
            return () => cancelAnimationFrame(frame);
        }
    }, [messages, isTyping, shouldAutoScroll, scrollToBottom]);

    useEffect(() => {
        if (activeChatId) {
            const timeout = setTimeout(() => scrollToBottom("auto"), 100);
            return () => clearTimeout(timeout);
        }
    }, [activeChatId, scrollToBottom]);

    const handleSend = async (text: string, files?: File[]) => {
        if (text.trim() === "" && (!files || files.length === 0)) return;

        if (isDemo) {
            if (demoRequestCount >= 10) {
                toast.error("Limit Tercapai", { 
                    description: "Anda telah mencapai batas 10 pesan demo. Silakan Sign In untuk melanjutkan percakapan tanpa batas.",
                    action: {
                        label: "Sign In",
                        onClick: () => window.location.href = "/login"
                    }
                });
                return;
            }
            const newCount = demoRequestCount + 1;
            setDemoRequestCount(newCount);
            localStorage.setItem("velora_demo_requests", newCount.toString());
        }

        if (isSendingRef.current) return;
        isSendingRef.current = true;
        let targetChatId = activeChatId;
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const abortController = new AbortController();
        abortControllerRef.current = abortController;
        setIsTyping(true);

        try {
            if (!targetChatId) {
                let newChat: ChatSession;
                if (isDemo) {
                    newChat = {
                        id: crypto.randomUUID(),
                        title: text.trim().substring(0, 40),
                        updatedAt: new Date(),
                        messages: [],
                        user_id: "demo-user"
                    };
                } else {
                    newChat = await chatService.createChat(text.trim().substring(0, 40));
                }
                targetChatId = newChat.id;
                skipNextFetchRef.current = true;
                setChatList((prev) => [newChat, ...prev]);
                setActiveChatId(targetChatId);
            }

            const capturedChatId = targetChatId;
            const userMessageContent = text.trim();
            let uploadedAttachments: Partial<Attachment>[] = [];
            
            if (files && files.length > 0 && !isDemo) {
                const uploadPromises = files.map(async (file) => {
                    const path = `${capturedChatId}/${crypto.randomUUID()}-${file.name}`;
                    const { url, path: storagePath } = await storageService.uploadFile(file, path);
                    return {
                        file_url: url,
                        path: storagePath,
                        file_name: file.name,
                        file_type: file.type,
                        file_size_bytes: file.size
                    };
                });
                uploadedAttachments = await Promise.all(uploadPromises);
            }

            let userMsg: Message;
            if (isDemo) {
                userMsg = {
                    id: crypto.randomUUID(),
                    chat_id: capturedChatId,
                    role: "user",
                    content: userMessageContent,
                    created_at: new Date().toISOString()
                };
            } else {
                userMsg = await chatService.createMessage(capturedChatId, "user", userMessageContent, uploadedAttachments);
            }

            updateChatMessages(capturedChatId, (prev) => [...prev, {
                ...userMsg,
                attachments: uploadedAttachments as Attachment[]
            }]);

            const currentChat = chatList.find((c) => c.id === capturedChatId) || { messages: [] };
            const history = currentChat.messages
                .filter(m => m.id !== userMsg.id)
                .map((msg) => ({
                    role: msg.role,
                    content: msg.content,
                }));

            const response = await fetch('/api/chat', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessageContent,
                    history,
                    attachments: uploadedAttachments,
                    chatId: isDemo ? null : capturedChatId, // Don't save to DB if demo
                }),
                signal: abortController.signal,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || "Failed to fetch AI response");
            }

            const reader = response.body?.getReader();
            if (!reader) throw new Error("No response body");
            const decoder = new TextDecoder("utf-8");
            let aiContent = "";
            const aiMessageId = crypto.randomUUID();

            updateChatMessages(capturedChatId, (prev) => [
                ...prev,
                { id: aiMessageId, role: "assistant", content: "", created_at: new Date().toISOString(), isStreaming: true },
            ]);
            
            setIsTyping(false);
            isReceivingStreamRef.current = true;

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value, { stream: true });
                    aiContent += chunk;
                    updateChatMessages(capturedChatId, (msgs) => 
                        msgs.map(m => m.id === aiMessageId ? { ...m, content: aiContent } : m)
                    );
                }
            } finally {
                updateChatMessages(capturedChatId, (msgs) => 
                    msgs.map(m => m.id === aiMessageId ? { ...m, content: aiContent, isStreaming: false } : m)
                );
                isReceivingStreamRef.current = false;
            }
        } catch (error: any) {
            if (error?.name === 'AbortError') return;
            console.error("Failed to fetch AI response:", error);
            setIsTyping(false);
            isReceivingStreamRef.current = false;
            toast.error("Error", { description: error.message || "Failed to connect to Velora AI." });
        } finally {
            if (abortControllerRef.current === abortController) {
                abortControllerRef.current = null;
            }
            setIsTyping(false);
            isSendingRef.current = false;
        }
    };

    const handleEditMessage = (messageId: string, content: string) => {
        setEditingMessageId(messageId);
        setEditInputValue(content);
    };

    const handleEditConfirm = (newContent: string) => {
        if (editingMessageId === null || !activeChatId) return;
        const capturedEditId = editingMessageId;
        const capturedChatId = activeChatId;
        updateChatMessages(capturedChatId, (prev) => {
            const editedIndex = prev.findIndex((msg) => msg.id === capturedEditId);
            if (editedIndex === -1) return prev;
            return prev.slice(0, editedIndex);
        });
        setEditingMessageId(null);
        setEditInputValue("");
        handleSend(newContent);
    };

    const handleCancelEdit = () => {
        setEditingMessageId(null);
        setEditInputValue("");
    };

    return (
        <div className="dark bg-slate-950 text-slate-200 min-h-screen overflow-hidden selection:bg-indigo-500/30 font-sans relative">
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(160,120,255,0.08),transparent_25%),radial-gradient(circle_at_85%_30%,rgba(76,215,246,0.06),transparent_25%)] pointer-events-none" />
            <div className="fixed inset-0 dark:bg-grid dark:opacity-[0.03] pointer-events-none" />

            <Sidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
                chatList={chatList}
                activeChatId={activeChatId}
                onCreateChat={handleCreateChat}
                onSelectChat={handleSelectChat}
                onRenameChat={handleRenameChat}
                onDeleteChat={handleDeleteChat}
                isDemo={isDemo}
            />
            
            <div className="flex flex-col h-screen transition-all duration-300 ease-in-out relative md:ml-64">
                <TopNav onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

                <main className="flex-1 flex flex-col min-h-0 relative bg-slate-950">
                    <div 
                        ref={scrollContainerRef}
                        className={cn(
                            "absolute top-16 left-0 right-0 custom-scrollbar scroll-smooth flex flex-col",
                            messages.length > 0 ? "overflow-y-auto" : "overflow-y-hidden max-md:overflow-y-auto md:no-scrollbar justify-center"
                        )}
                        style={{ 
                            bottom: `${inputHeight}px`,
                            willChange: "transform", 
                            backfaceVisibility: "hidden", 
                            WebkitOverflowScrolling: "touch",
                            scrollbarGutter: "stable"
                        }}
                    >
                        <div 
                            className="max-w-3xl mx-auto w-full px-4 sm:px-6 flex flex-col min-h-full pb-8"
                        >
                            {isLoadingMessages ? (
                                <div className="flex flex-col items-center justify-center w-full my-auto py-20 space-y-4">
                                    <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                                    <p className="text-slate-400 animate-pulse text-sm">Memuat percakapan...</p>
                                </div>
                            ) : !activeChatId ? (
                                <div className="flex flex-col items-center w-full pt-4 pb-8 sm:pt-6 sm:pb-12 md:pt-8 md:pb-16 space-y-6 sm:space-y-10">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                        className="text-center space-y-4"
                                    >
                                        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white px-4">
                                            How can I help you today?
                                        </h1>
                                        <p className="text-slate-400 text-base md:text-lg max-w-md mx-auto px-4 leading-relaxed">
                                            I'm Velora AI, your advanced assistant for deep analysis and creative problem solving.
                                        </p>
                                    </motion.div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-2xl px-4 pb-12 sm:pb-10">
                                        {QUICK_ACTIONS.map((action, i) => (
                                            <motion.button
                                                key={i}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                                                onClick={() => handleSend(action.label + " " + action.detail)}
                                                className="group p-4 sm:p-4 bg-slate-900/50 hover:bg-slate-800/80 border border-white/5 hover:border-indigo-500/40 rounded-2xl text-left transition-all duration-300 shadow-xl"
                                            >
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="shrink-0 p-2 sm:p-2 rounded-lg bg-slate-800 group-hover:bg-indigo-500/20 transition-colors">{action.icon}</div>
                                                    <span className="text-base sm:text-sm font-bold sm:font-semibold text-slate-200 group-hover:text-white leading-tight">{action.label}</span>
                                                </div>
                                                <p className="text-[13px] sm:text-xs text-slate-500 group-hover:text-slate-400 ml-11 sm:ml-10 leading-relaxed">{action.detail}</p>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6 pt-12 w-full pb-10">
                                    {messages.length === 0 && !isTyping && (
                                        <div className="text-center py-20">
                                            <div className="inline-flex p-4 rounded-full bg-slate-900 mb-4">
                                                <MessageSquare className="w-8 h-8 text-indigo-500 opacity-50" />
                                            </div>
                                            <p className="text-slate-500">Belum ada pesan dalam percakapan ini.</p>
                                        </div>
                                    )}
                                    {messages.map((msg) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, ease: "easeOut" }}
                                            className={cn("flex w-full", msg.role === "user" ? "justify-end" : "justify-start")}
                                        >
                                            {msg.role === "user" ? (
                                                <UserMessage 
                                                    content={msg.content} 
                                                    time={msg.time}
                                                    attachments={msg.attachments}
                                                    onEdit={(newContent) => handleEditMessage(msg.id, newContent)}
                                                />
                                            ) : (
                                                <AIMessage content={msg.content} isStreaming={msg.isStreaming} />
                                            )}
                                        </motion.div>
                                    ))}
                                    {isTyping && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                            <TypingIndicator />
                                        </motion.div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <AnimatePresence>
                        {!shouldAutoScroll && messages.length > 0 && (
                            <motion.button
                                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                                onClick={() => {
                                    scrollToBottom("smooth");
                                    setShouldAutoScroll(true);
                                }}
                                className="absolute left-1/2 -translate-x-1/2 z-30 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-2xl transition-all duration-200 active:scale-90 border border-indigo-400/30 backdrop-blur-md"
                                style={{ bottom: `${inputHeight + 24}px` }}
                                title="Scroll to latest"
                            >
                                <ArrowDown className="w-4 h-4" />
                            </motion.button>
                        )}
                    </AnimatePresence>

                    <div 
                        ref={inputContainerRef}
                        className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none pb-4 sm:pb-safe"
                    >
                        <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 pointer-events-auto">
                            <InputArea
                                onSend={handleSend}
                                isTyping={isTyping}
                                editingValue={editInputValue}
                                isEditing={editingMessageId !== null}
                                onEditConfirm={handleEditConfirm}
                                onCancelEdit={handleCancelEdit}
                                isDemo={isDemo}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default VeloraAIChat;

"use client";

import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MessageCircle, X, Send } from 'lucide-react';

// Initialize the Gemini API using Vite's environment variable syntax
// Added a fallback string ("") so TypeScript doesn't complain if the env var is undefined
const apiKey: string = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// 1. Define the exact structure of a message object for TypeScript
interface ChatMessage {
    text: string;
    sender: 'user' | 'bot';
}

const PotholeChatbot: React.FC = () => {
    // 2. Strongly type all the state variables
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [input, setInput] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // 3. Tell the messages state that it can ONLY hold an array of ChatMessage objects
    const [messages, setMessages] = useState<ChatMessage[]>([
        { text: "Johar! How can I help you report a pothole or road issue in Chhattisgarh today?", sender: "bot" }
    ]);

    const handleSend = async () => {
        if (!input.trim()) return;

        // Add user message to UI immediately
        const userMessage: ChatMessage = { text: input, sender: "user" };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // Create a context-aware prompt so the AI acts like a government assistant
            const systemContext = "You are a helpful assistant for the Chhattisgarh Government Pothole Intelligence website. Keep responses brief, helpful, and polite. User question: ";

            const result = await model.generateContent(systemContext + input);
            const botResponse: ChatMessage = { text: result.response.text(), sender: "bot" };

            setMessages((prev) => [...prev, botResponse]);
        } catch (error) {
            console.error("Error communicating with Gemini:", error);
            setMessages((prev) => [...prev, { text: "Sorry, I am facing a connection issue. Please verify your API key and try again.", sender: "bot" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {isOpen ? (
                <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden transition-all duration-300 ease-in-out h-[500px]">

                    {/* Chat Header */}
                    <div className="bg-orange-500 p-4 flex justify-between items-center text-white shadow-md">
                        <div>
                            <h3 className="font-semibold text-lg tracking-wide">CG Pothole Assistant</h3>
                            <p className="text-xs text-orange-100">Powered by AI</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-orange-600 p-1 rounded-full transition-colors"
                            aria-label="Close Chat"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Chat Messages Area */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`p-3 rounded-xl max-w-[85%] text-sm leading-relaxed ${msg.sender === 'user'
                                    ? 'bg-orange-500 text-white self-end rounded-br-sm shadow-sm'
                                    : 'bg-white border border-gray-200 text-gray-800 self-start rounded-bl-sm shadow-sm'
                                    }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="text-gray-400 text-xs animate-pulse ml-2">
                                Assistant is typing...
                            </div>
                        )}
                    </div>

                    {/* Chat Input Area */}
                    <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
                        {/* 4. Added explicit types to the events (Optional, but good practice in TS) */}
                        <input
                            value={input}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSend()}
                            placeholder="Type your question..."
                            className="flex-1 px-4 py-2 bg-gray-100 border-transparent rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm transition-all"
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="bg-orange-500 text-white p-2.5 rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md flex items-center justify-center"
                            aria-label="Send Message"
                        >
                            <Send size={18} />
                        </button>
                    </div>

                </div>
            ) : (
                /* Floating Bubble Button */
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-orange-500 text-white p-4 rounded-full shadow-2xl hover:bg-orange-600 transition-transform hover:scale-105 active:scale-95 flex items-center justify-center"
                    aria-label="Open Chat"
                >
                    <MessageCircle size={28} />
                </button>
            )}
        </div>
    );
};

export default PotholeChatbot;
import React, { createContext, useContext, useEffect, useState } from "react";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | string;
  content: string;
};

type ChatContextValue = {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  addMessage: (m: ChatMessage) => void;
  clearMessages: () => void;
};

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const raw = localStorage.getItem("chat_messages");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
  }, [messages]);

  const addMessage = (m: ChatMessage) => setMessages((s) => [...s, m]);
  const clearMessages = () => {
    setMessages([]);
    try {
      localStorage.removeItem("chat_messages");
    } catch {}
  };

  return (
    <ChatContext.Provider
      value={{ messages, setMessages, addMessage, clearMessages }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
};

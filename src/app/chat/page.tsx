import type { Metadata } from "next";
import ChatClient from "./ChatClient";

export const metadata: Metadata = {
  title: "AI助手 | Nova AI",
  description: "与 Nova AI 实时对话，把问题和想法转化为清晰行动。",
};

export default function ChatPage() {
  return <ChatClient />;
}

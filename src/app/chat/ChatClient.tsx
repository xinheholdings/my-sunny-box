"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import ParticleField from "../components/ParticleField";
import styles from "./chat.module.css";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  animate?: boolean;
};

const starterMessage: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "你好，我是 SunnyBox AI。你可以和我一起梳理想法、学习新知识，或推进一个真正的产品。今天想从哪里开始？",
};

const prompts = [
  "帮我规划一个 AI 产品",
  "把一个模糊想法整理清楚",
  "为我制定本周学习计划",
];

function TypewriterText({ text, animate }: { text: string; animate?: boolean }) {
  const [visibleLength, setVisibleLength] = useState(animate ? 0 : text.length);

  useEffect(() => {
    if (!animate) {
      setVisibleLength(text.length);
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) {
      setVisibleLength(text.length);
      return;
    }

    let frame = 0;
    const startedAt = performance.now();
    const charactersPerSecond = 42;

    function reveal(now: number) {
      const nextLength = Math.min(
        text.length,
        Math.floor(((now - startedAt) / 1000) * charactersPerSecond),
      );
      setVisibleLength(nextLength);
      if (nextLength < text.length) frame = requestAnimationFrame(reveal);
    }

    frame = requestAnimationFrame(reveal);
    return () => cancelAnimationFrame(frame);
  }, [animate, text]);

  return (
    <>
      {text.slice(0, visibleLength)}
      {animate && visibleLength < text.length && (
        <span className={styles.typeCursor} aria-hidden="true" />
      )}
    </>
  );
}

export default function ChatClient() {
  const [messages, setMessages] = useState<Message[]>([starterMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function sendMessage(content: string) {
    const text = content.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages
            .filter((message) => message.id !== "welcome")
            .slice(-20)
            .map(({ role, content: messageContent }) => ({
              role,
              content: messageContent,
            })),
        }),
      });

      const data = (await response.json()) as { text?: string; error?: string };
      if (!response.ok || !data.text) {
        throw new Error(data.error || "请求失败");
      }

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.text!,
          animate: true,
        },
      ]);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "AI 服务暂时无法响应，请稍后再试。",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(input);
    }
  }

  function resetChat() {
    setMessages([starterMessage]);
    setInput("");
    setError("");
  }

  return (
    <main className={styles.shell}>
      <ParticleField />
      <header className={styles.header}>
        <a className={styles.brand} href="/">
          <span className={styles.signal}><i /></span>
          <span>SunnyBox <b>AI</b></span>
        </a>
        <nav className={styles.navLinks} aria-label="主导航">
          <a href="/">首页</a>
          <a className={styles.active} href="/chat">AI助手</a>
          <a href="/#about">关于我们</a>
          <a href="/#contact">联系我们</a>
        </nav>
        <div className={styles.headerStatus}>
          <span><i /> AI CORE READY</span>
          <button type="button" onClick={resetChat}>清空对话</button>
        </div>
      </header>

      <div className={styles.workspace}>
        <aside className={styles.sidebar}>
          <a href="/" className={styles.backLink}>← 返回首页</a>
          <div>
            <p className={styles.eyebrow}>SUNNYBOX AI / ASSISTANT</p>
            <h1>AI助手</h1>
            <p>从问题到行动，SunnyBox AI 始终与你在同一个上下文中。</p>
          </div>
          <div className={styles.systemCard}>
            <div><span>连接状态</span><b>安全连接</b></div>
            <div><span>交互模式</span><b>多轮对话</b></div>
            <div><span>语言</span><b>中文优先</b></div>
          </div>
        </aside>

        <section className={styles.chatPanel} aria-label="AI 聊天">
          <div className={styles.messages} aria-live="polite">
            {messages.map((message) => (
              <article
                className={`${styles.message} ${styles[message.role]}`}
                key={message.id}
              >
                <div className={styles.avatar}>
                  {message.role === "assistant" ? "AI" : "你"}
                </div>
                <div>
                  <p className={styles.messageLabel}>
                    {message.role === "assistant" ? "SUNNYBOX AI" : "YOU"}
                  </p>
                  <div className={styles.bubble}>
                    <TypewriterText
                      animate={message.animate}
                      text={message.content}
                    />
                  </div>
                </div>
              </article>
            ))}

            {messages.length === 1 && (
              <div className={styles.promptGrid}>
                {prompts.map((prompt) => (
                  <button
                    type="button"
                    key={prompt}
                    onClick={() => void sendMessage(prompt)}
                  >
                    <span>↗</span>{prompt}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className={`${styles.message} ${styles.assistant}`}>
                <div className={styles.avatar}>AI</div>
                <div className={styles.thinking} aria-label="AI 正在思考">
                  <i /><i /><i />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className={styles.composerWrap}>
            {error && <p className={styles.error} role="alert">{error}</p>}
            <form className={styles.composer} onSubmit={handleSubmit}>
              <textarea
                aria-label="输入消息"
                maxLength={4000}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入你的问题或想法…"
                rows={1}
                value={input}
              />
              <button
                aria-label="发送消息"
                disabled={!input.trim() || isLoading}
                type="submit"
              >
                {isLoading ? "处理中" : "发送"} <span>↗</span>
              </button>
            </form>
            <p>Enter 发送 · Shift + Enter 换行 · AI 可能会犯错，请核实重要信息</p>
          </div>
        </section>
      </div>
    </main>
  );
}

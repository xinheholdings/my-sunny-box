import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getPrismaClient } from "@/lib/prisma";
import LogoutButton from "./LogoutButton";
import styles from "./account.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "用户中心 | SunnyBox AI",
  description: "管理 SunnyBox AI 账户、对话记录与收藏。",
};

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [messages, favorites] = await Promise.all([
    getPrismaClient().chatMessage.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    getPrismaClient().favorite.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { product: true },
    }),
  ]);

  const initial = (user.displayName || user.email).slice(0, 1).toUpperCase();

  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link className={styles.brand} href="/">
          SunnyBox <b>SUNNYBOX AI</b>
        </Link>
        <div className={styles.navLinks}>
          <Link href="/">首页</Link>
          <Link href="/chat">AI助手</Link>
          <Link href="/#about">关于我们</Link>
        </div>
      </nav>

      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.avatar}>{initial}</div>
          <div>
            <p className={styles.eyebrow}>PROFILE / 用户档案</p>
            <h1>{user.displayName || "SunnyBox 用户"}</h1>
            <p>{user.email}</p>
          </div>
          <span className={styles.plan}>SUNNYBOX ACCOUNT</span>
        </header>

        <div className={styles.grid}>
          <section className={styles.panel}>
            <p className={styles.panelTitle}>ACCOUNT / 账户概览</p>
            <div className={styles.info}>
              <div><span>显示名称</span><b>{user.displayName || "未设置"}</b></div>
              <div><span>邮箱</span><b>{user.email}</b></div>
              <div><span>创建日期</span><b>{user.createdAt.toLocaleDateString("zh-CN")}</b></div>
              <div><span>账户 ID</span><b>{user.id.slice(0, 8)}…</b></div>
            </div>
            <div className={styles.stats}>
              <div className={styles.stat}><strong>{user.usageCount}</strong><span>AI 使用次数</span></div>
              <div className={styles.stat}><strong>{favorites.length}</strong><span>收藏项目</span></div>
            </div>
            <div className={styles.actions}>
              <Link className={styles.action} href="/chat">继续对话</Link>
              <LogoutButton />
            </div>
          </section>

          <section className={styles.panel}>
            <p className={styles.panelTitle}>CONVERSATIONS / 最近 AI 对话</p>
            <div className={styles.history}>
              {messages.length === 0 ? (
                <div className={styles.emptyState}>
                  <b>暂无对话记录</b>
                  <p>前往 AI 助手开始第一段对话。</p>
                  <Link href="/chat">打开 AI 助手 →</Link>
                </div>
              ) : (
                messages.map((message) => (
                  <article className={`${styles.message} ${message.role === "user" ? styles.user : ""}`} key={message.id}>
                    <div>
                      <span>{message.role === "user" ? "YOU" : "SUNNYBOX AI"}</span>
                      <time>{message.createdAt.toLocaleString("zh-CN")}</time>
                    </div>
                    <p>{message.content}</p>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className={styles.panel}>
            <p className={styles.panelTitle}>SAVED / 收藏项目</p>
            {favorites.length === 0 ? (
              <div className={styles.emptyState}>
                <b>暂无收藏</b>
                <p>收藏的产品与内容会显示在这里。</p>
              </div>
            ) : (
              <div className={styles.savedGrid}>
                {favorites.map(({ id, product }) => (
                  <article key={id}>
                    <span>{product.category}</span>
                    <b>{product.name}</b>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className={styles.panel}>
            <p className={styles.panelTitle}>SETTINGS / 账户设置</p>
            <div className={styles.settingList}>
              <div><span>登录邮箱</span><b>{user.email}</b></div>
              <div><span>密码安全</span><b>已加密保护</b></div>
              <div><span>会话保护</span><b>安全 Cookie</b></div>
            </div>
            <p className={styles.settingNote}>密码和会话凭证不会发送到客户端页面。</p>
          </section>
        </div>
      </div>
    </main>
  );
}

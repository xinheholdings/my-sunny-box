import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminUserDetails } from "@/lib/admin-data";
import styles from "../../admin.module.css";

export const metadata: Metadata = {
  title: "用户详情 | SunnyBox Admin",
};

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getAdminUserDetails(id);
  if (!user) notFound();

  return (
    <div className={styles.content}>
      <Link className={styles.backLink} href="/admin">← 返回用户列表</Link>

      <header className={styles.userHeader}>
        <div className={styles.avatar}>{(user.displayName || user.email).slice(0, 1).toUpperCase()}</div>
        <div>
          <p className={styles.eyebrow}>USER / DETAIL</p>
          <h1>{user.displayName || "未设置显示名称"}</h1>
          <p>{user.email}</p>
        </div>
        <span className={`${styles.role} ${user.role === "ADMIN" ? styles.adminRole : ""}`}>{user.role}</span>
      </header>

      <div className={styles.detailGrid}>
        <section className={styles.panel}>
          <p className={styles.panelTitle}>ACCOUNT / 用户信息</p>
          <dl className={styles.infoList}>
            <div><dt>用户 ID</dt><dd>{user.id}</dd></div>
            <div><dt>邮箱</dt><dd>{user.email}</dd></div>
            <div><dt>显示名称</dt><dd>{user.displayName || "未设置"}</dd></div>
            <div><dt>注册时间</dt><dd>{user.createdAt.toLocaleString("zh-CN")}</dd></div>
            <div><dt>AI 使用次数</dt><dd>{user.usageCount}</dd></div>
            <div><dt>角色</dt><dd>{user.role}</dd></div>
            <div><dt>套餐</dt><dd>{user.plan}</dd></div>
            <div><dt>订阅状态</dt><dd>{user.subscriptionStatus}</dd></div>
            <div><dt>Stripe Customer</dt><dd>{user.stripeCustomerId || "未绑定"}</dd></div>
            <div><dt>Stripe Subscription</dt><dd>{user.stripeSubscriptionId || "未绑定"}</dd></div>
          </dl>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.panelTitle}>CONVERSATION / MESSAGE</p>
              <span>{user.conversations.length} 条聊天记录</span>
            </div>
          </div>

          {user.conversations.length === 0 ? (
            <div className={styles.empty}>该用户暂无 AI 聊天记录。</div>
          ) : (
            <div className={styles.messages}>
              {user.conversations.map((message) => (
                <article className={`${styles.message} ${message.role === "user" ? styles.userMessage : ""}`} key={message.id}>
                  <div>
                    <b>{message.role === "user" ? "USER" : "SUNNYBOX AI"}</b>
                    <time>{message.createdAt.toLocaleString("zh-CN")}</time>
                  </div>
                  <p>{message.content}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

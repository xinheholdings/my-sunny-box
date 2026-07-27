import type { Metadata } from "next";
import Link from "next/link";
import { getAdminDashboardData } from "@/lib/admin-data";
import styles from "./admin.module.css";

export const metadata: Metadata = {
  title: "Admin Dashboard | SunnyBox AI",
  description: "SunnyBox AI 管理员控制台。",
};

export default async function AdminDashboardPage() {
  const { totalUsers, users } = await getAdminDashboardData();

  return (
    <div className={styles.content}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>SYSTEM / ADMINISTRATION</p>
          <h1>Admin Dashboard</h1>
          <p>查看 SunnyBox AI 用户和对话使用情况。</p>
        </div>
        <div className={styles.totalCard}>
          <span>注册用户总数</span>
          <strong>{totalUsers}</strong>
        </div>
      </header>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <p className={styles.panelTitle}>USERS / 注册用户</p>
            <span>{users.length} 条记录</span>
          </div>
        </div>

        {users.length === 0 ? (
          <div className={styles.empty}>暂无注册用户。</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>邮箱</th>
                  <th>显示名称</th>
                  <th>注册时间</th>
                  <th>AI 使用次数</th>
                  <th>角色</th>
                  <th>套餐</th>
                  <th>订阅状态</th>
                  <th>Stripe Customer</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td><code>{user.id.slice(0, 8)}…</code></td>
                    <td>{user.email}</td>
                    <td>{user.displayName || "未设置"}</td>
                    <td>{user.createdAt.toLocaleString("zh-CN")}</td>
                    <td>{user.usageCount}</td>
                    <td><span className={`${styles.role} ${user.role === "ADMIN" ? styles.adminRole : ""}`}>{user.role}</span></td>
                    <td><span className={`${styles.role} ${user.plan === "PRO" ? styles.proPlan : ""}`}>{user.plan}</span></td>
                    <td>{user.subscriptionStatus}</td>
                    <td><code>{user.stripeCustomerId || "—"}</code></td>
                    <td><Link className={styles.detailLink} href={`/admin/users/${user.id}`}>查看 →</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import styles from "../pricing/pricing.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "升级完成 | SunnyBox AI",
};

export default async function SuccessPage() {
  const user = await getCurrentUser();
  const isPro = user?.plan === "PRO" && user.subscriptionStatus === "ACTIVE";

  return (
    <main className={styles.resultPage}>
      <section className={styles.resultCard}>
        <div className={styles.resultMark}>✓</div>
        <h1>{isPro ? "Pro 已激活" : "支付已完成"}</h1>
        <p>
          {isPro
            ? "你的 SunnyBox AI Pro 套餐已经生效。"
            : "Stripe 正在确认订阅状态，请稍后刷新用户中心。套餐只会由已验证的 Webhook 激活。"}
        </p>
        <div className={styles.resultActions}>
          <Link href="/account">查看账户</Link>
          <Link href="/chat">打开 AI 助手</Link>
        </div>
      </section>
    </main>
  );
}

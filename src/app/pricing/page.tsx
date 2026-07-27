import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import UpgradeButton from "./UpgradeButton";
import styles from "./pricing.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "套餐价格 | SunnyBox AI",
  description: "选择 SunnyBox AI Free 或 Pro 套餐。",
};

export default async function PricingPage() {
  const user = await getCurrentUser();
  const isPro = user?.plan === "PRO" && user.subscriptionStatus === "ACTIVE";

  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link className={styles.brand} href="/">
          SunnyBox <b>SUNNYBOX AI</b>
        </Link>
        <div>
          <Link href="/chat">AI助手</Link>
          <Link href={user ? "/account" : "/login"}>{user ? "用户中心" : "登录"}</Link>
        </div>
      </nav>

      <div className={styles.content}>
        <header className={styles.header}>
          <p>PLANS / SUNNYBOX AI</p>
          <h1>选择适合你的智能能力</h1>
          <span>从免费体验开始，需要更多能力时随时升级。</span>
        </header>

        <div className={styles.plans}>
          <article className={styles.planCard}>
            <p className={styles.planLabel}>FREE</p>
            <h2>Free</h2>
            <div className={styles.price}><strong>$0</strong><span>/ forever</span></div>
            <ul>
              <li>基础 AI 聊天</li>
              <li>每天 10 次免费额度</li>
              <li>SunnyBox 基础功能</li>
            </ul>
            <Link className={styles.freeButton} href="/chat">
              {user?.plan === "FREE" ? "当前套餐" : "开始使用"}
            </Link>
          </article>

          <article className={`${styles.planCard} ${styles.proCard}`}>
            <span className={styles.recommended}>RECOMMENDED</span>
            <p className={styles.planLabel}>PRO</p>
            <h2>Pro</h2>
            <div className={styles.price}><strong>$9.99</strong><span>/ month</span></div>
            <ul>
              <li>每天 1000 次 AI 额度</li>
              <li>优先响应</li>
              <li>高级功能持续开放</li>
            </ul>
            <UpgradeButton isPro={isPro} />
          </article>
        </div>

        <p className={styles.disclaimer}>
          支付由 Stripe 安全处理。SunnyBox AI 不保存银行卡信息。
        </p>
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import styles from "../pricing/pricing.module.css";

export const metadata: Metadata = {
  title: "支付已取消 | SunnyBox AI",
};

export default function CancelPage() {
  return (
    <main className={styles.resultPage}>
      <section className={styles.resultCard}>
        <div className={styles.resultMark}>×</div>
        <h1>支付已取消</h1>
        <p>你的套餐没有发生变化。准备好后可以重新开始升级。</p>
        <div className={styles.resultActions}>
          <Link href="/pricing">返回价格页面</Link>
          <Link href="/">返回首页</Link>
        </div>
      </section>
    </main>
  );
}

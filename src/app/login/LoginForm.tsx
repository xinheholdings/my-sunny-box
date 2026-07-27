"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../auth.module.css";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "登录失败。");

      router.replace("/account");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "登录服务暂时不可用。");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <Link className={styles.brand} href="/">
          <span className={styles.mark}><i /></span>
          <span>SunnyBox <b>SUNNYBOX AI</b></span>
        </Link>
        <section className={styles.card}>
          <p className={styles.eyebrow}>WELCOME BACK</p>
          <h1>登录</h1>
          <p className={styles.intro}>继续你的 AI 对话与个人使用记录。</p>
          <form className={styles.form} onSubmit={submit}>
            <label className={styles.field}>
              <span>邮箱</span>
              <input autoComplete="email" disabled={loading} onChange={(event) => setEmail(event.target.value)} required type="email" value={email} />
            </label>
            <label className={styles.field}>
              <span>密码</span>
              <input autoComplete="current-password" disabled={loading} onChange={(event) => setPassword(event.target.value)} required type="password" value={password} />
            </label>
            {error && <p className={styles.error} role="alert">{error}</p>}
            <button className={styles.submit} disabled={loading} type="submit">
              {loading ? "正在验证…" : "登录"}
            </button>
          </form>
          <p className={styles.switch}>还没有账户？ <Link href="/register">免费注册</Link></p>
        </section>
        <Link className={styles.back} href="/">← 返回首页</Link>
      </div>
    </main>
  );
}

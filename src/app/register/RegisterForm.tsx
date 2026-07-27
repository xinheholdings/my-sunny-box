"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../auth.module.css";

export default function RegisterForm() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("两次输入的密码不一致。");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, email, password }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "注册失败。");

      router.replace("/account");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "注册服务暂时不可用。");
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
          <p className={styles.eyebrow}>CREATE ACCOUNT</p>
          <h1>注册账户</h1>
          <p className={styles.intro}>创建账户后即可保存 AI 对话和个人收藏。</p>
          <form className={styles.form} onSubmit={submit}>
            <label className={styles.field}>
              <span>显示名称</span>
              <input autoComplete="name" disabled={loading} maxLength={50} minLength={2} onChange={(event) => setDisplayName(event.target.value)} required value={displayName} />
            </label>
            <label className={styles.field}>
              <span>邮箱</span>
              <input autoComplete="email" disabled={loading} onChange={(event) => setEmail(event.target.value)} required type="email" value={email} />
            </label>
            <label className={styles.field}>
              <span>密码（至少 10 个字符）</span>
              <input autoComplete="new-password" disabled={loading} maxLength={128} minLength={10} onChange={(event) => setPassword(event.target.value)} required type="password" value={password} />
            </label>
            <label className={styles.field}>
              <span>确认密码</span>
              <input autoComplete="new-password" disabled={loading} maxLength={128} minLength={10} onChange={(event) => setConfirmPassword(event.target.value)} required type="password" value={confirmPassword} />
            </label>
            {error && <p className={styles.error} role="alert">{error}</p>}
            <button className={styles.submit} disabled={loading} type="submit">
              {loading ? "正在创建…" : "创建账户"}
            </button>
          </form>
          <p className={styles.switch}>已有账户？ <Link href="/login">直接登录</Link></p>
        </section>
        <Link className={styles.back} href="/">← 返回首页</Link>
      </div>
    </main>
  );
}

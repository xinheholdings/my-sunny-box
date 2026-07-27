"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./account.module.css";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <button className={styles.signOut} disabled={loading} onClick={logout} type="button">
      {loading ? "正在退出…" : "退出登录"}
    </button>
  );
}

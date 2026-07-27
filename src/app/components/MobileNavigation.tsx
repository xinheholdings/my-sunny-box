"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type AuthState = "loading" | "authenticated" | "anonymous";

export default function MobileNavigation({
  className = "",
}: {
  className?: string;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [authState, setAuthState] = useState<AuthState>("loading");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/user/me", {
      cache: "no-store",
      credentials: "same-origin",
      signal: controller.signal,
    })
      .then((response) => setAuthState(response.ok ? "authenticated" : "anonymous"))
      .catch(() => {
        if (!controller.signal.aborted) setAuthState("anonymous");
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    function closeOnOutsideClick(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  async function logout() {
    setLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
      if (!response.ok) throw new Error("Logout failed");
      setAuthState("anonymous");
      setOpen(false);
      router.push("/");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className={`mobileNavigation ${className}`} ref={containerRef}>
      <button
        aria-controls="mobile-navigation-panel"
        aria-expanded={open}
        aria-label={open ? "关闭菜单" : "打开菜单"}
        className="mobileMenuToggle"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <span />
        <span />
        <span />
      </button>

      {open && (
        <div className="mobileMenuPanel" id="mobile-navigation-panel">
          <a href="/">首页</a>
          <a href="/chat">AI助手</a>

          {authState === "authenticated" ? (
            <>
              <a href="/account">用户中心</a>
              <button disabled={loggingOut} onClick={logout} type="button">
                {loggingOut ? "正在退出…" : "退出登录"}
              </button>
            </>
          ) : (
            <>
              <a href="/login">登录</a>
              <a className="mobileRegisterLink" href="/register">注册</a>
            </>
          )}
        </div>
      )}
    </div>
  );
}

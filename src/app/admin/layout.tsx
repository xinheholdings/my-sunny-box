import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/");

  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link className={styles.brand} href="/admin">
          SunnyBox <b>ADMIN CONTROL</b>
        </Link>
        <div className={styles.navLinks}>
          <Link href="/admin">Dashboard</Link>
          <Link href="/account">用户中心</Link>
          <Link href="/">返回网站</Link>
        </div>
      </nav>
      {children}
    </main>
  );
}

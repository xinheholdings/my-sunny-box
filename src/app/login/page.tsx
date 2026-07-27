import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "登录 | SunnyBox AI",
  description: "登录 SunnyBox AI，进入你的用户中心。",
};

export default function LoginPage() {
  return <LoginForm />;
}

import type { Metadata } from "next";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "注册 | SunnyBox AI",
  description: "创建 SunnyBox AI 账户。",
};

export default function RegisterPage() {
  return <RegisterForm />;
}

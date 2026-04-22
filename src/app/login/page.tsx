import { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your UPPERMOON account to track orders, manage your profile, and access exclusive member benefits.",
};

export default function LoginPage() {
  return <LoginClient />;
}

import { Metadata } from "next";
import RegisterClient from "./RegisterClient";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Join the UPPERMOON community. Create your account to shop premium minimalist streetwear and get exclusive access to new drops.",
};

export default function RegisterPage() {
  return <RegisterClient />;
}

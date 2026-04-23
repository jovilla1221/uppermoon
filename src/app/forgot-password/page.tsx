import type { Metadata } from "next";
import ForgotPasswordClient from "./ForgotPasswordClient";

export const metadata: Metadata = {
  title: "Reset Password | UPPERMOON",
  description: "Reset your UPPERMOON account password",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}

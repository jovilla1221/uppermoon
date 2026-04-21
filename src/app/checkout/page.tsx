import { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "CHECKOUT | UPPERMOON",
  description: "Secure checkout for your minimalist urban essentials.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}

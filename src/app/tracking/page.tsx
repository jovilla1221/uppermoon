import { Metadata } from "next";
import TrackingClient from "./TrackingClient";

export const metadata: Metadata = {
  title: "Track Order",
  description: "Track your UPPERMOON package shipment in real-time. Enter your waybill number to see live delivery status updates.",
};

export default function TrackingPage() {
  return <TrackingClient />;
}

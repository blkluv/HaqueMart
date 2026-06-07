import type { Metadata } from "next";
import { OrderConfirmation } from "./OrderConfirmation";

export const metadata: Metadata = {
  title: "Order confirmed — Camp Creek Market",
};

interface Props {
  searchParams: Promise<{ order?: string }>;
}

export default async function SuccessPage({ searchParams }: Props) {
  const { order } = await searchParams;
  return <OrderConfirmation orderId={order ?? "HM-UNKNOWN"} />;
}

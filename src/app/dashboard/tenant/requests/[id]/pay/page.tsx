import { redirect } from "next/navigation";
import { getRentalRequestById } from "@/app/features/api/rental.api";
import PaymentPageClient from "./_components/PaymentPageClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RequestPayPage({ params }: PageProps) {
  const { id } = await params;

  const result = await getRentalRequestById(id);
  if (!result.ok) throw new Error(result.message || "Unable to load rental request");
  const rentalRequest = result?.data?.data ?? result?.data;
  if (!rentalRequest || typeof rentalRequest !== "object") throw new Error("Rental request was not found");

  if (rentalRequest) {
    const statusUpper = (rentalRequest.status || "").toUpperCase();
    const paymentStatus = (rentalRequest.paymentStatus || "").toUpperCase();
    if (paymentStatus === "PAID" || statusUpper === "ACTIVE" || statusUpper === "COMPLETED") {
      redirect("/dashboard/tenant?notice=already_paid");
    }
    if (statusUpper !== "APPROVED") redirect("/dashboard/tenant/requests");
  }

  return <PaymentPageClient request={rentalRequest} />;
}

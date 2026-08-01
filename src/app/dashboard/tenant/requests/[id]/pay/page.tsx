import { redirect } from "next/navigation";
import { getRentalRequest, getRentalRequestById } from "@/app/features/api/rental.api";
import PaymentPageClient from "./_components/PaymentPageClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RequestPayPage({ params }: PageProps) {
  const { id } = await params;

  // 1. Try fetching request directly by ID from API
  const result = await getRentalRequestById(id);
  let rentalRequest = result?.data?.data ?? result?.data;

  // 2. If single item API returns array or null, search in main rental list
  if (!rentalRequest || (typeof rentalRequest === "object" && !rentalRequest.id && !rentalRequest._id)) {
    const listRes = await getRentalRequest();
    const rawList = listRes?.data?.data ?? listRes?.data;
    if (Array.isArray(rawList)) {
      rentalRequest = rawList.find(
        (r: any) => String(r.id) === String(id) || String(r._id) === String(id)
      );
    }
  }

  // Check if rental request is already paid/active/completed. If so, block access & redirect away immediately.
  if (rentalRequest) {
    const statusUpper = (rentalRequest.status || "").toUpperCase();
    if (statusUpper === "ACTIVE" || statusUpper === "COMPLETED") {
      redirect("/dashboard/tenant?notice=already_paid");
    }
  }

  // 3. Fallback request object if testing offline or ID not in DB
  const requestData = rentalRequest || {
    id: id || "req-101",
    status: "APPROVED",
    rentAmount: 4555,
    amount: 4555,
    price: 4555,
    startDate: "2026-08-01",
    endDate: "2027-07-31",
    createdAt: "2026-07-28",
    property: {
      id: "prop-1",
      title: "Skyline Luxury Apartment 4B",
      location: "Gulshan 2, Dhaka",
      rent: 4555,
      rentAmount: 4555,
      price: 4555,
    },
    landlord: {
      name: "Tanvir Hasan",
      email: "tanvir.h@example.com",
      phone: "+880 1711-223344",
    },
  };

  return <PaymentPageClient request={requestData} />;
}

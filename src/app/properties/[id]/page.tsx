import React from "react";
import { getPropertyByIdAction } from "@/app/features/property/actions/getPropertyByIdAction";
import propertyAction from "@/app/features/property/actions/propertyAction";
import PropertyDetailsClient from "./_components/PropertyDetailsClient";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  const [detailRes, listRes] = await Promise.all([
    getPropertyByIdAction(id).catch(() => null),
    propertyAction().catch(() => null),
  ]);

  const property = detailRes?.data;
  const allProperties = Array.isArray(listRes?.data) ? listRes.data : [];
  
  const relatedProperties = allProperties
    .filter(
      (p) =>
        p.id !== id &&
        (p.category?.name === property?.category?.name || p.location === property?.location)
    )
    .slice(0, 3);

  if (!property && detailRes?.status === 404) {
    notFound();
  }

  if (!property) {
    throw new Error(detailRes?.message || "Unable to load property details");
  }

  return (
    <PropertyDetailsClient
      property={property}
      relatedProperties={relatedProperties}
    />
  );
}

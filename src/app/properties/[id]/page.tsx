import React from "react";
import { getPropertyByIdAction } from "@/app/(auth)/_action/getPropertyByIdAction";
import PropertyDetailsClient from "./_components/PropertyDetailsClient";
import { Building2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const response = await getPropertyByIdAction(id);
  const property = response?.data;

  if (!property) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 bg-muted text-muted-foreground rounded-full flex items-center justify-center mx-auto">
          <Building2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Property Not Found</h2>
        <p className="text-xs text-muted-foreground">
          The requested property details could not be found or may no longer be available.
        </p>
        <Link href="/properties">
          <Button className="rounded-2xl text-xs font-bold bg-emerald-600 text-white">
            Back to All Properties
          </Button>
        </Link>
      </div>
    );
  }

  return <PropertyDetailsClient property={property} />;
}

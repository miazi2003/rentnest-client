import { getMyPropertiesAction } from "@/app/features/landlord/actions/getMyPropertiesAction";
import type { ILandlordProperty } from "../types/landlord.types";
import { LandlordPropertiesClient } from "./_components/LandlordPropertiesClient";

export const dynamic = "force-dynamic";

export default async function LandlordPropertiesPage() {
  const response = await getMyPropertiesAction();
  const properties: ILandlordProperty[] = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : [];

  return <LandlordPropertiesClient properties={properties} />;
}

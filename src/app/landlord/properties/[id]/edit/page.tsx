import { PropertyEditForm } from "@/app/dashboard/landlord/_components/PropertyEditForm";
import { getCategoriesAction } from "@/app/features/landlord/actions/getCategoriesAction";
import { getPropertyByIdAction } from "@/app/features/property/actions/getPropertyByIdAction";

export default async function LandlordEditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const propertyId = resolvedParams.id;
  const categories = await getCategoriesAction();
  const propertyRes = await getPropertyByIdAction(propertyId);
  const propertyData = propertyRes.ok ? propertyRes.data : undefined;

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto space-y-6">
      <PropertyEditForm
        propertyId={propertyId}
        initialData={propertyData}
        categories={categories}
      />
    </div>
  );
}

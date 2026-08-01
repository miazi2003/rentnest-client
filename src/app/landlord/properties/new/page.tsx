import { PropertyCreateForm } from "@/app/dashboard/landlord/_components/PropertyCreateForm";
import { getCategoriesAction } from "@/app/features/landlord/actions/getCategoriesAction";

export default async function LandlordNewPropertyPage() {
  const categories = await getCategoriesAction();

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto space-y-6">
      <PropertyCreateForm categories={categories} />
    </div>
  );
}

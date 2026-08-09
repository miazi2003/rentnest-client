import PropertyAction from "@/app/features/admin/actions/propertyActions";
import { PropertyTable } from "./_components/PropertyTable";

export default async function AdminPropertiesPage() {
  const properties = await PropertyAction()
  if (!properties.ok) throw new Error(properties.message || "Unable to load properties");
  return (
    <div>
      <PropertyTable properties = {properties}/>
    </div>
  );
}

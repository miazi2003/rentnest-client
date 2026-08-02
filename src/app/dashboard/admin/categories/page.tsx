import { getCategoriesAction } from "@/app/features/category/actions/categoryActions";
import { CategoryTable } from "./_components/CategoryTable";

export default async function AdminCategoriesPage() {
  const categories = await getCategoriesAction();

  return (
    <div>
      <CategoryTable categories={categories} />
    </div>
  );
}

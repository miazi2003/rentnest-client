import { getCategoriesAction } from "@/app/features/category/actions/categoryActions";
import { CategoryTable } from "./_components/CategoryTable";

export default async function AdminCategoriesPage() {
  const categories = await getCategoriesAction();
  if (!categories.ok) throw new Error(categories.message || "Unable to load categories");
  const responseData = categories.data;
  const categoryList = Array.isArray(responseData)
    ? responseData
    : responseData && typeof responseData === "object" && "data" in responseData && Array.isArray(responseData.data)
      ? responseData.data
      : [];

  return (
    <div>
      <CategoryTable categories={categoryList} />
    </div>
  );
}

import rentalActions from "@/app/features/admin/actions/rentalActions";
import { RentalTable } from "./_components/RentalTable";

export default async function AdminRentalsPage() {
  const rentals = await rentalActions()
  return (
    <div>
      <RentalTable rentals = {rentals}/>
    </div>
  );
}

import { getIncomingRequestsAction } from "@/app/features/landlord/actions/getIncomingRequestsAction";
import { RequestListTable } from "../_components/RequestListTable";

export default async function LandlordRequestsPage() {
  const requestList = (await getIncomingRequestsAction()) || [];

  return (
    <div className="w-full pb-8">
      <RequestListTable requests={requestList} />
    </div>
  );
}

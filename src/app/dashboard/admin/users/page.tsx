import { getUsersAction } from "@/app/features/admin/actions/userActions";
import { UserTable } from "./_components/UserTable";

export default async function AdminUsersPage() {
  const users = await getUsersAction()
  console.log(users)
  return (
    <div>
      <UserTable users = {users}/>
    </div>
  );
}

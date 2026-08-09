export interface IAdminUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  role: "ADMIN" | "LANDLORD" | "TENANT";
  status: "ACTIVE" | "BANNED";
  createdAt?: string;
  updatedAt?: string;
}

export interface IAdminDashboardStats {
  totalUsers?: number;
  totalLandlords?: number;
  totalTenants?: number;
  totalProperties?: number;
  totalRentals?: number;
}

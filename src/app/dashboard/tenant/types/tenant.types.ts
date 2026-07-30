export type RentalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "COMPLETED"
  | string;

export type TenantDashboardTab = "requests" | "payments";

export type PayMethod = "card" | "bkash" | "bank";

export interface ILandlordInfo {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
}

export interface ICategoryInfo {
  id?: string;
  name?: string;
  description?: string;
}

export interface IPropertyInfo {
  id?: string;
  title?: string;
  description?: string;
  price?: string | number;
  rent?: string | number;
  rentAmount?: string | number;
  address?: string;
  location?: string;
  landlord?: ILandlordInfo;
  category?: ICategoryInfo;
}

export interface IRentalRequest {
  id: string;
  propertyId?: string;
  title?: string;
  description?: string;
  totalPrice?: string | number;
  price?: string | number;
  rentAmount?: string | number;
  amount?: string | number;
  rent?: string | number;
  address?: string;
  location?: string;
  availability?: string;
  status?: RentalStatus;
  paymentStatus?: string;
  createdAt?: string;
  updatedAt?: string;
  startDate?: string;
  endDate?: string;
  landlord?: ILandlordInfo;
  category?: ICategoryInfo;
  property?: IPropertyInfo;
  propertyTitle?: string;
  landlordName?: string;
  landlordEmail?: string;
  landlordPhone?: string;
}

export interface IPaymentItem {
  id: string;
  transactionId?: string;
  amount: number;
  paymentMethod?: string;
  createdAt?: string;
  date?: string;
  status?: string;
  propertyTitle?: string;
  property?: {
    title?: string;
  };
  landlordName?: string;
}

export interface ITenantStats {
  totalRequests: number;
  pendingRequests: number;
  activeRentals: number;
  approvedRequests: number;
  totalPaymentAmount: number;
  totalPaymentsCount: number;
}

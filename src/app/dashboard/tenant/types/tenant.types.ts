export type RentalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "COMPLETED"
  | string;

export type TenantDashboardTab = "requests" | "payments";

export type PayMethod = "card" | "bkash" | "bank";

export interface IPropertyInfo {
  id?: string;
  title?: string;
  location?: string;
  address?: string;
  rent?: number;
  images?: string[];
}

export interface ILandlordInfo {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
}

export interface IRentalRequest {
  id: string;
  status: RentalStatus;
  rentAmount?: number;
  amount?: number;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  property?: IPropertyInfo;
  propertyTitle?: string;
  location?: string;
  landlord?: ILandlordInfo;
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

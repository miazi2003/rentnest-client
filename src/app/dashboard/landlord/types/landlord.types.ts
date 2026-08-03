export type RentalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "COMPLETED"
  | string;

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | string;

export interface ITenantUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

export interface ICategory {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ILandlordProperty {
  id: string;
  title: string;
  description?: string;
  price: string | number;
  address?: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
  availability?: string;
  landlordId?: string;
  categoryId?: string;
  createdAt?: string;
  updatedAt?: string;
  category?: ICategory;
}

export interface ILandlordRentalRequest {
  id: string;
  propertyId: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  totalPrice: string | number;
  status: RentalStatus;
  paymentStatus?: PaymentStatus;
  createdAt: string;
  updatedAt?: string;
  tenant?: ITenantUser;
  property?: ILandlordProperty;
  propertyTitle?: string;
  tenantName?: string;
  tenantEmail?: string;
  tenantPhone?: string;
  price?: string | number;
}


export type TCreatePropertyPayload = {
  title: string;
  description: string;
  price: number;
  address: string;
  latitude: number;
  longitude: number;
  images: string[];
  categoryId: string;
  availability?: string;
};
export interface ContactPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface ContactMessage extends ContactPayload {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data: ContactMessage;
}

export interface ContactActionState {
  success: boolean;
  statusCode: number;
  message: string;
  data: ContactMessage | null;
  errors?: Partial<Record<keyof ContactPayload, string>>;
}

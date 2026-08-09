
export type LoginState = {
  success: boolean;
  statusCode: number | null;
  message: string;
  data: IUser | null;
};

export type registerState = {
  success: boolean;
  statusCode: number | null;
  message: string;
  data: unknown;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export interface GoogleLoginPayload {
  credential: string;
}

export interface FacebookLoginPayload {
  accessToken: string;
}

export interface SocialAuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: IUser;
  };
}

export interface SocialAuthState {
  success: boolean;
  statusCode: number;
  message: string;
}

export type RegisterPayload = {
    name : string,
    email : string ,
    password : string,
    phone : string ,
    role : ROLE
}

export enum ROLE {
  ADMIN = "ADMIN",
  LANDLORD = "LANDLORD",
  TENANT = "TENANT",
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "ADMIN" | "LANDLORD" | "TENANT";
  status: "ACTIVE" | "BANNED";
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  getUser: () => Promise<IUser | null>;
}

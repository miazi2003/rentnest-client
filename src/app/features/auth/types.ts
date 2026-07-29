// types.ts

import { DialogTitle } from "@base-ui/react";

export type LoginState = {
  success: boolean;
  statusCode: number | null;
  message: string;
  data: any | null;
};

export type registerState = {
  success: boolean;
  statusCode: number | null;
  message: string;
  data: any | null;
};

export type LoginPayload = {
  email: string;
  password: string;
};

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
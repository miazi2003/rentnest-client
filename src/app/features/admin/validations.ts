import { z } from "zod";

import { entityIdSchema } from "../shared-validations";

export const adminUserSchema = z.object({
  id: entityIdSchema,
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().toLowerCase().email().max(254),
  phone: z.string().trim().max(20).optional(),
  role: z.enum(["ADMIN", "LANDLORD", "TENANT"]),
  status: z.enum(["ACTIVE", "BANNED"]),
});

export const adminUserStatusUpdateSchema = z.object({
  userId: entityIdSchema,
  status: z.enum(["ACTIVE", "BANNED"]),
});

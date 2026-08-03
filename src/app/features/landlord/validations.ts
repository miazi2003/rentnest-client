import { z } from "zod";
import { entityIdSchema } from "../shared-validations";

export const propertyPayloadSchema = z.object({
  title: z.string().trim().min(3, "Title must contain at least 3 characters").max(120, "Title cannot exceed 120 characters"),
  description: z.string().trim().min(10, "Description must contain at least 10 characters").max(2000, "Description cannot exceed 2000 characters"),
  price: z.coerce.number().finite("Price must be a valid number").positive("Price must be greater than 0").max(100_000_000, "Price is too large"),
  address: z.string().trim().min(5, "Address must contain at least 5 characters").max(300, "Address cannot exceed 300 characters"),
  latitude: z.coerce.number().finite().min(-90, "Latitude must be at least -90").max(90, "Latitude cannot exceed 90"),
  longitude: z.coerce.number().finite().min(-180, "Longitude must be at least -180").max(180, "Longitude cannot exceed 180"),
  images: z.array(z.string().trim().url("Every image must be a valid URL")).max(12, "A property can have at most 12 images"),
  categoryId: entityIdSchema,
  availability: z.enum(["AVAILABLE", "UNAVAILABLE"]).default("AVAILABLE"),
});

export const propertyIdSchema = entityIdSchema;

export const rentalRequestStatusSchema = z.object({
  requestId: entityIdSchema,
  status: z.enum(["APPROVED", "REJECTED"], { error: "Status must be APPROVED or REJECTED" }),
});

export type PropertyPayload = z.infer<typeof propertyPayloadSchema>;

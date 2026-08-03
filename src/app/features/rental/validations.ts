import { z } from "zod";
import { entityIdSchema } from "../shared-validations";

const dateSchema = z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date in YYYY-MM-DD format");

export const createRentalValidation = z
  .object({
    propertyId: entityIdSchema,
    startDate: dateSchema,
    endDate: dateSchema,
  })
  .superRefine(({ startDate, endDate }, context) => {
    const start = new Date(`${startDate}T00:00:00Z`);
    const end = new Date(`${endDate}T00:00:00Z`);

    if (Number.isNaN(start.getTime())) {
      context.addIssue({ code: "custom", path: ["startDate"], message: "Start date is invalid" });
    }
    if (Number.isNaN(end.getTime())) {
      context.addIssue({ code: "custom", path: ["endDate"], message: "End date is invalid" });
    }
    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end <= start) {
      context.addIssue({ code: "custom", path: ["endDate"], message: "End date must be after the start date" });
    }
  });

export type CreateRentalInput = z.infer<typeof createRentalValidation>;

import { z } from "zod";

export const CreateAdvertisementSchema = z.object({
  body: z.object({
    businessName: z.string().min(1, "Business name is required"),
    contactEmail: z.string().email("Invalid email address"),
    contactPhone: z.string().optional(),
    bannerUrl: z.string().url("Invalid banner URL"),
    websiteUrl: z.string().url("Invalid website URL").optional().or(z.literal("")),
    description: z.string().optional(),
  })
});

export const UpdateAdvertisementSchema = z.object({
  body: z.object({
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    startDate: z.string().datetime().optional().or(z.literal("")),
    endDate: z.string().datetime().optional().or(z.literal("")),
  })
});

import { z } from "zod";

export const GetListingsSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    category: z.string().optional(),
    region: z.string().optional(),
    minPrice: z.string().optional().transform((val) => {
      if (!val) return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
    maxPrice: z.string().optional().transform((val) => {
      if (!val) return undefined;
      const num = parseFloat(val);
      return isNaN(num) ? undefined : num;
    }),
    page: z.string().optional().transform((val) => {
      if (!val) return 1;
      const num = parseInt(val, 10);
      return isNaN(num) || num < 1 ? 1 : num;
    }),
    limit: z.string().optional().transform((val) => {
      if (!val) return 12;
      const num = parseInt(val, 10);
      return isNaN(num) || num < 1 ? 12 : num;
    }),
  }),
});

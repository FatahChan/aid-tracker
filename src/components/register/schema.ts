import { z } from "zod";

export const formSchema = z.object({
    email: z.string(),
    password: z.string(),
    full_name: z.string(),
    phone_number: z.string(),
    role: z.enum(["admin", "staff", "store", "beneficiary"]),
  });
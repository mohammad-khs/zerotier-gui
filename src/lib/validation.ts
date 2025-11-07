import z from "zod";

export const authSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const memberSchima = z.object({
  name: z.string().optional(),
  description: z.string().min(4, "Your description is short").optional(),
  ipAssignments: z.array(z.string()).optional(),
  authorized: z.boolean().optional(),
});

export const network = z.object({
  networkId: z.string(),
  members: z.array(memberSchima),
});

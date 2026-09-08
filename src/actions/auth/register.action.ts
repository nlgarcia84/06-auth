import { defineAction } from "astro:actions";
import { z } from "astro/zod";

export const registerUser = defineAction({
  accept: "form",
  input: z.object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(6),
    remember_me: z.boolean().optional(),
  }),
  handler: async ({ name, email, password, remember_me }, { cookies }) => {
    if (remember_me) {
      cookies.set("email", email, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        path: "/", // 1 year
      });
    } else {
      cookies.delete("email", { path: "/" });
    }
    return { ok: true, message: "User registered successfully!" };
  },
});

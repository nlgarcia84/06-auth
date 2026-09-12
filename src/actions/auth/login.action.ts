import { defineAction } from "astro:actions";
import { z } from "astro/zod";
import { firebase } from "@/firebase/config";
import { signInWithEmailAndPassword, type AuthError } from "firebase/auth";

export const loginUser = defineAction({
  accept: "form",
  input: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    remember_me: z.boolean().optional(),
  }),
  handler: async ({ email, password, remember_me }, { cookies }) => {
    // Cookies
    if (remember_me) {
      cookies.set("email", email, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        path: "/", // 1 year
      });
    } else {
      cookies.delete("email", { path: "/" });
    }

    try {
      const user = await signInWithEmailAndPassword(
        firebase.auth,
        email,
        password,
      );
      return user;
    } catch (error) {
      const firebaseError = error as AuthError;
      if (firebaseError.code === "auth/email-already-in-use") {
        throw new Error("Email already in use");
      }
      throw new Error("Error creating user in Firebase");
    }
  },
});

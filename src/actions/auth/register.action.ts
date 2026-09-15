import { defineAction } from "astro:actions";
import { z } from "astro/zod";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  type AuthError,
  sendEmailVerification,
} from "firebase/auth";
import { firebase } from "@/firebase/config";

export const registerUser = defineAction({
  accept: "form",
  input: z.object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(6),
    remember_me: z.boolean().optional(),
  }),
  handler: async ({ name, email, password, remember_me }, { cookies }) => {
    // Cookies
    if (remember_me) {
      cookies.set("email", email, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        path: "/", // 1 year
      });
    } else {
      cookies.delete("email", { path: "/" });
    }

    // Creacion de usuario en Firebase
    try {
      const user = await createUserWithEmailAndPassword(
        firebase.auth,
        email,
        password,
      );
      // Actualizar el nombre (displayName) del usuario
      updateProfile(firebase.auth.currentUser!, {
        displayName: name,
      });

      // VVerificar el correo electrónico del usuario
      await sendEmailVerification(firebase.auth.currentUser!, {
        url: `  ${import.meta.env.WEBSITE_URL}/protected?emailVerified=true`, // URL a la que se redirigirá después de la verificación
      });

      return {
        uid: user.user.uid,
        email: user.user.email,
      };
    } catch (error) {
      const firebaseError = error as AuthError;
      if (firebaseError.code === "auth/email-already-in-use") {
        throw new Error("Email already in use");
      }
      throw new Error("Error creating user in Firebase");
    }
  },
});

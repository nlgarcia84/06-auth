import { defineAction } from "astro:actions";
import { z } from "astro/zod";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { firebase } from "@/firebase/config";

export const loginWithGoogle = defineAction({
  accept: "json",
  input: z.any(),
  handler: async (credentials) => {
    const credential = GoogleAuthProvider.credentialFromResult(credentials);
    if (!credential) {
      throw new Error("Unable to create Google authentication credential");
    }

    await signInWithCredential(firebase.auth, credential);
    return { ok: true };
  },
});

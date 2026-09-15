import type { MiddlewareNext } from "node_modules/astro/dist/types/public/common";
import { defineMiddleware } from "astro:middleware";
import { firebase } from "./firebase/config";

const privateRoutes = ["/protected"];
const notAuthenticatedRoutes = ["/login", "/register"];

// `context` and `next` are automatically typed
// Aqui context está desestructurado para obtener solo url y request,
// pero se puede desestructurar para obtener más propiedades si es necesario
export const onRequest = defineMiddleware(
  // Se ejecuta antes de que se procese la solicitud
  async ({ url, request, locals, redirect }, next) => {
    const isLoggedIn = !!firebase.auth.currentUser;
    const user = firebase.auth.currentUser;
    locals.isLoggedIn = isLoggedIn;

    // Redirigir a la página de login si el usuario no está autenticado y está intentando acceder a una ruta privada
    if (user) {
      locals.user = {
        avatar: user.photoURL ?? "",
        email: user.email!,
        name: user.displayName!,
        emailVerified: user.emailVerified,
      };
    }

    // Redirigir a la página de inicio si el usuario está autenticado y está intentando acceder a una ruta que no requiere autenticación
    if (!isLoggedIn && privateRoutes.includes(url.pathname)) {
      return redirect("/");
    }

    // Redirigir a la página de inicio si el usuario no está autenticado y está intentando acceder a una ruta que no requiere autenticación
    if (isLoggedIn && notAuthenticatedRoutes.includes(url.pathname)) {
      return redirect("/");
    }

    return next();
  },
);

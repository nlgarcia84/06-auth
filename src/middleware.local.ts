import { defineMiddleware } from "astro:middleware";
import type { MiddlewareNext } from "node_modules/astro/dist/types/public/common";

const privateRoutes = ["/protected"];

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware(async ({ url, request }, next) => {
  const authHeaders = request.headers.get("authorization") ?? "";
  if (privateRoutes.includes(url.pathname)) {
    return checkLocalAuth(authHeaders, next);
  }
  return next();
});

const checkLocalAuth = (authHeaders: string, next: MiddlewareNext) => {
  if (authHeaders) {
    const authValue = authHeaders.split(" ")[1];
    const decodedValue = atob(authValue).split(":");
    const [username, password] = decodedValue;
    if (username === "admin" && password === "admin") {
      return next();
    }
  }
  return new Response("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
  });
};

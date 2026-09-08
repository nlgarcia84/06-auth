import { defineMiddleware } from "astro:middleware";
import type { MiddlewareNext } from "node_modules/astro/dist/types/public/common";

const privateRoutes = ["/protected"];

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware(async ({ url, request }, next) => {
  return next();
});

export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/stays",
    "/properties",
    "/profile",
    "/reservations",
    "/reservations/:id",
  ],
};

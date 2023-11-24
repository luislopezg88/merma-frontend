export const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3100/api"
    : "https://merma-backend.vercel.app/api";

export const IMG_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3100/"
    : "https://merma-backend.vercel.app/";


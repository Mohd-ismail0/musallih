import { DEFAULT_API_BASE_URL } from "@musallih/api-client";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || DEFAULT_API_BASE_URL;

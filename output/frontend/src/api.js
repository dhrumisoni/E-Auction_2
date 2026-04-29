// frontend/src/api.js
// Single shared axios instance — import this instead of using fetch/axios with hardcoded URLs
//
// Usage:
//   import api from "../api";
//   const res = await api.get("/auth/login");
//   const res = await api.post("/bid/create", formData);

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export default api;

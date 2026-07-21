import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getUsers = () => API.get("/api/admin/users");

export const getDashboard = () => API.get("/api/admin/dashboard");

export const blockUser = (id: string) =>
  API.put(`/api/admin/users/${id}/block`);

export const unblockUser = (id: string) =>
  API.put(`/api/admin/users/${id}/unblock`);

export const deleteUser = (id: string) =>
  API.delete(`/api/admin/users/${id}`);

export const makeAdmin = (id: string) =>
  API.put(`/api/admin/users/${id}/make-admin`);

export const makeUser = (id: string) =>
  API.put(`/api/admin/users/${id}/make-user`);
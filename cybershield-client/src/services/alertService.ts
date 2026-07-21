import api from "../api/axios";
import type { SecurityAlert } from "../types/alert";

export const getAlerts = async () => {
  const response = await api.get<SecurityAlert[]>("/api/alerts");
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await api.get<number>("/api/alerts/unread-count");
  return response.data;
};

export const markAsRead = async (id: number) => {
  await api.patch(`/api/alerts/${id}/read`);
};

export const markAllAsRead = async () => {
  await api.patch("/api/alerts/read-all");
};

export const deleteAlert = async (id: number) => {
  await api.delete(`/api/alerts/${id}`);
};
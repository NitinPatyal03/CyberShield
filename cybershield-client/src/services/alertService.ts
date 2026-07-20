import api from "../api/axios";
import type { SecurityAlert } from "../types/alert";

export const getAlerts = async () => {
  const response = await api.get<SecurityAlert[]>("/alerts");
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await api.get<number>("/alerts/unread-count");
  return response.data;
};

export const markAsRead = async (id: number) => {
  await api.patch(`/alerts/${id}/read`);
};

export const markAllAsRead = async () => {
  await api.patch("/alerts/read-all");
};

export const deleteAlert = async (id: number) => {
  await api.delete(`/alerts/${id}`);
};
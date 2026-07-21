import api from "../api/axios";
import type { NotificationPreference } from "../types/notificationPreference";

export const getPreferences = async (websiteId: number) => {
  const response = await api.get<NotificationPreference>(
    `/api/NotificationPreference/${websiteId}`
  );

  return response.data;
};

export const updatePreferences = async (
  websiteId: number,
  data: NotificationPreference
) => {
  const response = await api.put(
    `/api/NotificationPreference/${websiteId}`,
    data
  );

  return response.data;
};

export const resetPreferences = async (websiteId: number) => {
  const response = await api.post(
    `/api/NotificationPreference/${websiteId}/reset`
  );

  return response.data;
};
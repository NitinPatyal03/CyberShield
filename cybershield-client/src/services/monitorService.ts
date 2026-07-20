import api from "../api/axios";
import type { MonitoredWebsite } from "../types/monitor";

export const getMonitoredWebsites = async () => {
  const response = await api.get<MonitoredWebsite[]>("/monitor");
  return response.data;
};

export const addWebsite = async (url: string) => {
  const response = await api.post("/monitor", { url });
  return response.data;
};

export const deleteWebsite = async (id: number) => {
  await api.delete(`/monitor/${id}`);
};

export const scanWebsite = async (id: number) => {
  const response = await api.post(`/monitor/${id}/scan`);
  return response.data;
};

export const getWebsiteHistory = async (id: number) => {
  const response = await api.get(`/monitor/${id}/history`);
  return response.data;
};
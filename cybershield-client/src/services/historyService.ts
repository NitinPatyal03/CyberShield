import api from "../api/axios";

export const getHistory = async () => {
  const response = await api.get("/scanner/history");
  return response.data;
};

export const deleteHistory = async (id: number) => {
  await api.delete(`/scanner/${id}`);
};
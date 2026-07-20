import api from "../api/axios";
import type { Profile } from "../types/profile";

export const getProfile = async (): Promise<Profile> => {
  const response = await api.get("/profile");
  return response.data;
};

export const updateProfile = async (
  firstName: string,
  lastName: string
) => {
  return api.put("/profile", {
    firstName,
    lastName,
  });
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  return api.put("/profile/change-password", {
    currentPassword,
    newPassword,
  });
};
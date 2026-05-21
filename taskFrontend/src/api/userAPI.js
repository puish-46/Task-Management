import axiosInstance from "./axiosInstance";

export const getAllUsers = () => axiosInstance.get("/user-api/users");

export const toggleUserActive = (id) =>
  axiosInstance.put(`/user-api/users/${id}/toggle-active`);

export const deleteUser = (id) =>
  axiosInstance.delete(`/user-api/users/${id}`);

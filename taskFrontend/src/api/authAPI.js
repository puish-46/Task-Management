import axiosInstance from "./axiosInstance";

export const registerUser = (data) => axiosInstance.post("/auth/users", data);

export const loginUser = (data) => axiosInstance.post("/auth/login", data);

export const logoutUser = () => axiosInstance.get("/auth/logout");

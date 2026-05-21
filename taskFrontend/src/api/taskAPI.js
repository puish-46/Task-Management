import axiosInstance from "./axiosInstance";

export const createTask = (data) => axiosInstance.post("/task-api/tasks", data);

export const getAllTasks = () => axiosInstance.get("/task-api/tasks");

export const getTask = (id) => axiosInstance.get(`/task-api/tasks/${id}`);

export const updateTask = (id, data) =>
  axiosInstance.put(`/task-api/tasks/${id}`, data);

export const deleteTask = (id) =>
  axiosInstance.delete(`/task-api/tasks/${id}`);

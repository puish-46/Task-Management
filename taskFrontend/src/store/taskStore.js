import { create } from "zustand";

const useTaskStore = create((set) => ({
  tasks: [],
  loading: false,

  setTasks: (tasksData) => set({ tasks: tasksData }),

  addTask: (task) =>
    set((state) => ({ tasks: [...state.tasks, task] })),

  updateTask: (updatedTask) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t._id === updatedTask._id ? updatedTask : t
      ),
    })),

  removeTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t._id !== taskId),
    })),

  setLoading: (val) => set({ loading: val }),
}));

export default useTaskStore;
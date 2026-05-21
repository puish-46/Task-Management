import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,

  setUser: (userData) =>
    set({
      user: userData,
      isAuthenticated: true,
    }),

  logoutUser: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),

  setLoading: (val) => set({ loading: val }),
}));

export default useAuthStore;
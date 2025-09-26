import { PostDataProps, NetworkData } from "@/types/networkData";
import { create } from "zustand";

export const useNetworkState = create<PostDataProps>((set) => ({
  networkData: null,
  setNetworkData: (networkData) => set(() => ({ networkData })),
  updateNetworkData: (updates: Partial<NetworkData>) =>
    set((state) => ({
      networkData: state.networkData
        ? { ...state.networkData, ...updates }
        : null,
    })),
}));

export const useAuthState = create<{
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  password: string;
  setPassword: (password: string) => void;
  username: string;
  setUsername: (username: string) => void;
}>((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated) => set(() => ({ isAuthenticated })),
  password: "",
  setPassword: (password) => set(() => ({ password })),
  username: "",
  setUsername: (username) =>
    set(() => ({
      username,
    })),
}));


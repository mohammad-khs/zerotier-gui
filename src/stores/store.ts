import { PostDataProps, NetworkData } from "@/types/networkData";
import { create } from "zustand";

export const useNetworkState = create<PostDataProps>((set) => ({
  networkData: null,
  setNetworkData: (networkData) => set(() => ({ networkData })),
  updateNetworkData: (updates: Partial<NetworkData>) =>
    set((state) => ({
      networkData: state.networkData ? { ...state.networkData, ...updates } : null,
    })),
}));


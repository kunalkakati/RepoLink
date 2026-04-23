import { create } from "zustand";
// For delete checkbox on the Navbar

interface DeleteStore {
  enableDelete: boolean;
  setEnableDelete: (enable: boolean) => void;
}

export const useDeleteStore = create<DeleteStore>((set) => ({
  enableDelete: false,
  setEnableDelete: (enable) => set({ enableDelete: enable }),
}));
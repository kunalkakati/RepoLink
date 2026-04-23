import { create } from "zustand";

interface auth{
    isAuthenticated: boolean,
    Authenticate: () => void,
}

const useAuthStore = create<auth>((set) => ({
    isAuthenticated: false,
    Authenticate: () => set({ isAuthenticated: true }),
}))

export default useAuthStore
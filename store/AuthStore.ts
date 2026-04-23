import { create } from "zustand";
import { registerUser,loginUser } from "@/lib/action";


interface auth{
    isAuthenticated: boolean,
    Authenticate: () => void,
    // Register: (password: string) => Promise<void>,
    LogIn: (key: string) => Promise<void>
}

const useAuthStore = create<auth>((set) => ({
    isAuthenticated: false,
    Authenticate: () => set({isAuthenticated: true}),
    LogIn: async (key: string) => {
        try {
            const isOk = await loginUser(key);
            set(isOk ? {isAuthenticated: true}: {isAuthenticated: false});
        } catch (error) {
            console.log(error);
        }
    }

}))

export default useAuthStore


 // Register: async (password: string) => {
    //     try {
    //         await registerUser(password);
    //         set({isAuthenticated: true});
    //     } catch (error) {
    //         console.log(error);
    //     }
    // },
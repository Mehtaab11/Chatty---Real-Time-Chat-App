import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"
// import axios from "axios"
export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIng: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],


    checkAuth: async () => {
        try {
            const response = await axiosInstance.get("/auth/check")
            console.log(response)
            set({
                authUser: response.data
            })
        } catch (error) {
            console.log("Error in Check Auth", error)
            set({
                authUser: null
            })
        } finally {
            set({
                isCheckingAuth: false
            })
        }
    },
    signUp: async (data) => {
        set({ isSigningUp: true })

        try {
            const res = await axiosInstance.post("/auth/signup", data)
            set({ authUser: res.data })
            toast.success("Account Created Succesfully")
        } catch (error) {
            toast.error(error.response.data.message)
        }
        set({ isSigningUp: false })

    },

    logout: async () => {
        try {
            axiosInstance.post("/auth/logout")
            set({ authUser: null })
            toast.success("Logged Out succesfully")
        } catch (error) {
            toast.error(error.response.data.message)

            console.log(error)
        }
    },

    login: async (data) => {
        set({ isLoggingIng: true })
        try {
            const res = await axiosInstance.post("/auth/login", data)
            set({ authUser: res.data })
            toast.success("Logged In Succesfully")

        } catch (error) {
            toast.error(error.response.data.message)

            console.log(error)
        } finally {

            set(
                { isLoggingIng: false })
        }
    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true })

        try {
            const res = await axiosInstance.put("/auth/update-profile", data)
            set({ authUser: res.data })
            toast.success("Profile Updated Succesfully")

        } catch (error) {
            toast.error(error.response.data.message)

            console.log("Error In Update Profile Section")
        } finally {
            set({ isUpdatingProfile: false })
        }
    }
}))
import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,


    getUsers: async () => {

        set({ isUsersLoading: true });
        try {
            const response = await axiosInstance.get('/messages/users');
            set({ users: response.data });

        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();


        try {
            const response = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, response.data] });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });

        try {
            const response = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: response.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get()

        if (!selectedUser) return


        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {

            // Check if the new message is for the selected user
            if (newMessage.senderId !== selectedUser._id && newMessage.recieverId !== selectedUser._id) return;
            // If the new message is for the selected user, add it to the messages state    
            set({ messages: [...get().messages, newMessage] })
        })
    },


    unSubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket
        socket.off("newMessage")

    },

    // optimise this one later 

    setSelectedUser: (selectedUser) => {
        set({ selectedUser });
    },
}))
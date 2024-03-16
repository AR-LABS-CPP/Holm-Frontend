import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useChatStore = create(
    persist(
        (set) => ({
            chatMessages: [],

            addChatMessage: (message) => set((state) => ({
                chatMessages: [...state.chatMessages, message]
            })),

            removeChatMessage: (messageId) => set((state) => ({
                chatMessages: state.chatMessages.filter((msg) => msg.id != messageId)
            }))
        }),
        {
            name: "chat-storage",
            storage: createJSONStorage(() => sessionStorage)
        }
    )
);

export default useChatStore;
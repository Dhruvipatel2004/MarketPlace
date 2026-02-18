import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
    id: number;
    name: string;
    email: string;
    profileImage?: string;
}

interface UserState {
    user: User | null;
    setUser: (user: User | null) => void;
    updateProfileImage: (imageUri: string) => void;
    updateName: (name: string) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            updateProfileImage: (imageUri) => set((state) => ({
                user: state.user ? { ...state.user, profileImage: imageUri } : null
            })),
            updateName: (name) => set((state) => ({
                user: state.user ? { ...state.user, name } : null
            })),
            logout: () => set({ user: null }),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

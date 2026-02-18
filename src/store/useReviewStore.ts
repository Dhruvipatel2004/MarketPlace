import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Review {
    id: string;
    productId: number;
    userName: string;
    rating: number;
    comment: string;
    date: string;
}

interface ReviewState {
    reviews: Review[];
    addReview: (review: Omit<Review, 'id' | 'date'>) => void;
}

export const useReviewStore = create<ReviewState>()(
    persist(
        (set, get) => ({
            reviews: [],
            addReview: (review) => set((state) => ({
                reviews: [
                    {
                        ...review,
                        id: Math.random().toString(36).substring(7),
                        date: new Date().toISOString(),
                    },
                    ...state.reviews,
                ],
            })),
        }),
        {
            name: 'review-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

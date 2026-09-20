import {
    COMPLETIONS_COLLECTION_ID,
    DATABASE_ID,
    databases,
    HABITS_COLLECTION_ID,
} from "@/lib/appwrite";
import { Habit, HabitCompletion } from "@/types/database.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ID, Models, Query } from "react-native-appwrite";

// Query keys
export const queryKeys = {
    habits: ["habits"] as const,
    completions: ["completions"] as const,
};

const PAGE_SIZE = 100;

const listAllDocuments = async <Document extends Models.Document>(
    collectionId: string,
    queries: string[]
) => {
    const documents: Document[] = [];
    let offset = 0;

    do {
        const response = await databases.listDocuments<Document>(
            DATABASE_ID,
            collectionId,
            [...queries, Query.limit(PAGE_SIZE), Query.offset(offset)]
        );
        documents.push(...response.documents);
        offset += response.documents.length;

        if (offset >= response.total || response.documents.length === 0) {
            return documents;
        }
    } while (true);
};

// Fetch habits
export const useHabits = (userId: string) => {
    return useQuery({
        queryKey: [...queryKeys.habits, userId],
        queryFn: async () => {
            return listAllDocuments<Habit>(HABITS_COLLECTION_ID, [
                Query.equal("user_id", userId),
            ]);
        },
        enabled: !!userId,
        staleTime: 1000 * 60, // Consider data fresh for 1 minute
        refetchInterval: 1000 * 30, // Refetch every 30 seconds
    });
};

// Fetch today's completions
export const useTodayCompletions = (userId: string) => {
    return useQuery({
        queryKey: [...queryKeys.completions, "today", userId],
        queryFn: async () => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return listAllDocuments<HabitCompletion>(COMPLETIONS_COLLECTION_ID, [
                Query.equal("user_id", userId),
                Query.greaterThanEqual("completed_at", today.toISOString()),
            ]);
        },
        enabled: !!userId,
        staleTime: 1000 * 60, // Consider data fresh for 1 minute
        refetchInterval: 1000 * 30, // Refetch every 30 seconds
    });
};

export const useAllCompletions = (userId: string) => {
    return useQuery({
        queryKey: [...queryKeys.completions, "all", userId],
        queryFn: async () => {
            return listAllDocuments<HabitCompletion>(COMPLETIONS_COLLECTION_ID, [
                Query.equal("user_id", userId),
                Query.orderDesc("completed_at"),
            ]);
        },
        enabled: !!userId,
        staleTime: 1000 * 60,
    });
};

// Create habit mutation
export const useCreateHabit = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (habitData: {
            user_id: string;
            title: string;
            description: string;
            frequency: string;
        }) => {
            return await databases.createDocument(
                DATABASE_ID,
                HABITS_COLLECTION_ID,
                ID.unique(),
                {
                    ...habitData,
                    streak_count: 0,
                    last_completed: new Date().toISOString(),
                    created_at: new Date().toISOString(),
                }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.habits });
        },
    });
};

// Delete habit mutation
export const useDeleteHabit = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (habitId: string) => {
            return await databases.deleteDocument(
                DATABASE_ID,
                HABITS_COLLECTION_ID,
                habitId
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.habits });
        },
    });
};

// Complete habit mutation
export const useCompleteHabit = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
                               habitId,
                               userId,
                               habit,
                           }: {
            habitId: string;
            userId: string;
            habit: Habit;
        }) => {
            const currentDate = new Date().toISOString();

            // Create completion record
            await databases.createDocument(
                DATABASE_ID,
                COMPLETIONS_COLLECTION_ID,
                ID.unique(),
                {
                    habit_id: habitId,
                    user_id: userId,
                    completed_at: currentDate,
                }
            );

            // Update habit streak
            await databases.updateDocument(
                DATABASE_ID,
                HABITS_COLLECTION_ID,
                habitId,
                {
                    streak_count: habit.streak_count + 1,
                    last_completed: currentDate,
                }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.habits });
            queryClient.invalidateQueries({ queryKey: queryKeys.completions });
        },
    });
};

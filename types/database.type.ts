import { Models } from "react-native-appwrite";

export interface Habit extends Models.Document {
  user_id: string;
  title: string;
  description: string;
  frequency: string;
  streak_count: number;
  last_completed: string;
  created_at: string;
  freezes_available?: number;
  freezes_reset_at?: string;
  reminder_enabled?: boolean;
  reminder_time?: string;
  reminder_weekday?: number;
  reminder_day_of_month?: number;
  notification_id?: string;
}

export interface HabitCompletion extends Models.Document {
  habit_id: string;
  user_id: string;
  completed_at: string;
}

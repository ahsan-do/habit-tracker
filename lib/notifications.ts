import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from "@/lib/appwrite";
import { Habit } from "@/types/database.type";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const ensureNotificationPermission = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
};

export const setupAndroidChannel = async () => {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("habit-reminders", {
    name: "Habit reminders",
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 200, 200, 200],
    lightColor: "#6C5CE7",
  });
};

const parseTime = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  return { hour: hour || 0, minute: minute || 0 };
};

interface ScheduleParams {
  habitId: string;
  title: string;
  frequency: string;
  reminderTime: string; // "HH:mm"
  reminderWeekday?: number; // 0-6, Sun-Sat, for weekly
  reminderDayOfMonth?: number; // 1-31, for monthly
}

// Schedules (or reschedules) a repeating local notification for a habit.
// Returns the new notification identifier to persist on the habit document.
export const scheduleHabitReminder = async ({
  habitId,
  title,
  frequency,
  reminderTime,
  reminderWeekday,
  reminderDayOfMonth,
}: ScheduleParams): Promise<string> => {
  const { hour, minute } = parseTime(reminderTime);

  let trigger: Notifications.NotificationTriggerInput;

  if (frequency === "weekly") {
    // Expo's weekday convention is 1-7 (Sun-Sat); ours is 0-6 (Sun-Sat).
    const expoWeekday = ((reminderWeekday ?? 0) % 7) + 1;
    trigger = {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: expoWeekday,
      hour,
      minute,
    };
  } else if (frequency === "monthly") {
    trigger = {
      type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
      day: reminderDayOfMonth ?? 1,
      hour,
      minute,
    };
  } else {
    trigger = {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    };
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: "Habit reminder",
      body: title,
      data: { habitId },
      sound: true,
    },
    trigger,
  });
};

export const cancelHabitReminder = async (notificationId?: string) => {
  if (!notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {
    // Already cancelled or invalid id — safe to ignore.
  }
};

// High-level helper: cancels any existing reminder for a habit, then schedules
// a new one if reminder_enabled is true, persisting the new notification_id.
export const syncHabitReminder = async (habit: Habit) => {
  await cancelHabitReminder(habit.notification_id);

  if (!habit.reminder_enabled || !habit.reminder_time) {
    if (habit.notification_id) {
      await databases.updateDocument(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        habit.$id,
        {
          notification_id: null,
        },
      );
    }
    return;
  }

  const granted = await ensureNotificationPermission();
  if (!granted) return;

  await setupAndroidChannel();

  const notificationId = await scheduleHabitReminder({
    habitId: habit.$id,
    title: habit.title,
    frequency: habit.frequency,
    reminderTime: habit.reminder_time,
    reminderWeekday: habit.reminder_weekday,
    reminderDayOfMonth: habit.reminder_day_of_month,
  });

  await databases.updateDocument(DATABASE_ID, HABITS_COLLECTION_ID, habit.$id, {
    notification_id: notificationId,
  });
};

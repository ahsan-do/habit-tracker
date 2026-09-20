import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

export const lightPalette = {
  background: "#F8F8FC", surface: "#FFFFFF", surfaceMuted: "#F1EFFF", border: "#EAE7F2",
  text: "#29263A", muted: "#858197", subdued: "#817C94", primary: "#6C5CE7",
  secondary: "#8073E9", onPrimary: "#FFFFFF", primarySoft: "#EFEDFF", progressSoft: "#DCD7FF",
  completed: "#F8F7FC", errorSoft: "#FFF0F1", error: "#B94456", warningSoft: "#FFF6E7",
  warningBorder: "#FFE4B4", warningText: "#51350B", warningMuted: "#9D742D", input: "#FFFFFF",
};

export const darkPalette: typeof lightPalette = {
  background: "#171520", surface: "#24212F", surfaceMuted: "#302B43", border: "#3C3650",
  text: "#F3F0FC", muted: "#C0BACF", subdued: "#AAA3B8", primary: "#A99EFF",
  secondary: "#7669D9", onPrimary: "#211D35", primarySoft: "#373055", progressSoft: "#D8D2FF",
  completed: "#2A2635", errorSoft: "#4A2935", error: "#FFB1C0", warningSoft: "#47371D",
  warningBorder: "#70552A", warningText: "#FFE5A9", warningMuted: "#E8C77B", input: "#24212F",
};

export type AppPalette = typeof lightPalette;

export const useAppPalette = (): AppPalette =>
  useColorScheme() === "dark" ? darkPalette : lightPalette;

export const appLightTheme = {
  ...MD3LightTheme,
  colors: { ...MD3LightTheme.colors, primary: lightPalette.primary, background: lightPalette.background, surface: lightPalette.surface, onSurface: lightPalette.text },
};

export const appDarkTheme = {
  ...MD3DarkTheme,
  colors: { ...MD3DarkTheme.colors, primary: darkPalette.primary, background: darkPalette.background, surface: darkPalette.surface, onSurface: darkPalette.text },
};

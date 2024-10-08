type ThemeColors =
  | "Default"
  | "Red"
  | "Orange"
  | "Yellow"
  | "Green"
  | "Rose"
  | "Gray";
interface ThemeColorStateParams {
  themeColor: ThemeColors;
  setThemeColor: React.Dispatch<React.SetStateAction<ThemeColors>>;
}

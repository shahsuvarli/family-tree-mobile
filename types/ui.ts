import { Ionicons } from "@expo/vector-icons";
import type { LinearGradientProps } from "expo-linear-gradient";
import type { ImageSourcePropType } from "react-native";

export type ColorPalette = Record<string, string>;

export interface DashboardCard {
  id: number;
  title: string;
  colors: LinearGradientProps["colors"];
  image: ImageSourcePropType;
  route: string;
}

export interface SelectableOption {
  id: number;
  icon?: keyof typeof Ionicons.glyphMap;
  value: string;
}

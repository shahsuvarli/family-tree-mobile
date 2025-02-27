import { Ionicons } from "@expo/vector-icons";
import { LinearGradientProps } from "expo-linear-gradient";
import { ImageProps } from "react-native";

export interface PersonType {
  created_at: string;
  gender: number;
  id: string;
  initials: string;
  name: string;
  person_id: string;
  relation_type: string;
  relation_type_id: string;
  surname: string;
  dob?: string;
  is_active?: boolean;
  life?: number;
  marital_status?: number;
  notes?: string;
  user_id?: string;
}

export interface FamilyType {
  data: PersonType[];
  title: string;
}

export interface SectionType {
  data: PersonType[];
  relation_id: string;
  relation_tag: string;
  relation_name: string;
}

export type ColorsType = {
  [key: string]: string;
};

export interface Result {
  id: number;
  title: string;
  colors: LinearGradientProps["colors"];
  image: ImageProps["source"];
  route: string;
}

export interface Option {
  id: number;
  icon?: keyof typeof Ionicons.glyphMap;
  value: string;
}

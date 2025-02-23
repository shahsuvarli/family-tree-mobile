import NativeConfig from "react-native-config";

declare module "react-native-config" {
  export interface NativeConfig {
    EXPO_PUBLIC_SUPABASE_URL: string;
    EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
  }
  export const Config: NativeConfig;
  export default Config;
}

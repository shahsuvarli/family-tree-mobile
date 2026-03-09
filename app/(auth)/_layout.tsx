import { Redirect, Stack } from "expo-router";
import { useSession } from "../ctx";
import { ActivityIndicator, View } from "react-native";
import { Colors } from "@/theme/colors";

export default function AppLayout() {
  const { session, isLoading } = useSession();
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color={Colors.button} />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/(boarding)" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(other)" options={{ headerShown: false }} />
    </Stack>
  );
}

import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import SessionProvider from "@/features/auth/providers/SessionProvider";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { StatusBar } from "react-native";

SplashScreen.preventAutoHideAsync();

// Extracted outside RootLayout to prevent re-creation on every render
function RootLayoutNav() {
  return (
    <SessionProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#fff"
          hidden={false}
        />
        <BottomSheetModalProvider>
          <Slot />
        </BottomSheetModalProvider>
        {/* Toast is inside GestureHandlerRootView for correct z-index on Android */}
        <Toast />
      </GestureHandlerRootView>
    </SessionProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}
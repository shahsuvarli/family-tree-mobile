import { Redirect, Stack } from "expo-router";
import { useSession } from "@/features/auth/providers/SessionProvider";
import FullscreenLoader from "@/components/ui/FullscreenLoader";
import { appRoutes } from "@/constants/routes";

export default function AppLayout() {
  const { session, isLoading } = useSession();
  if (isLoading) {
    return <FullscreenLoader />;
  }

  if (!session) {
    return <Redirect href={appRoutes.boarding} />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(stack)" options={{ headerShown: false }} />
    </Stack>
  );
}

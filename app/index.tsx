import { Redirect } from "expo-router";
import { appRoutes } from "@/constants/routes";

export default function Index() {
  return <Redirect href={appRoutes.boarding} />;
}

import { Redirect } from "expo-router";
import { appRoutes } from "@/constants/routes";

const TabsIndexRedirect = () => {
  return <Redirect href={appRoutes.authTabsHome} />;
};

export default TabsIndexRedirect;

import { appRoutes } from "@/constants/routes";
import { colors } from "@/theme/colors";
import type { DashboardCard } from "@/types/ui";

export const dashboardCards: DashboardCard[] = [
  {
    id: 1,
    title: "Family",
    colors: [colors.main, colors.mainDark],
    image: require("@/assets/images/my-family-2.png"),
    route: appRoutes.authStackPerson,
  },
  {
    id: 2,
    title: "People",
    colors: ["#4d7cd8", "#7fa4ea"],
    image: require("@/assets/images/people.png"),
    route: appRoutes.authStackRecentlyAdded,
  },
  {
    id: 3,
    title: "Dashboard",
    colors: ["#2f4f4f", "#517370"],
    image: require("@/assets/images/dashboard.png"),
    route: appRoutes.authStackDashboard,
  },
  {
    id: 4,
    title: "Favorites",
    colors: ["#cc6a3c", "#e59b73"],
    image: require("@/assets/images/favorite.png"),
    route: appRoutes.authStackFavorite,
  },
];

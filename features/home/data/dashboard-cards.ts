import { appRoutes } from "@/constants/routes";
import type { DashboardCard } from "@/types/ui";

export const dashboardCards: DashboardCard[] = [
  {
    id: 1,
    title: "Family",
    colors: ["#0984e3", "#fff"],
    image: require("@/assets/images/my-family-2.png"),
    route: appRoutes.authStackPerson,
  },
  {
    id: 2,
    title: "People",
    colors: ["#00cec9", "#fff"],
    image: require("@/assets/images/people.png"),
    route: appRoutes.authStackRecentlyAdded,
  },
  {
    id: 3,
    title: "Dashboard",
    colors: ["#6c5ce7", "#fff"],
    image: require("@/assets/images/dashboard.png"),
    route: appRoutes.authStackDashboard,
  },
  {
    id: 4,
    title: "Favorites",
    colors: ["#e17055", "#fff"],
    image: require("@/assets/images/favorite.png"),
    route: appRoutes.authStackFavorite,
  },
];

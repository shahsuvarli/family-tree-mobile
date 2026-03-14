export const appRoutes = {
  root: "/",
  boarding: "/(boarding)",
  boardingForgotPassword: "/(boarding)/forgot-password",
  boardingSignIn: "/(boarding)/sign-in",
  boardingSignUp: "/(boarding)/sign-up",
  authTabsHome: "/(auth)/(tabs)/home",
  authTabsHomeEditPerson: "/(auth)/(tabs)/home/edit-person",
  authTabsProfileEdit: "/(auth)/(tabs)/profile/edit-profile",
  authStackAddRelative: "/(auth)/(stack)/add-relative",
  authStackDashboard: "/(auth)/(stack)/dashboard",
  authStackFavorite: "/(auth)/(stack)/favorite",
  authStackPerson: "/(auth)/(stack)/person",
  authStackRecentlyAdded: "/(auth)/(stack)/recently-added",
  authStackSearch: "/(auth)/(stack)/search",
} as const;

export type AppRoutePath = (typeof appRoutes)[keyof typeof appRoutes];

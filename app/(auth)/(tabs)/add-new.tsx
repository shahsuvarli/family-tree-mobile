import { Redirect } from "expo-router";

export default function AddNewTabRedirect() {
  return <Redirect href="/(auth)/(other)/add-new" />;
}

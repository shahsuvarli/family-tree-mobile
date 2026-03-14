import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  StyleSheet,
} from "react-native";
import FullscreenLoader from "@/components/ui/FullscreenLoader";
import { useCallback, useEffect, useState } from "react";
import { appRoutes } from "@/constants/routes";
import { colors } from "@/theme/colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase/client";
import { useIsFocused } from "@react-navigation/native";
import { useSession } from "@/features/auth/providers/SessionProvider";
import { format } from "date-fns";
import { router } from "expo-router";

interface ProfileOverview {
  name: string;
  surname: string;
  email: string;
  people_count: number;
  relationship_count: number;
  created_at: string;
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<ProfileOverview>();
  const profileImageUri = "https://avatars.githubusercontent.com/u/46631807?v=4";
  const isFocused = useIsFocused();
  const { session } = useSession();

  const fetchProfileOverview = useCallback(async () => {
    if (!session) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profile_overview")
        .select("*")
        .eq("id", session)
        .single();

      if (!error) {
        setProfile({
          ...data,
          created_at: format(new Date(data.created_at), "dd/MM/yyyy"),
        });
      }
    } catch (error) {
      console.error(error);
    }
  }, [session]);

  useEffect(() => {
    if (isFocused) {
      void fetchProfileOverview();
    }
  }, [fetchProfileOverview, isFocused]);

  if (!profile) {
    return <FullscreenLoader />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* Header view */}
        <View style={styles.headerContentContainer}>
          <View style={styles.profileContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: profileImageUri,
                }}
                style={styles.image}
              />
            </View>
            <View style={styles.userInfoContainer}>
              <Text style={styles.userName}>
                {profile.name} {profile.surname}
              </Text>
              <Text style={styles.userJoinDate}>
                joined on {profile.created_at}
              </Text>
            </View>
          </View>
          <View style={styles.userEmailContainer}>
            <View style={styles.userEmailRow}>
              <MaterialCommunityIcons
                name="email-outline"
                size={30}
                color="#808080"
              />
              <Text style={styles.userEmail}>{profile.email}</Text>
            </View>
          </View>
        </View>

        {/* Cards view */}
        <View style={styles.cardsContainer}>
          <View style={styles.cardItemContainer}>
            <Text style={styles.cardTitle}>{profile.people_count}</Text>
            <Text style={styles.cardSubtitle}>people added</Text>
          </View>
          <View style={styles.cardItemContainer}>
            <Text style={styles.cardTitle}>{profile.relationship_count}</Text>
            <Text style={styles.cardSubtitle}>relationships</Text>
          </View>
        </View>

        {/* Body view */}
        <View style={styles.bodyContainer}>
          <Text style={styles.settingsTitle}>Settings</Text>
          <View style={styles.separator} />
          <FlatList
            data={[{ id: 1, name: "Recently added" }]}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => router.push(appRoutes.authStackRecentlyAdded)}
                style={styles.listItem}
              >
                <Text style={styles.listItemText}>{item.name}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={colors.darkGrey}
                />
              </Pressable>
            )}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: 20,
    backgroundColor: "#fff",
    flexDirection: "column",
    gap: 20,
  },
  headerContentContainer: {
    flexDirection: "column",
    gap: 10,
    paddingHorizontal: 20,
  },
  profileContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    gap: 30,
  },
  imageContainer: {
    height: 100,
    width: 100,
    borderRadius: 100,
    backgroundColor: colors.button,
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 100,
  },
  userInfoContainer: {
    flexDirection: "column",
    gap: 15,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 25,
    color: colors.button,
  },
  userJoinDate: {
    fontSize: 15,
    color: "#808080",
  },
  userEmailContainer: {
    paddingTop: 15,
    gap: 17,
  },
  userEmailRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  userEmail: {
    color: colors.darkGrey,
    fontSize: 17,
  },
  cardsContainer: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.grey,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  cardItemContainer: {
    borderStyle: "solid",
    borderRightColor: colors.grey,
    borderRightWidth: 1,
    width: "50%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 13,
    gap: 7,
  },
  cardTitle: {
    fontSize: 27,
    fontWeight: "bold",
    color: colors.button,
  },
  cardSubtitle: {
    color: colors.darkGrey,
    fontSize: 15,
  },
  bodyContainer: {
    paddingHorizontal: 17,
    height: "100%",
  },
  settingsTitle: {
    color: colors.button,
    fontSize: 15,
    marginBottom: 10,
  },
  separator: {
    borderStyle: "solid",
    borderBottomColor: colors.grey,
    borderBottomWidth: 1,
  },
  listItem: {
    flexDirection: "row",
    height: 50,
    justifyContent: "space-between",
    alignItems: "center",
    borderStyle: "solid",
    borderBottomColor: colors.grey,
    borderBottomWidth: 1,
  },
  listItemText: {
    fontSize: 17,
  },
});

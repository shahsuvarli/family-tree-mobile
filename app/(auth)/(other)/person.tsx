import { View, SectionList, Text, Pressable, StyleSheet } from "react-native";
import PersonLine from "@/components/PersonLine";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useSession } from "@/app/ctx";
import useFamily from "@/hooks/useFamily";
import { router, useLocalSearchParams } from "expo-router";
import Animated, { useSharedValue } from "react-native-reanimated";
import { supabase } from "@/db";
import { PersonType, SectionType } from "@/types";
import { usePersonStore } from "@/utils/store";

export default function Person() {
  const { setPerson } = usePersonStore();
  const { id: person_id } = useLocalSearchParams() as { id: string };
  const [family, setFamily] = useState<SectionType[]>();
  const { session } = useSession();

  const getUserData = async () => {
    const { data, error } = await supabase
      .from("people")
      .select("id, name, is_favorite")
      .eq("id", person_id)
      .single();

    if (!error) {
      const { id, name, is_favorite } = data;
      setPerson({ id, name, is_favorite });
    }
  }

  useEffect(() => {
    async function fetchProfile() {
      const value = await useFamily(session, person_id);
      setFamily(value);
    }

    fetchProfile();
  }, []);

  useEffect(() => {
    getUserData();
  }, []);

  const opacityShareValue = useSharedValue(1);

  function handlePlusPress(person_id: string, relation_id: string, relation_name: string): void {
    router.push({
      pathname: "/(auth)/(other)/add-relative",
      params: { person_id, relation_id, relation_name },
    });
  }

  if (!family) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: opacityShareValue }]}>
        <SectionList
          sections={family}
          renderItem={() => {
            return null;
          }}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section: {
            relation_name,
            data,
            relation_id,
          } }: { section: SectionType }) => {
            const count = data.length;
            return (
              <View style={styles.sectionHeader}>
                <View style={styles.sectionHeaderTitle}>
                  <Text style={styles.sectionHeaderText}>{relation_name}</Text>
                  <Pressable onPress={() => handlePlusPress(person_id, relation_id, relation_name)}>
                    <Ionicons name="add" size={27} color={Colors.darkGrey} />
                  </Pressable>
                </View>
                <View>
                  {count ? (
                    data.map((item: PersonType) => {
                      return <PersonLine item={item} key={item.id} />;
                    })
                  ) : (
                    <Text style={styles.noItemsText}>
                      &nbsp; no {relation_name.toLowerCase()} found
                    </Text>
                  )}
                </View>
              </View>
            );
          }}
          stickyHeaderHiddenOnScroll={true}
          keyExtractor={(item) => item.id}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    backgroundColor: "#fff",
    padding: 10,
    flex: 1,
  },
  sectionHeader: {
    padding: 10,
    gap: 5,
  },
  sectionHeaderTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionHeaderText: {
    fontSize: 17,
    color: Colors.darkGrey,
  },
  noItemsText: {
    color: Colors.darkGrey,
    fontSize: 15,
    fontStyle: "italic",
  },
});

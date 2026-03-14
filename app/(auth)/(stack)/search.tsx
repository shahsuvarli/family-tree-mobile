import ScreenState from "@/components/ui/ScreenState";
import { appRoutes } from "@/constants/routes";
import { useSession } from "@/features/auth/providers/SessionProvider";
import PersonListItem from "@/features/people/components/PersonListItem";
import { usePeopleSearch } from "@/features/people/usePeopleSearch";
import { colors } from "@/theme/colors";
import type { Person } from "@/types/person";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import { useDeferredValue, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function SearchPeopleScreen() {
  const [searchText, setSearchText] = useState("");
  const deferredSearchText = useDeferredValue(searchText.trim());
  const { userId } = useSession();
  const { people, loading, error, refetch } = usePeopleSearch(
    userId,
    deferredSearchText,
  );

  const hasQuery = deferredSearchText.length > 0;
  const resultSummary = hasQuery
    ? `${people.length} ${people.length === 1 ? "match" : "matches"}`
    : `${people.length} ${people.length === 1 ? "person" : "people"}`;
  const helperText = hasQuery
    ? `Searching for "${deferredSearchText}"`
    : "Browse everyone you have added to your family tree.";

  function handlePerson(person: Person) {
    router.push({
      pathname: appRoutes.authStackPerson,
      params: { id: person.id, name: person.name },
    });
  }

  function renderEmptyState() {
    if (loading) {
      return (
        <ScreenState
          message="Loading family..."
          tone="accent"
          showSpinner
          style={styles.stateCard}
        />
      );
    }

    if (error) {
      return (
        <ScreenState
          message={error}
          tone="error"
          iconName="alert-circle-outline"
          style={styles.stateCard}
        />
      );
    }

    return (
      <ScreenState
        message={
          hasQuery
            ? `No one matched "${deferredSearchText}".`
            : "No people yet. Add someone to start building your family tree."
        }
        tone="neutral"
        iconName={hasQuery ? "search-outline" : "people-outline"}
        style={styles.stateCard}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "My family",
          headerShown: true,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: colors.canvas,
          },
          headerTitleStyle: {
            color: colors.ink,
            fontSize: 20,
            fontWeight: "700",
          },
        }}
      />

      <FlatList
        data={people}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        refreshControl={
          <RefreshControl
            refreshing={loading && people.length > 0}
            onRefresh={() => void refetch()}
            tintColor={colors.main}
            colors={[colors.main]}
            progressBackgroundColor={colors.surface}
          />
        }
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <LinearGradient
              colors={[colors.main, colors.mainDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroCard}
            >
              <View style={styles.heroIconWrap}>
                <Ionicons name="people-outline" size={28} color={colors.onMain} />
              </View>
              <View style={styles.heroTextBlock}>
                <Text style={styles.heroTitle}>Your people, in one place</Text>
                <Text style={styles.heroSubtitle}>
                  Search across every branch and open profiles quickly.
                </Text>
              </View>
            </LinearGradient>

            <View style={styles.searchPanel}>
              <View style={styles.searchContainer}>
                <View style={styles.searchIconWrap}>
                  <Ionicons
                    name="search"
                    size={18}
                    color={colors.mainDark}
                    style={styles.searchIcon}
                  />
                </View>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by name or surname"
                  placeholderTextColor={colors.inkMuted}
                  value={searchText}
                  onChangeText={setSearchText}
                  autoCapitalize="words"
                  autoCorrect={false}
                  clearButtonMode="while-editing"
                />
              </View>

              <View style={styles.resultsHeader}>
                <View>
                  <Text style={styles.resultsTitle}>People</Text>
                  <Text style={styles.resultsSubtitle}>{helperText}</Text>
                </View>
                <View style={styles.resultsBadge}>
                  <Text style={styles.resultsBadgeText}>{resultSummary}</Text>
                </View>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={renderEmptyState}
        renderItem={({ item }) => (
          <PersonListItem
            person={item}
            iconName="chevron-forward"
            onPress={handlePerson}
            variant="family"
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
  },
  headerContent: {
    gap: 18,
    marginBottom: 18,
  },
  heroCard: {
    borderRadius: 24,
    padding: 16,
    gap: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: colors.mainDark,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 5,
  },
  heroIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  heroTitle: {
    color: colors.onMain,
    fontSize: 20,
    fontWeight: "800",
  },
  heroTextBlock: {
    flex: 1,
    gap: 4,
  },
  heroSubtitle: {
    color: "rgba(255,249,244,0.86)",
    fontSize: 13,
    lineHeight: 18,
  },
  searchPanel: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    gap: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 58,
    paddingHorizontal: 14,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    gap: 10,
  },
  searchIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mainSoft,
  },
  searchIcon: {
    marginTop: 1,
  },
  searchInput: {
    flex: 1,
    minHeight: 44,
    fontSize: 16,
    color: colors.ink,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  resultsTitle: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: "800",
  },
  resultsSubtitle: {
    color: colors.inkMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  resultsBadge: {
    minHeight: 34,
    borderRadius: 999,
    paddingHorizontal: 12,
    backgroundColor: colors.mainSoft,
    borderWidth: 1,
    borderColor: colors.borderWarm,
    alignItems: "center",
    justifyContent: "center",
  },
  resultsBadgeText: {
    color: colors.mainDark,
    fontSize: 13,
    fontWeight: "700",
  },
  itemSeparator: {
    height: 12,
  },
  stateCard: {
    minHeight: 220,
    backgroundColor: colors.surface,
    borderRadius: 24,
    marginTop: 4,
  },
});

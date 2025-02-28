import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/db";
import { PersonType } from "@/types";
import { usePersonStore } from "@/utils/store";

interface Props {
  item: PersonType;
  handlePerson: any;
  icon: keyof typeof Ionicons.glyphMap;
  relation_id?: string;
}

const PersonLine = ({ item, handlePerson, icon, relation_id }: Props) => {
  const created_at = new Date(item.created_at).toLocaleDateString();
  const { familyData, setFamilyData } = usePersonStore();

  const handleLongPress = async (item: any) => {
    const { error } = await supabase.from("relation").delete().eq("id", item.id);
    if (!error) {
      const newFamilyData = familyData.map((data: any) => {
        if (data.relation_id === relation_id) {
          const newData = data.data.filter((person: any) => person.id !== item.id)
          return { ...data, data: newData }
        }
        else {
          return data
        }
      })
      setFamilyData(newFamilyData)
    }
  };
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePerson.bind(null, item)}
      onLongPress={handleLongPress.bind(null, item)}
    >
      <View style={styles.leftContainer}>
        <View
          style={[
            styles.initialContainer,
            {
              backgroundColor:
                item.gender === 1
                  ? styles.maleBackground.backgroundColor
                  : styles.femaleBackground.backgroundColor,
            },
          ]}
        >
          <Text style={styles.initialText}>{item.initials}</Text>
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>
            {item.name} {item.surname}
          </Text>
          <Text style={styles.dateText}>{created_at}</Text>
        </View>
      </View>
      <Ionicons name={icon} size={30} color={Colors.darkGrey} />
    </TouchableOpacity>
  );
};

export default PersonLine;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 20,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "space-between",
    borderStyle: "solid",
    borderBottomColor: Colors.grey,
    borderBottomWidth: 0.3,
    width: "100%",
  },
  leftContainer: {
    flexDirection: "row",
    gap: 12,
  },
  initialContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  maleBackground: {
    backgroundColor: "#4D7CD8",
  },
  femaleBackground: {
    backgroundColor: "#E5518D",
  },
  initialText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  nameContainer: {
    flexDirection: "column",
    gap: 7,
  },
  nameText: {
    fontSize: 20,
    color: Colors.button,
  },
  dateText: {
    color: Colors.darkGrey,
  },
});

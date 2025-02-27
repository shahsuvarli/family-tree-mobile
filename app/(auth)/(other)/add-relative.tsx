import PersonLine from '@/components/PersonLine'
import { Colors } from '@/constants/Colors'
import { supabase } from '@/db'
import { PersonType } from '@/types'
import { usePersonStore } from '@/utils/store'
import { AntDesign } from '@expo/vector-icons'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native'
import Toast from 'react-native-toast-message'

const AddRelative = () => {
    const [data, setData] = useState<PersonType[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [search, setSearch] = useState("");


    const fetchData = async (text: string = "") => {
        setLoading(true);
        // setError(null);
        const { data, error } = await supabase
            .from("people")
            .select("*")
            .neq("user_id", person_id)
            .order("created_at", { ascending: false })
            .or(`name.ilike.%${text}%,surname.ilike.%${text}%`);

        if (error) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Failed to fetch data",
                position: "bottom",
                bottomOffset: 50,
            });
            setError("Failed to fetch data.");
        } else {
            setData(data || [])
        }
        setLoading(false);
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchData(search);
        }, 500);

        return () => {
            clearTimeout(timeout);
        };
    }, [search]);

    useEffect(() => {
        fetchData();
    }, []);

    const { person_id, relation_id, relation_name } = useLocalSearchParams() as { person_id: string, relation_id: string, relation_name: string }
    const { person: { name } } = usePersonStore()
    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, color: "gray" }}>Select {name}'s {relation_name.toLowerCase()} from the list</Text>

            <View style={styles.headerContainer}>
                <AntDesign name="search1" size={24} color={"gray"} />
                <TextInput
                    placeholder="Search"
                    style={styles.textInput}
                    autoCorrect={false}
                    placeholderTextColor={Colors.darkGrey}
                    onChangeText={(text) => setSearch(text)}
                />
            </View>
            <View style={styles.container}>
                {loading ? ( // Show a loading indicator
                    <Text style={styles.loadingText}>Loading...</Text>
                ) : error ? ( // Show error message if there's an error
                    <Text style={styles.errorText}>{error}</Text>
                ) : data.length === 0 ? ( // Handle empty data case
                    <Text style={styles.noDataText}>No data available.</Text>
                ) : (
                    <FlatList
                        data={data}
                        contentContainerStyle={{ paddingVertical: 20 }}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <PersonLine item={item} />}
                    />
                )}
            </View>
        </View>
    )
}

export default AddRelative

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        fontSize: 18,
        color: "gray",
    },
    errorText: {
        fontSize: 18,
        color: "red",
    },
    noDataText: {
        fontSize: 18,
        color: "gray",
    },
    textInput: {
        flex: 1,
        padding: 10,
        backgroundColor: "#fff",
        fontSize: 20,
    },
    headerContainer: {
        borderStyle: "solid",
        borderBottomWidth: 1,
        borderBottomColor: Colors.darkerSecondaryColor,
        paddingVertical: 7,
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
        gap: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: Colors.darkerSecondaryColor,
        marginTop: 10,
    },
    headerText: {
        fontSize: 17,
    },
});

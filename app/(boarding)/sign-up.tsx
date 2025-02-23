import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link, router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Controller, useForm } from "react-hook-form";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSession } from "../ctx";
import { supabase } from "@/db";
import { StyleSheet } from "react-native";

interface FormData {
  name: string;
  surname: string;
  email: string;
  password: string;
}

const Page = () => {
  const { signIn } = useSession();
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      name: "Elvin",
      surname: "Shahsuvarli",
      email: "shahsuvarli.elvin@gmail.com",
      password: "Elvin351",
    },
  });

  const onSubmit = async ({ email, password, name, surname }: FormData) => {
    await supabase.auth
      .signUp({
        email,
        password,
      })
      .then(async ({ data }: any) => {
        const id = data.user?.id;
        await supabase.from("users").insert([
          {
            uid: id,
            name: name,
            surname: surname,
            email: email,
            people_added: 0,
            family_members: 0,
          },
        ]);

        // Store the user's UID in AsyncStorage
        await AsyncStorage.setItem("family-tree", id);

        // Sign in the user
        signIn(id);

        // Show success message
        Toast.show({
          type: "success",
          text1: "Signed in successfully",
          text2: "Welcome back",
          position: "bottom",
        });

        // Redirect to the home screen
        router.replace("../(tabs)/home");
      })
      .catch((error) => {
        // Handle errors
        Toast.show({
          type: "error",
          text1: "Invalid credentials",
          text2: "Please check your email and password",
          position: "bottom",
        });
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: Colors.button }]}>Create</Text>
        <Text style={[styles.headerText, { color: Colors.background }]}>Account!</Text>
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "position" : "height"}>
        <View style={{ flexDirection: "column", gap: 20 }}>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <Ionicons name="person" size={24} color={Colors.button} />

                <TextInput
                  placeholder="Elvin"
                  style={styles.input}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
            )}
            name="name"
            rules={{ required: "Name is required" }}
          />
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <Ionicons name="person" size={24} color={Colors.button} />

                <TextInput
                  placeholder="Surname"
                  style={styles.input}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
            )}
            name="surname"
            rules={{ required: "Surname is required" }}
          />
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <Ionicons name="mail" size={24} color={Colors.button} />

                <TextInput
                  placeholder="Email"
                  style={styles.input}
                  onChangeText={onChange}
                  value={value}
                  autoCapitalize="none"
                />
              </View>
            )}
            name="email"
            rules={{ required: "Email is required" }}
          />

          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={24} color={Colors.button} />

                <TextInput
                  placeholder="Password"
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  secureTextEntry={true}
                  maxLength={20}
                />

                {errors.email && (
                  <Text style={{ color: "red" }}>This is required.</Text>
                )}
              </View>
            )}
            name="password"
            rules={{ required: true }}
          />
        </View>
        <Link href="/forgot-password" style={styles.forgotPassword}>
          Forgot password?
        </Link>
      </KeyboardAvoidingView>

      <View
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Sign Up</Text>
          <MaterialCommunityIcons
            name="arrow-right"
            size={20}
            color="#fff"
            style={{ marginLeft: 5 }}
          />
        </Pressable>
        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have an account?</Text>
          <Link href="/sign-in">
            <Text style={styles.signInLink}>Sign in</Text>
          </Link>
        </View>
      </View>

      <Text style={styles.continueText}>or continue with</Text>
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          justifyContent: "center",
        }}
      >
        <Pressable
          style={styles.socialButton}
          onPress={() => router.push("../(auth)/(tabs)/home")}
        >
          <Image
            source={require("@/assets/images/google.png")}
            style={styles.socialButtonImage}
          />
          <Text style={styles.socialButtonText}>Google</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  header: {
    flexDirection: "column",
    gap: 10,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 30,
  },
  inputContainer: {
    gap: 10,
    backgroundColor: Colors.lightGrey,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    borderColor: Colors.grey,
    borderWidth: 1,
    borderStyle: "solid",
  },
  input: {
    fontSize: 17,
    height: 40,
    width: "100%",
  },
  forgotPassword: {
    color: Colors.button,
    textAlign: "right",
    fontSize: 12,
    fontWeight: "bold",
    alignSelf: "flex-end",
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.button,
    width: "100%",
    height: 50,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
  signInContainer: {
    flexDirection: "row",
    gap: 5,
  },
  signInText: {
    color: Colors.button,
  },
  signInLink: {
    color: Colors.button,
    fontWeight: "bold",
  },
  continueText: {
    color: Colors.button,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
  },
  socialButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.grey,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
  },
  socialButtonImage: {
    height: 30,
    width: 30,
  },
  socialButtonText: {
    color: Colors.text,
    fontSize: 20,
  },
});

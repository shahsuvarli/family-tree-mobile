import { colors } from "@/theme/colors";
import { LinearGradient } from "expo-linear-gradient";
import { ReactNode, useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

interface AuthScaffoldProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

const AuthScaffold = ({
  eyebrow,
  title,
  subtitle,
  description,
  children,
  footer,
}: AuthScaffoldProps) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const { height } = useWindowDimensions();
  const isCompact = keyboardVisible || height < 760;

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(showEvent, () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <LinearGradient
      colors={["#f4ecdd", "#ead8bb", "#d7b78e"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.page}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 72 : 0}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            isCompact ? styles.contentCompact : styles.contentRegular,
          ]}
          automaticallyAdjustKeyboardInsets
          contentInsetAdjustmentBehavior="always"
          keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.heroCard, isCompact && styles.heroCardCompact]}>
            <View style={styles.heroCopy}>
              <Text style={styles.eyebrow}>{eyebrow}</Text>
              <Text style={styles.title}>{title}</Text>
              <Text style={[styles.subtitle, isCompact && styles.subtitleCompact]}>
                {subtitle}
              </Text>
              {!keyboardVisible ? (
                <Text style={styles.description}>{description}</Text>
              ) : null}
            </View>
            {!isCompact ? (
              <Image
                source={require("@/assets/images/auth-page.png")}
                style={styles.heroImage}
                resizeMode="contain"
              />
            ) : null}
          </View>

          <View style={styles.formCard}>{children}</View>

          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default AuthScaffold;

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 28,
    gap: 18,
  },
  contentRegular: {
    justifyContent: "center",
  },
  contentCompact: {
    justifyContent: "flex-start",
    paddingTop: 20,
    paddingBottom: 120,
  },
  heroCard: {
    backgroundColor: "rgba(255,255,255,0.68)",
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(47,79,79,0.08)",
    gap: 16,
  },
  heroCardCompact: {
    paddingVertical: 18,
    gap: 10,
  },
  heroCopy: {
    gap: 8,
  },
  eyebrow: {
    color: colors.button,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  title: {
    color: colors.button,
    fontSize: 32,
    fontWeight: "800",
  },
  subtitle: {
    color: "#7c6241",
    fontSize: 24,
    fontWeight: "700",
  },
  subtitleCompact: {
    fontSize: 20,
  },
  description: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  heroImage: {
    width: "100%",
    height: 160,
    alignSelf: "center",
  },
  formCard: {
    backgroundColor: "#fffdf9",
    borderRadius: 28,
    padding: 20,
    gap: 16,
    shadowColor: "#7c6241",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  footer: {
    alignItems: "center",
    paddingBottom: 12,
  },
});

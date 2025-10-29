import {
  GestureResponderEvent,
  Image,
  Linking,
  StyleSheet,
  View,
  Platform,
} from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

import { Pressable, Text } from "react-native";

type LinkButtonProps = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
};

function LinkButton({ title, onPress }: LinkButtonProps) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  // Function to handle deep linking with fallback
  const handleDeepLink = async (appUrl: string, webUrl: string) => {
    try {
      // Try to open the app first
      const supported = await Linking.canOpenURL(appUrl);

      if (supported) {
        await Linking.openURL(appUrl);
      } else {
        // Fallback to web URL
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      console.error("Error opening URL:", error);
      // Final fallback to web URL
      await Linking.openURL(webUrl);
    }
  };

  type LinkConfig = {
    title: string;
    appUrl: string;
    webUrl: string;
  };

  const links: LinkConfig[] = [
    {
      title: "Gmail",
      appUrl: "googlegmail://",
      webUrl: "https://concord.onelogin.com/launch/52278/?tab=cm",
    },
    {
      title: "Google Drive",
      appUrl: "google-drive://",
      webUrl: "https://drive.google.com/a/concordacademy.org",
    },
    {
      title: "Schoology",
      appUrl: "schoology://",
      webUrl: "https://concord.onelogin.com/launch/206009/",
    },
    {
      title: "Orah",
      appUrl: "orah://",
      webUrl: "https://app.orah.com/login",
    },
    {
      title: "PowerSchool",
      appUrl: "powerschool://",
      webUrl: "https://concordacademy.powerschool.com/",
    },
    {
      title: "StuFac Menu",
      appUrl: "sodexo://",
      webUrl: "https://concordacademydining.sodexomyway.com/",
    },
    {
      title: "Student Council",
      appUrl:
        "googlechrome://sites.google.com/concordacademy.org/ca-all-school-council/home",
      webUrl:
        "https://sites.google.com/concordacademy.org/ca-all-school-council/home",
    },
    {
      title: "CA Library",
      appUrl:
        "googlechrome://sites.google.com/concordacademy.org/concordacademylibrary/home",
      webUrl:
        "https://sites.google.com/concordacademy.org/concordacademylibrary/home",
    },
    {
      title: "Community + Equity",
      appUrl:
        "googlechrome://sites.google.com/concordacademy.org/community/home",
      webUrl: "https://sites.google.com/concordacademy.org/community/home",
    },
    {
      title: "NameCoach (Fac/Staff)",
      appUrl: "namecoach://",
      webUrl:
        "https://www.name-coach.com/events/ca-faculty-and-staff-2025-26/readonly",
    },
    {
      title: "CA Calendar",
      appUrl:
        Platform.OS === "ios"
          ? "calshow://"
          : "content://com.android.calendar/time/",
      webUrl: "http://calendar.concordacademy.org/?hl=en?tab=cc",
    },
    {
      title: "Family Portal",
      appUrl: "googlechrome://concordacademy.org/family-portal",
      webUrl: "http://concordacademy.org/family-portal",
    },
    {
      title: "Directory",
      appUrl:
        "googlechrome://sites.google.com/concordacademy.org/concordacademystudentresources/directory",
      webUrl:
        "https://sites.google.com/concordacademy.org/concordacademystudentresources/directory",
    },
    {
      title: "Parking Form",
      appUrl: "googledocs://",
      webUrl:
        "https://docs.google.com/forms/d/e/1FAIpQLSeiAXT8-btu55JU45neDYzesiYkH76ZeSPutZ18xXcvXYDZ4Q/viewform",
    },
    {
      title: "NameCoach (Students)",
      appUrl: "namecoach://",
      webUrl:
        "https://www.name-coach.com/events/ca-student-community-2025-26/readonly",
    },
    {
      title: "MBTA Form",
      appUrl: "googledocs://",
      webUrl:
        "https://docs.google.com/forms/d/e/1FAIpQLSf-wpBYm-p8EdTg9pCESK2fJeE5CRYuOqSGzwwF1puN6zB-mw/viewform",
    },
    {
      title: "Printing",
      appUrl:
        "googlechrome://sites.google.com/concordacademy.org/concordacademystudentresources/printing",
      webUrl:
        "https://sites.google.com/concordacademy.org/concordacademystudentresources/printing",
    },
    {
      title: "Student Tech Resources",
      appUrl:
        "googlechrome://sites.google.com/concordacademy.org/concord-academy-tech-resources/home",
      webUrl:
        "https://sites.google.com/concordacademy.org/concord-academy-tech-resources/home",
    },
  ];

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#13694E", dark: "#13694E" }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      headerImage={
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Image
            source={require("@/assets/images/ca-logo.png")}
            style={{ width: 150, height: 150, resizeMode: "contain" }}
          />
        </View>
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">CA Student Resources</ThemedText>
      </ThemedView>
      <View style={styles.buttonGrid}>
        {links.map((link) => (
          <View key={link.title} style={styles.buttonWrapper}>
            <LinkButton
              title={link.title}
              onPress={() => handleDeepLink(link.appUrl, link.webUrl)}
            />
          </View>
        ))}
      </View>
    </ParallaxScrollView>
  );
}

export const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  buttonWrapper: {
    flex: 1,
    minWidth: 250,
    margin: 4,
  },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  button: {
    backgroundColor: "#13694E",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
});

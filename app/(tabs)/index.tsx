import {
  GestureResponderEvent,
  Image,
  StyleSheet,
  View,
  Platform,
} from "react-native";
import * as Linking from "expo-linking";
import AppLink from "react-native-app-link";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { openInbox } from "react-native-email-link";

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
      console.log(`Can open ${appUrl}:`, supported);

      // if (supported) {
      await Linking.openURL(appUrl);
      // } else {
      //   // Fallback to web URL
      //   await Linking.openURL(webUrl);
      // }
    } catch (error) {
      console.error("Error opening URL:", error);
      // Final fallback to web URL
      await Linking.openURL(webUrl);
    }
  };

  const links: { title: string; onPress: () => void }[] = [
    {
      title: "Email",
      onPress: () => openInbox(),
    },
    {
      title: "Google Drive",
      onPress: () =>
        AppLink.maybeOpenURL("googledrive://", {
          appName: "Google Drive",
          appStoreId: "id507874739",
          playStoreId: "com.google.android.apps.docs",
        }),
    },
    {
      title: "Schoology",
      onPress: () =>
        AppLink.maybeOpenURL("schoology://", {
          appName: "Schoology",
          appStoreId: "id411766326",
          playStoreId: "com.schoology.app",
        }),
    },
    {
      title: "Orah",
      onPress: () =>
        // TODO: Find out correct URL
        AppLink.maybeOpenURL("orah://", {
          appName: "Orah",
          appStoreId: "id1383553237",
          playStoreId: "com.boardingware.studentapp",
        }),
    },
    {
      title: "PowerSchool",
      onPress: () => Linking.openURL("https://concordacademy.powerschool.com/"),
    },
    {
      title: "StuFac Menu",
      onPress: () =>
        Linking.openURL("https://concordacademydining.sodexomyway.com/en-us/"),
    },
    {
      title: "Student Council",
      onPress: () =>
        Linking.openURL(
          "https://sites.google.com/concordacademy.org/ca-all-school-council/home",
        ),
    },
    {
      title: "CA Library",
      onPress: () =>
        Linking.openURL(
          "https://sites.google.com/concordacademy.org/concordacademylibrary/home",
        ),
    },
    {
      title: "Community + Equity",
      onPress: () =>
        Linking.openURL(
          "https://sites.google.com/concordacademy.org/community/home",
        ),
    },
    {
      title: "NameCoach (Fac/Staff)",
      onPress: () =>
        Linking.openURL(
          "https://www.name-coach.com/events/ca-faculty-and-staff-2025-26/readonly",
        ),
    },
    {
      title: "CA Calendar",
      onPress: () =>
        Linking.openUrl("http://calendar.concordacademy.org/?hl=en?tab=cc"),
    },
    {
      title: "Family Portal",
      onPress: () => Linking.openURL("http://concordacademy.org/family-portal"),
    },
    {
      title: "Directory",
      onPress: () =>
        Linking.openURL(
          "https://sites.google.com/concordacademy.org/concordacademystudentresources/directory",
        ),
    },
    {
      title: "Parking Form",
      onPress: () =>
        Linking.openURL(
          "https://docs.google.com/forms/d/e/1FAIpQLSeiAXT8-btu55JU45neDYzesiYkH76ZeSPutZ18xXcvXYDZ4Q/viewform",
        ),
    },
    {
      title: "NameCoach (Students)",
      onPress: () =>
        Linking.openURL(
          "https://www.name-coach.com/events/ca-student-community-2025-26/readonly",
        ),
    },
    {
      title: "MBTA Form",
      onPress: () =>
        Linking.openURL(
          "https://docs.google.com/forms/d/e/1FAIpQLSf-wpBYm-p8EdTg9pCESK2fJeE5CRYuOqSGzwwF1puN6zB-mw/viewform",
        ),
    },
    {
      title: "Printing",
      onPress: () =>
        Linking.openURL(
          "https://sites.google.com/concordacademy.org/concordacademystudentresources/printing",
        ),
    },
    {
      title: "Student Tech Resources",
      onPress: () =>
        Linking.openURL(
          "https://sites.google.com/concordacademy.org/concord-academy-tech-resources/home",
        ),
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
              onPress={link.onPress}
              /* onPress={() => handleDeepLink(link.appUrl, link.webUrl)} */
              /* onPress={ */
              /*   () => openInbox() */
              /*   // Linking.openURL( */
              /*   //   "intent://#Intent;package=com.google.android.gm;scheme=mailto;end", */
              /*   // ) */
              /* } */
              /* onPress={async () => { */
              /*   try { */
              /*     await AppLink.maybeOpenURL("://", { */
              /*       appName: "Gmail", */
              /*       appStoreId: "id422689480", // iOS App Store ID */
              /*       playStoreId: "com.google.android.gm", // Android Package Name */
              /*     }); */
              /*   } catch (error) { */
              /*     console.log("Failed to open Gmail:", error); */
              /*   } */
              /* }} */
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

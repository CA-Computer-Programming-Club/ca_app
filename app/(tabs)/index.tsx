import {
  GestureResponderEvent,
  Image,
  Linking,
  StyleSheet,
  View,
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
  type Links = Record<string, string>;
  const links: Links = {
    Gmail:
      "https://www.google.com/url?q=https%3A%2F%2Fconcord.onelogin.com%2Flaunch%2F52278%2F%3Ftab%3Dcm&sa=D&sntz=1&usg=AOvVaw0xImL_wwzpYhaZZZv8naiY",
    "Google Drive": "https://drive.google.com/a/concordacademy.org",
    Schoology:
      "https://www.google.com/url?q=https%3A%2F%2Fconcord.onelogin.com%2Flaunch%2F206009%2F&sa=D&sntz=1&usg=AOvVaw3xfb0_A6661Gedmc81OHRE",
    Orah: "https://www.google.com/url?q=https%3A%2F%2Fapp.orah.com%2Flogin&sa=D&sntz=1&usg=AOvVaw3-zhvRze0j0Eb4FzainNaI",
    PowerSchool:
      "https://www.google.com/url?q=https%3A%2F%2Fconcordacademy.powerschool.com%2F&sa=D&sntz=1&usg=AOvVaw1eNn96ooW_gx54yGb3nfrK",
    "StuFac Menu":
      "https://www.google.com/url?q=https%3A%2F%2Fconcordacademydining.sodexomyway.com%2F&sa=D&sntz=1&usg=AOvVaw2wDCPoNUDALLv9TDFX2Er0",
    "Student Council":
      "https://www.google.com/url?q=https%3A%2F%2Fsites.google.com%2Fconcordacademy.org%2Fca-all-school-council%2Fhome&sa=D&sntz=1&usg=AOvVaw0Y63nz_C8EdDWXZXDpfE_d",
    "CA Library":
      "https://www.google.com/url?q=https%3A%2F%2Fsites.google.com%2Fconcordacademy.org%2Fconcordacademylibrary%2Fhome&sa=D&sntz=1&usg=AOvVaw0RPXntnvlfyM_uJGhMPCPv",
    "Community + Equity":
      "https://www.google.com/url?q=https%3A%2F%2Fsites.google.com%2Fconcordacademy.org%2Fcommunity%2Fhome&sa=D&sntz=1&usg=AOvVaw22Ln3gyBAG9kjyapZznBqo",
    "NameCoach (Fac/Staff)":
      "https://www.google.com/url?q=https%3A%2F%2Fwww.name-coach.com%2Fevents%2Fca-faculty-and-staff-2025-26%2Freadonly&sa=D&sntz=1&usg=AOvVaw2Z1mRDlYi5HSKXCsAcpf3y",
    "CA Calendar":
      "http://www.google.com/url?q=http%3A%2F%2Fcalendar.concordacademy.org%2F%3Fhl%3Den%3Ftab%3Dcc&sa=D&sntz=1&usg=AOvVaw1qgqnnanGR2ayxdrRXp4y6",
    "Family Portal":
      "http://www.google.com/url?q=http%3A%2F%2Fconcordacademy.org%2Ffamily-portal&sa=D&sntz=1&usg=AOvVaw1EnEAORw-Pqq6ZyowULajx",
    Directory:
      "https://sites.google.com/concordacademy.org/concordacademystudentresources/directory",
    "Parking Form":
      "https://docs.google.com/forms/d/e/1FAIpQLSeiAXT8-btu55JU45neDYzesiYkH76ZeSPutZ18xXcvXYDZ4Q/viewform",
    "NameCoach (Students)":
      "https://www.google.com/url?q=https%3A%2F%2Fwww.name-coach.com%2Fevents%2Fca-student-community-2025-26%2Freadonly&sa=D&sntz=1&usg=AOvVaw3vdZGgcGbrHrile4AK1lRQ",
    "MBTA Form":
      "https://docs.google.com/forms/d/e/1FAIpQLSf-wpBYm-p8EdTg9pCESK2fJeE5CRYuOqSGzwwF1puN6zB-mw/viewform",
    Printing:
      "https://sites.google.com/concordacademy.org/concordacademystudentresources/printing",
    "Student Tech Resources":
      "https://www.google.com/url?q=https%3A%2F%2Fsites.google.com%2Fconcordacademy.org%2Fconcord-academy-tech-resources%2Fhome&sa=D&sntz=1&usg=AOvVaw3zDyzpknbderjTTfgBD4K1",
  };

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
        {Object.entries(links).map(([title, url]) => (
          <View key={title} style={styles.buttonWrapper}>
            <LinkButton title={title} onPress={() => Linking.openURL(url)} />
          </View>
        ))}
      </View>
      {/* <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Step 1: Try it</ThemedText>
          <ThemedText>
          Edit{" "}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText>{" "}
          to see changes. Press{" "}
          <ThemedText type="defaultSemiBold">
          {Platform.select({
          ios: "cmd + d",
          android: "cmd + m",
          web: "F12",
          })}
          </ThemedText>{" "}
          to open developer tools.
          </ThemedText>
          </ThemedView> */}
      {/* <ThemedView style={styles.stepContainer}> */}
      {/*   <Link href="/modal"> */}
      {/*     <Link.Trigger> */}
      {/*       <ThemedText type="subtitle">Step 2: Explore</ThemedText> */}
      {/*     </Link.Trigger> */}
      {/*     <Link.Preview /> */}
      {/*     <Link.Menu> */}
      {/*       <Link.MenuAction */}
      {/*         title="Action" */}
      {/*         icon="cube" */}
      {/*         onPress={() => alert("Action pressed")} */}
      {/*       /> */}
      {/*       <Link.MenuAction */}
      {/*         title="Share" */}
      {/*         icon="square.and.arrow.up" */}
      {/*         onPress={() => alert("Share pressed")} */}
      {/*       /> */}
      {/*       <Link.Menu title="More" icon="ellipsis"> */}
      {/*         <Link.MenuAction */}
      {/*           title="Delete" */}
      {/*           icon="trash" */}
      {/*           destructive */}
      {/*           onPress={() => alert("Delete pressed")} */}
      {/*         /> */}
      {/*       </Link.Menu> */}
      {/*     </Link.Menu> */}
      {/*   </Link> */}

      {/*   <ThemedText> */}
      {/*     {`Tap the Explore tab to learn more about what's included in this starter app.`} */}
      {/*   </ThemedText> */}
      {/* </ThemedView> */}
      {/* <ThemedView style={styles.stepContainer}> */}
      {/*   <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText> */}
      {/*   <ThemedText> */}
      {/*     {`When you're ready, run `} */}
      {/*     <ThemedText type="defaultSemiBold"> */}
      {/*       npm run reset-project */}
      {/*     </ThemedText>{" "} */}
      {/*     to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "} */}
      {/*     directory. This will move the current{" "} */}
      {/*     <ThemedText type="defaultSemiBold">app</ThemedText> to{" "} */}
      {/*     <ThemedText type="defaultSemiBold">app-example</ThemedText>. */}
      {/*   </ThemedText> */}
      {/* </ThemedView> */}
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

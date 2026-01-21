import { StyleSheet, TextInput } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedTextInput } from "@/components/themed-text-input";
import { ThemedView } from "@/components/themed-view";
import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [username, onChangeName] = React.useState("Username");

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#13694E", dark: "#13694E" }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      // headerImage={
      //   <Image
      //     source={require("@/assets/images/partial-react-logo.png")}
      //     style={styles.reactLogo}
      //   />
      // }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Schedule</ThemedText>
      </ThemedView>
      <ThemedView style={styles.headingContainer}>
        <ThemedText style={styles.heading}>Log In</ThemedText>
      </ThemedView>
      <ThemedView>
        <SafeAreaProvider>
          <SafeAreaView>
            <ThemedTextInput
              style={styles.input}
              onChangeText={onChangeName}
              value={username}
            />
          </SafeAreaView>
        </SafeAreaProvider>
      </ThemedView>
    </ParallaxScrollView>
  );
}
// };

const styles = StyleSheet.create({
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
  heading: {
    fontSize: 36,
    lineHeight: 72,
  },
  headingContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

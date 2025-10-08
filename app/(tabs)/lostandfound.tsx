import { Alert, Pressable, StyleSheet, Text } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      /* headerImage={ */
      /*   <IconSymbol */
      /*     size={310} */
      /*     color="#808080" */
      /*     name="chevron.left.forwardslash.chevron.right" */
      /*     style={styles.headerImage} */
      /*   /> */
      /* } */
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Lost and Found</ThemedText>
      </ThemedView>
      <Pressable
        style={{ backgroundColor: "purple" }}
        onPress={Alert.alert(
          "Alert Title",
          "My Alert Msg",
          [
            {
              text: "Cancel",
              onPress: () => Alert.alert("Cancel Pressed"),
              style: "cancel",
            },
          ],
          {
            cancelable: true,
            onDismiss: () =>
              Alert.alert(
                "This alert was dismissed by tapping outside of the alert dialog.",
              ),
          },
        )}
      >
        <Text>+</Text>
      </Pressable>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    backgroundColor: "#14694f",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
});

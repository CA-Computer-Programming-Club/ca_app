import { Alert, Pressable, StyleSheet, Text } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

export default function TabTwoScreen() {
  return (
    <>
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
        <ThemedText type="text" style={styles.text}>
          Lost and Found items will be listed here
        </ThemedText>
      </ParallaxScrollView>
      <Pressable
        style={{...styles.floatingRectButton,bottom:180}}
      >
        <Text style={styles.floatingSquareButtonText}>Lost my shit</Text>
      </Pressable>
      <Pressable
        style={styles.floatingRectButton}
      >
        <Text style={styles.floatingSquareButtonText}>Found someone's shit</Text>
      </Pressable>
      <Pressable
        style={styles.floatingButton}
        onPress={() => 
          Alert.alert(
            "Alert Title",
            "My Alert Msg",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              { text: "OK", onPress: () => console.log("OK Pressed") },
            ],
            { cancelable: true },
          )
        }
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </Pressable>
    </>
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
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "purple",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  floatingRectButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "gray",
    width: 250,
    height: 60,
    borderRadius: 0,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  floatingButtonText: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
  },
  floatingSquareButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

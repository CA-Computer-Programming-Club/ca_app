import { useState } from "react";
import {
  ActionSheetIOS,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger
} from "react-native-popup-menu";

export default function TabTwoScreen() {
  const [showMenu, setShowMenu] = useState(false);

  const showActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Lost", "Found"],
        cancelButtonIndex: 0,
        destructiveButtonIndex: 2,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          alert("Lost");
        } else if (buttonIndex === 2) {
          alert("Found");
        }
      },
    );
  };

  const handleMenuTrigger = () => {
    if (Platform.OS === "ios") {
      showActionSheet();
    } else {
      setShowMenu(true);
    }
  };

  // Custom Plus Button Component
  const PlusButton = ({ onPress }) => (
    <TouchableOpacity style={styles.circularButton} onPress={onPress}>
      <ThemedText style={styles.plusSign}>+</ThemedText>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#13694E", dark: "#13694E" }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Lost and Found</ThemedText>
        </ThemedView>
        <ThemedText>Lost and Found items will be listed here</ThemedText>
      </ParallaxScrollView>

      {Platform.OS === "ios" ? (
        // iOS - Use custom PlusButton to trigger ActionSheet
        <View style={styles.floatingButtonContainer}>
          <PlusButton onPress={handleMenuTrigger} />
        </View>
      ) : (
        <View style={styles.floatingButtonContainer}>
          <Menu opened={showMenu} onBackdropPress={() => setShowMenu(false)}>
            <MenuTrigger
              onPress={handleMenuTrigger}
              customStyles={{
                triggerWrapper: styles.circularButton, // use your button style
                triggerText: styles.plusSign,
              }}
              text="+"
            />
            <MenuOptions>
              <MenuOption
                onSelect={() => {
                  alert("Lost");
                  setShowMenu(false);
                }}
                text="Lost"
              />
              <MenuOption
                onSelect={() => {
                  alert("Found");
                  setShowMenu(false);
                }}
                text="Found"
              />
            </MenuOptions>
          </Menu>
        </View>
      )}
    </View>
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
  floatingButtonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  circularButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "purple",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  plusSign: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 24,
    textAlign: "center",
    includeFontPadding: false,
  },
  triggerWrapper: {
    // Hide the default trigger
    width: 0,
    height: 0,
    opacity: 0,
  },
});

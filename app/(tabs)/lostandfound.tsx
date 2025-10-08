import { Button, StyleSheet, View } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from 'react-native-popup-menu';

export default function TabTwoScreen() {
  return (
    <MenuProvider>
      <View style={{ flex: 1 }}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#13694E", dark: "#13694E" }}
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
        <ThemedText>
          Lost and Found items will be listed here
        </ThemedText>
      </ParallaxScrollView>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Menu>
          <MenuTrigger>
            <Button title="Open Menu" />
          </MenuTrigger>

          <MenuOptions>
            <MenuOption onSelect={() => alert('Option 1 selected')} text="Option 1" />
            <MenuOption onSelect={() => alert('Option 2 selected')} text="Option 2" />
            <MenuOption onSelect={() => alert('Option 3 selected')} text="Option 3" />
          </MenuOptions>
        </Menu>
      </View>
      </View>
      </MenuProvider>
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
    lineHeight: 36,
    textAlign: "center",
    includeFontPadding: false,
  },
  floatingSquareButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 36,
    textAlign: "center",
    includeFontPadding: false,
  },
});

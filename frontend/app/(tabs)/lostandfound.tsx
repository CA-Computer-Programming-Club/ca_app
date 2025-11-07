import { useState } from "react";
import {
  ActionSheetIOS,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "expo-router";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

import dummyData from "@/data/dummy-data.json";

const imageMap: Record<string, any> = {
  "black_wallet.jpg": require("@/assets/images/black_wallet.jpg"),
  "keys.jpg": require("@/assets/images/keys.jpg"),
  "black_hoodie.jpg": require("@/assets/images/black_hoodie.jpg"),
  "water_bottle.jpg": require("@/assets/images/water_bottle.jpg"),
};

export default function TabTwoScreen() {
  const [showMenu, setShowMenu] = useState(false);
  const navigation = useNavigation();

  const showActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Lost Item", "Found Item"],
        // cancelButtonIndex: 0,
        // destructiveButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          alert("Lost Item");
        } else if (buttonIndex === 1) {
          alert("Found Item");
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
  const PlusButton = ({ onPress }: { onPress: any }) => (
    <TouchableOpacity style={styles.circularButton} onPress={onPress}>
      <ThemedText style={styles.plusSign}>+</ThemedText>
    </TouchableOpacity>
  );

  const renderPost = (item: {
    id: string | number;
    type: string;
    title: string;
    location: string;
    description: string;
    image: string;
  }) => (
    <ThemedView
      key={item.id}
      style={styles.postContainer}
      lightColor="#fff"
      darkColor="#2c2c2e"
    >
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("postdetail", {
            post: item.id,
          })
        }
      >
        <ThemedText style={styles.postTitle}>{item.title}</ThemedText>
        <ThemedText
          style={styles.postType}
          lightColor={item.type === "lost" ? "#c0392b" : "#27ae60"}
          darkColor={item.type === "lost" ? "#e94f3f" : "#27ae60"}
        >
          {item.type.toUpperCase()}
        </ThemedText>
        <ThemedText
          style={styles.postLocation}
          lightColor="#555"
          darkColor="#aaa"
        >
          {item.type === "lost"
            ? "Last Seen: 📍 " + item.location
            : "📍 " + item.location}
        </ThemedText>
        <ThemedText
          style={styles.postDescription}
          lightColor="#333"
          darkColor="#ddd"
        >
          {item.description}
        </ThemedText>
        <Image
          source={imageMap[item.image]}
          style={{ width: 100, height: 100, backgroundColor: "lightgray" }}
        />
      </TouchableOpacity>
    </ThemedView>
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
        <ScrollView contentContainerStyle={styles.postsWrapper}>
          {dummyData.map((item) => renderPost(item))}
        </ScrollView>
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
                  alert("Lost Item");
                  setShowMenu(false);
                }}
                text="Lost Item"
              />
              <MenuOption
                onSelect={() => {
                  alert("Found Item");
                  setShowMenu(false);
                }}
                text="Found Item"
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
  postsWrapper: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 4,
  },
  postContainer: {
    // backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    // marginHorizontal: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    elevation: 3,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  postType: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  postLocation: {
    fontSize: 13,
    marginTop: 4,
    // color: "#555",
  },
  postDescription: {
    fontSize: 13,
    marginTop: 6,
    // color: "#333",
  },
});

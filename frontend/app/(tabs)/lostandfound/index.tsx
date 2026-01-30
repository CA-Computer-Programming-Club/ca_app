import { useEffect, useState, useLayoutEffect } from "react";
import { useRouter } from "expo-router";
import {
  ActionSheetIOS,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import showAlert from "@/components/alert";
import { useNavigationState } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { IconSymbol } from "@/components/ui/icon-symbol";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ThemedModal } from "@/components/themed-modal";
import { ThemedTextInput } from "@/components/themed-text-input";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

import * as ImagePicker from "expo-image-picker";

import { SERVER_URL } from "@/config";

interface Item {
  id: string | number;
  type: string;
  title: string;
  location: string;
  description: string;
  image_filename: string | null;
  created_at: string;
}

type Mode = "lost" | "found";

type LostFoundToggleProps = {
  mode: Mode;
  onChange: (mode: Mode) => void;
};

import { useThemeColor } from "@/hooks/use-theme-color";

export function LostFoundToggle({ mode, onChange }: LostFoundToggleProps) {
  const activeBg = useThemeColor({ light: "#13694E", dark: "#1FA37A" }, "tint");

  const inactiveBg = useThemeColor(
    { light: "#e5e7eb", dark: "#2c2c2e" },
    "background",
  );

  const activeText = useThemeColor(
    { light: "#ffffff", dark: "#ffffff" },
    "text",
  );

  const inactiveText = useThemeColor(
    { light: "#374151", dark: "#a1a1aa" },
    "text",
  );

  return (
    <View style={styles.toggleRow}>
      <TouchableOpacity
        onPress={() => onChange("lost")}
        style={[
          styles.toggleButton,
          { backgroundColor: mode === "lost" ? activeBg : inactiveBg },
          { marginRight: 8 },
        ]}
      >
        <ThemedText
          style={[
            styles.toggleText,
            { color: mode === "lost" ? activeText : inactiveText },
          ]}
        >
          Lost
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onChange("found")}
        style={[
          styles.toggleButton,
          { backgroundColor: mode === "found" ? activeBg : inactiveBg },
        ]}
      >
        <ThemedText
          style={[
            styles.toggleText,
            { color: mode === "found" ? activeText : inactiveText },
          ]}
        >
          Found
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

function SearchBar({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (t: string) => void;
}) {
  const bg = useThemeColor({ light: "#f3f4f6", dark: "#2c2c2e" }, "background");
  const border = useThemeColor(
    { light: "rgba(0,0,0,0.12)", dark: "rgba(255,255,255,0.12)" },
    "text",
  );
  const text = useThemeColor({ light: "#111827", dark: "#ffffff" }, "text");
  const placeholder = useThemeColor(
    { light: "rgba(17,24,39,0.45)", dark: "rgba(255,255,255,0.45)" },
    "text",
  );

  return (
    <View
      style={[
        styles.searchContainer,
        { backgroundColor: bg, borderColor: border },
      ]}
    >
      <IconSymbol
        name="magnifyingglass"
        size={18}
        color={placeholder}
        style={{ marginRight: 8 }}
      />

      <ThemedTextInput
        style={[styles.searchInput, { color: text }]}
        placeholder="Search lost & found"
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        placeholderTextColor={placeholder}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode={Platform.OS === "ios" ? "while-editing" : "never"}
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText("")}
          style={styles.searchClearHitbox}
        >
          <IconSymbol name="xmark" size={16} color={placeholder} />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function TabTwoScreen() {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"lost" | "found">("lost");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [mode, setMode] = useState<Mode>("lost");
  const [searchQuery, setSearchQuery] = useState("");

  const navigation = useNavigation();

  useLayoutEffect(() => {
    if (Platform.OS === "ios") {
      navigation.setOptions({
        headerSearchBarOptions: {
          placeholder: "Search lost & found",
          onChangeText: (event) => {
            setSearchQuery(event.nativeEvent.text);
          },
        },
        headerRight: () => (
          <TouchableOpacity
            onPress={handleMenuTrigger}
            activeOpacity={0.7}
            style={styles.headerPlus}
          >
            <ThemedText style={styles.headerPlusText}>+</ThemedText>
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchItems();
    console.log("Refreshed items");
    setRefreshing(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/get_all_items`);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const pickImage = async () => {
    try {
      // Web implementation
      if (Platform.OS === "web") {
        return new Promise((resolve) => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";

          input.onchange = (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
              const imageUrl = URL.createObjectURL(file);
              setSelectedImage(imageUrl);
              // Store the file for upload
              setSelectedImageFile(file);
            }
          };

          input.click();
        });
      }

      // Mobile implementation
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showAlert("Permission Denied", "Camera roll permissions are required.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      showAlert("Error", "Failed to pick image");
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        showAlert("Sorry, we need camera permissions to make this work!");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      showAlert("Error", "Failed to take photo");
    }
  };

  const showImagePickerOptions = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Take Photo", "Choose from Library"],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) takePhoto();
          else if (buttonIndex === 2) pickImage();
        },
      );
    } else if (Platform.OS === "web") {
      pickImage();
    } else {
      showAlert("Select Image", "Choose an option", [
        { text: "Cancel", style: "cancel" },
        { text: "Take Photo", onPress: takePhoto },
        { text: "Choose from Library", onPress: pickImage },
      ]);
    }
  };

  const openAddModal = (type: "lost" | "found") => {
    setModalType(type);
    setFormData({ title: "", description: "", location: "" });
    setSelectedImage(null);
    setModalVisible(true);
  };

  const submitItem = async () => {
    if (!formData.title || !formData.description || !formData.location) {
      showAlert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("location", formData.location);

      if (Platform.OS === "web" && selectedImageFile) {
        formDataToSend.append("image", selectedImageFile);
      } else if (selectedImage) {
        // Extract filename from URI
        const filename = selectedImage.split("/").pop() || "photo.jpg";

        // Get file extension and determine MIME type
        const match = /\.(\w+)$/.exec(filename);
        const mimeType = match ? `image/${match[1]}` : "image/jpeg";

        formDataToSend.append("image", {
          uri: selectedImage,
          name: filename,
          type: mimeType,
        } as any);
      }

      const endpoint =
        modalType === "lost" ? "add_lost_item" : "add_found_item";

      console.log("Submitting to:", `${SERVER_URL}/${endpoint}`);

      const response = await fetch(`${SERVER_URL}/${endpoint}`, {
        method: "POST",
        body: formDataToSend,
      });

      console.log("Response status:", response.status);

      if (response.ok) {
        const addedItem = await response.json();
        setItems((prev) => [addedItem, ...prev]);
        setModalVisible(false);
        setFormData({ title: "", description: "", location: "" });
        setSelectedImage(null);
        showAlert(
          "Success",
          `${modalType === "lost" ? "Lost" : "Found"} item added successfully!`,
        );
      } else {
        const errorText = await response.text();
        console.error("Server response:", errorText);
        throw new Error(
          `Failed to add item: ${response.status} - ${errorText}`,
        );
      }
    } catch (error: any) {
      console.error("Error adding item:", error);
      showAlert("Error", `Failed to add item: ${error.message}`);
    }
  };

  const showActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      { options: ["Lost Item", "Found Item"] },
      (buttonIndex) => {
        if (buttonIndex === 0) openAddModal("lost");
        else if (buttonIndex === 1) openAddModal("found");
      },
    );
  };

  const handleMenuTrigger = () => {
    if (Platform.OS === "ios") showActionSheet();
    else setShowMenu(true);
  };

  const PlusButton = ({ onPress }: { onPress: any }) => (
    <TouchableOpacity style={styles.circularButton} onPress={onPress}>
      <ThemedText style={styles.plusSign}>+</ThemedText>
    </TouchableOpacity>
  );

  const renderPost = (item: Item) => (
    <ThemedView
      key={item.id}
      style={styles.postContainer}
      lightColor="#fff"
      darkColor="#2c2c2e"
    >
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/lostandfound/postdetail",
            params: { post: item.id },
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
        {item.image_filename && (
          <Image
            source={{ uri: `${SERVER_URL}/uploads/${item.image_filename}` }}
            style={styles.image}
          />
        )}
      </TouchableOpacity>
    </ThemedView>
  );

  // TODO filter server-side if needed
  const filteredItems = items.filter((item) => {
    if (item.type !== mode) return false;

    const q = searchQuery.toLowerCase();

    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q)
    );
  });

  return (
    <View style={{ flex: 1 }}>
      <ParallaxScrollView
        contentInsetAdjustmentBehavior="automatic"
        headerBackgroundColor={{ light: "#13694E", dark: "#13694E" }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        headerImage={
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={require("@/assets/images/chameleons.png")}
              resizeMode="cover"
              style={{ width: "100%", height: "100%" }}
            />
          </View>
        }
        refreshing={refreshing}
        onRefresh={onRefresh}
      >
        {/* <ThemedView style={styles.titleContainer}> */}
        {/*   <ThemedText type="title">Lost and Found</ThemedText> */}
        {/* </ThemedView> */}

        {Platform.OS !== "ios" && (
          <View style={{ paddingHorizontal: 4, marginTop: 8 }}>
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
          </View>
        )}

        <View style={{ paddingHorizontal: 4 }}>
          <LostFoundToggle mode={mode} onChange={setMode} />
        </View>

        <ScrollView contentContainerStyle={styles.postsWrapper}>
          {items.length === 0 ? (
            <ThemedText
              style={{
                textAlign: "center",
                marginTop: 40,
                opacity: 0.6,
                fontSize: 16,
              }}
            >
              No items found
            </ThemedText>
          ) : (
            filteredItems.map((item) => renderPost(item))
          )}
        </ScrollView>
      </ParallaxScrollView>

      <ThemedModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={`Add ${modalType === "lost" ? "Lost" : "Found"} Item`}
        lightBackgroundColor={{
          modal: "#ffffff",
          overlay: "rgba(0,0,0,0.4)",
        }}
        darkBackgroundColor={{
          modal: "#2c2c2e",
          overlay: "rgba(0,0,0,0.6)",
        }}
      >
        <ThemedTextInput
          style={styles.input}
          placeholder="Title"
          value={formData.title}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, title: text }))
          }
          returnKeyType="done"
          lightColor="#000000"
          darkColor="#FFFFFF"
          placeholderLightColor="#666666"
          placeholderDarkColor="#AAAAAA"
        />
        <ThemedTextInput
          style={styles.multilineInput}
          placeholder="Description"
          value={formData.description}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, description: text }))
          }
          multiline
          lightColor="#000000"
          darkColor="#FFFFFF"
          placeholderLightColor="#666666"
          placeholderDarkColor="#AAAAAA"
        />
        <ThemedTextInput
          style={styles.input}
          placeholder="Location"
          value={formData.location}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, location: text }))
          }
          returnKeyType="done"
          lightColor="#000000"
          darkColor="#FFFFFF"
          placeholderLightColor="#666666"
          placeholderDarkColor="#AAAAAA"
        />

        {/* Image Selection */}
        <View style={styles.imageSection}>
          <ThemedText style={styles.imageLabel}>Image (Optional)</ThemedText>
          {selectedImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.imagePreview}
              />
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={showImagePickerOptions}
              >
                <ThemedText style={styles.changeImageText}>
                  Change Image
                </ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addImageButton}
              onPress={showImagePickerOptions}
            >
              <ThemedText style={styles.addImageText}>+ Add Image</ThemedText>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => setModalVisible(false)}
          >
            <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={submitItem}
          >
            <ThemedText style={styles.submitButtonText}>Add Item</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedModal>

      {Platform.OS !== "ios" && (
        <View style={styles.floatingButtonContainer}>
          <Menu opened={showMenu} onBackdropPress={() => setShowMenu(false)}>
            <MenuTrigger
              onPress={handleMenuTrigger}
              customStyles={{
                triggerWrapper: styles.circularButton,
                triggerText: styles.plusSign,
              }}
              text="+"
            />
            <MenuOptions>
              <MenuOption
                onSelect={() => {
                  openAddModal("lost");
                  setShowMenu(false);
                }}
                text="Lost Item"
              />
              <MenuOption
                onSelect={() => {
                  openAddModal("found");
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
  titleContainer: { flexDirection: "row", gap: 8 },
  floatingButtonContainer: { position: "absolute", bottom: 20, right: 20 },
  circularButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "purple",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
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
  },
  postsWrapper: { paddingTop: 20, paddingBottom: 20, paddingHorizontal: 4 },
  postContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    elevation: 3,
  },
  postTitle: { fontSize: 18, fontWeight: "bold" },
  postType: { fontSize: 14, fontWeight: "600", marginTop: 4 },
  postLocation: { fontSize: 13, marginTop: 4 },
  postDescription: { fontSize: 13, marginTop: 6 },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    width: "80%",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    textAlign: "left",
    textAlignVertical: "center",
    lineHeight: 16,
    paddingVertical: Platform.OS === "ios" ? 10 : 12,
  },
  multilineInput: {
    height: 80,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    textAlignVertical: "top",
    marginBottom: 10,
  },
  imageSection: {
    marginTop: 15,
  },
  imageLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  imagePreviewContainer: {
    alignItems: "center",
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#ccc",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginTop: 10,
    backgroundColor: "#ccc",
  },
  addImageButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
  },
  addImageText: {
    color: "#666",
  },
  changeImageButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 6,
  },
  changeImageText: {
    color: "#333",
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  submitButton: {
    backgroundColor: "#13694E",
  },
  cancelButton: {
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#c8c7cc",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButtonText: {
    color: "#13694E",
    fontSize: 16,
    fontWeight: "600",
  },
  toggleRow: {
    flexDirection: "row",
    width: "100%",
    marginTop: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 0,
  },
  toggleButtonActive: {
    backgroundColor: "#13694E",
  },
  toggleButtonInactive: {
    backgroundColor: "#e5e7eb",
  },
  toggleText: {
    fontSize: 15,
    fontWeight: "600",
  },
  toggleTextActive: {
    color: "#ffffff",
  },
  toggleTextInactive: {
    color: "#374151",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 15,
    borderWidth: 0, // RN
    backgroundColor: "transparent",
    outlineStyle: "none",
    outlineWidth: 0,
    boxShadow: "none",
    borderColor: "transparent",
  },
  searchClearHitbox: {
    paddingLeft: 8,
    paddingVertical: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  searchClear: {
    fontSize: 16,
    lineHeight: 16,
    textAlignVertical: "center",
  },
  headerPlus: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "purple",
    // backgroundColor: "#13694E",

    alignItems: "center",
    justifyContent: "center",
  },
  headerPlusText: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    lineHeight: 22,
  },
});

import type { PropsWithChildren } from "react";
import {
  ModalProps,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Modal,
  Keyboard,
} from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";

type Props = PropsWithChildren<
  ModalProps & {
    visible: boolean;
    onClose: () => void;
    title?: string;
    lightBackgroundColor?: { modal: string; overlay: string };
    darkBackgroundColor?: { modal: string; overlay: string };
    lightPlaceholderColor?: string;
    darkPlaceholderColor?: string;
  }
>;

export function ThemedModal({
  children,
  visible,
  onClose,
  title,
  lightBackgroundColor = { modal: "#ffffff", overlay: "rgba(0,0,0,0.4)" },
  darkBackgroundColor = { modal: "#2c2c2e", overlay: "rgba(0,0,0,0.6)" },
  lightPlaceholderColor,
  darkPlaceholderColor,
  ...props
}: Props) {
  const colorScheme = useColorScheme() ?? "light";

  const overlayBgColor =
    colorScheme === "light"
      ? lightBackgroundColor.overlay
      : darkBackgroundColor.overlay;

  // Function to apply placeholder colors to children
  const renderChildrenWithPlaceholderColors = () => {
    if (!lightPlaceholderColor && !darkPlaceholderColor) {
      return children;
    }

    // If you need to recursively apply placeholder colors to all children,
    // you would use React.Children.map here. However, a simpler approach
    // is to pass the colors as context or let the parent component handle it.

    // For now, we'll return children as-is since placeholder color is typically
    // handled by individual input components
    return children;
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
      {...props}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.overlay, { backgroundColor: overlayBgColor }]}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedView
              style={styles.modalContent}
              lightColor={lightBackgroundColor.modal}
              darkColor={darkBackgroundColor.modal}
            >
              {title && (
                <ThemedText type="title" style={styles.title}>
                  {title}
                </ThemedText>
              )}
              {renderChildrenWithPlaceholderColors()}
            </ThemedView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    padding: 20,
    borderRadius: 12,
    width: "80%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
    fontSize: 24,
  },
});

// Export a hook to use the placeholder colors in child components
export const useModalPlaceholderColors = (
  lightPlaceholderColor?: string,
  darkPlaceholderColor?: string,
) => {
  const colorScheme = useColorScheme() ?? "light";

  return colorScheme === "light" ? lightPlaceholderColor : darkPlaceholderColor;
};

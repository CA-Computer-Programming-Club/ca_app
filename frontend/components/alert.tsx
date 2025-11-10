import { Alert, Platform } from "react-native";

type ShowAlertType = (title: string, message?: string, buttons?: any[]) => void;

const showAlert: ShowAlertType = (
  title,
  message,
  buttons = [{ text: "OK", style: "default" }],
) => {
  if (Platform.OS === "web") {
    // Simple fallback for web
    alert(`${title}${message ? `\n\n${message}` : ""}`);
  } else {
    // Use React Native's Alert for mobile
    Alert.alert(title, message, buttons);
  }
};

export default showAlert;

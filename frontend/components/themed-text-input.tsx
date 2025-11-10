import { TextInput, type TextInputProps } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  placeholderLightColor?: string;
  placeholderDarkColor?: string;
};

export function ThemedTextInput({
  style,
  lightColor,
  darkColor,
  placeholderLightColor,
  placeholderDarkColor,
  placeholder,
  ...rest
}: ThemedTextInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const placeholderColor = useThemeColor(
    {
      light: placeholderLightColor,
      dark: placeholderDarkColor,
    },
    "text",
  );

  return (
    <TextInput
      style={[{ color }, style]}
      placeholder={placeholder}
      placeholderTextColor={placeholderColor}
      {...rest}
    />
  );
}

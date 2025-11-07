import { Button, Linking } from "react-native";

type LinkButtonProps = {
  title: string;
  url: string;
};

export function LinkButton({ title, url }: LinkButtonProps) {
  return <Button title={title} onPress={() => Linking.openURL(url)} />;
}

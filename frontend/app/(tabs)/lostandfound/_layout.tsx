import { Stack } from "expo-router";

export default function LostAndFoundLayout() {
  return (
    <Stack
      screenOptions={{
        // headerShown: false,
        presentation: "card", // or "modal" for iOS-style
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Lost & Found",
        }}
      />
      <Stack.Screen
        name="postdetail"
        options={{
          headerShown: true,
          title: "Post Details",
          presentation: "card",
        }}
      />
    </Stack>
  );
}

import { View, StyleSheet, Image, ScrollView } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useLocalSearchParams, Stack } from "expo-router";
import { Post } from "@/types/posts";

import rawData from "@/data/dummy-data.json";
const dummyData = rawData as Post[];

const imageMap: Record<string, any> = {
  "black_wallet.jpg": require("@/assets/images/black_wallet.jpg"),
  "keys.jpg": require("@/assets/images/keys.jpg"),
  "black_hoodie.jpg": require("@/assets/images/black_hoodie.jpg"),
  "water_bottle.jpg": require("@/assets/images/water_bottle.jpg"),
};

export default function PostDetailScreen() {
  const { post } = useLocalSearchParams();

  const postData: Post | undefined = dummyData.find(
    (item) => item.id.toString() === (post as string),
  );

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: postData?.title,
          headerBackTitle: "Back",
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.imageContainer}>
          <Image
            source={imageMap[postData?.image]}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.contentContainer}>
          <ThemedText type="title" style={styles.title}>
            {postData?.title}
          </ThemedText>

          <ThemedText
            style={[
              styles.type,
              { color: postData?.type === "lost" ? "#c0392b" : "#27ae60" },
            ]}
          >
            {postData?.type.toUpperCase()}
          </ThemedText>

          <ThemedText style={styles.location}>
            {postData?.type === "lost"
              ? "Last Seen: 📍 " + postData?.location
              : "📍 " + postData?.location}
          </ThemedText>

          <ThemedText style={styles.description}>
            {postData?.description}
          </ThemedText>

          <View style={styles.metaContainer}>
            <ThemedText style={styles.metaText}>
              Item ID: #{postData?.id}
            </ThemedText>
            <ThemedText style={styles.metaText}>
              Status: {postData?.type === "lost" ? "Missing" : "Found"}
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageContainer: {
    width: "100%",
    height: 300,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  type: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  location: {
    fontSize: 18,
    marginBottom: 16,
    opacity: 0.8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  metaContainer: {
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 16,
    marginTop: "auto",
  },
  metaText: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
});

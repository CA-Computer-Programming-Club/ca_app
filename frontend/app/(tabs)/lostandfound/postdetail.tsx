import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { SERVER_URL } from "@/config";
import { Stack, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Pressable, View } from "react-native";

interface Post {
  id: string | number;
  type: string;
  title: string;
  location: string;
  description: string;
  image_filename: string | null;
  created_at: string;
  is_resolved: boolean;
}

export default function PostDetailScreen() {
  const colorScheme = useColorScheme();
  const { post } = useLocalSearchParams();
  const [postData, setPostData] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPostDetail();
  }, [post]);

  const fetchPostDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      // First, try to get the specific post from all items
      // TODO Fetch by ID directly from the backend instead of fetching all items and filtering on the client side
      const response = await fetch(`${SERVER_URL}/get_all_items`);

      if (!response.ok) {
        throw new Error(`Failed to fetch items: ${response.status}`);
      }

      const allItems: Post[] = await response.json();

      // Find the specific post by ID
      const foundPost = allItems.find(
        (item) => item.id.toString() === (post as string),
      );

      if (foundPost) {
        setPostData(foundPost);
      } else {
        setError("Post not found");
      }
    } catch (err) {
      console.error("Error fetching post detail:", err);
      setError("Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  const markResolved = (id: string) => {
    // TODO: Implement the API call to mark the post as resolved
    fetch(`${SERVER_URL}/mark_resolved/${id}`, {
      method: "POST",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to mark post as resolved: ${response.status}`,
          );
        }
        return response.json();
      })
      .then(() => {
        // Update the UI to reflect the resolved status
        setPostData((prevData) => ({
          ...prevData!,
          is_resolved: true,
        }));
      })
      .catch((error) => {
        console.error("Error marking post as resolved:", error);
      });
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen
          options={{
            title: "Loading...",
            headerBackTitle: "Back",
          }}
        />
        <View style={styles.centerContent}>
          <ThemedText>Loading post...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (error || !postData) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen
          options={{
            title: "Error",
            headerBackTitle: "Back",
          }}
        />
        <View style={styles.centerContent}>
          <ThemedText style={styles.errorText}>
            {error || "Post not found"}
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: postData.title,
          headerBackTitle: "Back",
        }}
      />

      <View style={styles.scrollWrapper}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {postData.image_filename && (
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: `${SERVER_URL}/uploads/${postData.image_filename}`,
                }}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          )}

          <View style={styles.contentContainer}>
            <ThemedText type="title" style={styles.title}>
              {postData.title}
            </ThemedText>

            <ThemedText
              style={[
                styles.type,
                { color: postData.type === "lost" ? "#c0392b" : "#27ae60" },
              ]}
            >
              {postData.type.toUpperCase()}
            </ThemedText>

            <ThemedText style={styles.location}>
              {postData.type === "lost"
                ? "Last Seen: 📍 " + postData.location
                : "📍 " + postData.location}
            </ThemedText>

            <ThemedText style={styles.description}>
              {postData.description}
            </ThemedText>
          </View>
        </ScrollView>

        <LinearGradient
          colors={
            colorScheme === "dark"
              ? ["rgba(21,23,24,0)", "rgba(21,23,24,0.9)", "#151718"]
              : ["rgba(255,255,255,0)", "rgba(255,255,255,0.9)", "#fff"]
          }
          locations={[0, 0.5, 1]}
          style={styles.gradientOverlay}
          pointerEvents="none"
        />
      </View>

      <View style={styles.metaContainer}>
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={() => postData.id && markResolved(postData.id.toString())}
            style={styles.foundButton}
          >
            <ThemedText style={styles.buttonText}>Mark as Resolved</ThemedText>
          </Pressable>
        </View>

        <ThemedText style={styles.metaText}>Item ID: #{postData.id}</ThemedText>
        <ThemedText style={styles.metaText}>
          Status: {postData.type === "lost" ? "Missing" : "Found"}
        </ThemedText>
        <ThemedText style={styles.metaText}>
          Posted: {new Date(postData.created_at).toLocaleString()}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollWrapper: {
    flex: 1,
    position: "relative",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 30, // Height of the gradient fade
  },
  imageContainer: {
    width: "100%",
    height: 300,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  contentContainer: {
    padding: 20,
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
  buttonContainer: {
    paddingBottom: 16,
  },
  foundButton: {
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "#13694E",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  metaContainer: {
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  metaText: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#c0392b",
    textAlign: "center",
    fontSize: 16,
  },
});

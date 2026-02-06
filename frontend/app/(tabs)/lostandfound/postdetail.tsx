import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { SERVER_URL } from "@/config";
import { useNavigationState } from "@react-navigation/native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

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
  const state = useNavigationState((s) => s);
  console.log(
    "STACK:",
    state.routes.map((r) => r.name),
  );
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
        throw new Error(`Failed to mark post as resolved: ${response.status}`);
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
}


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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
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

          <View style={styles.metaContainer}>
            <ThemedText style={styles.metaText}>
              Item ID: #{postData.id}
            </ThemedText>
            <ThemedText style={styles.metaText}>
              Status: {postData.type === "lost" ? "Missing" : "Found"}
            </ThemedText>
            <ThemedText style={styles.metaText}>
              Posted: {new Date(postData.created_at).toLocaleString()}
            </ThemedText>

            <TouchableOpacity
                    // onPress={() => onChange("lost")}
                    style={[
                      { backgroundColor: "#27ae60" },
                      { marginLeft: 10 },
                      { right: 1},
                      { width: 150  },
                      { height: 80  },
                      { alignItems: "flex-end"  },
                      { alignSelf: "flex-end" },
                      { padding: 10  },
                      { borderRadius: 5  },
                    ]}
                  >
                    MARK AS FOUND
                  </TouchableOpacity>
                  
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
    borderRadius: 8, // Added border radius here
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

import { useEffect, useState } from "react";
import {
  View,
  Platform,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import GoogleIcon from "@/assets/images/google-logo.png";

WebBrowser.maybeCompleteAuthSession();

if (Platform.OS !== "web") {
  GoogleSignin.configure({
    webClientId:
      "131708705239-02b01cemnlljld61bp6vgmmstf7c96ov.apps.googleusercontent.com",
    clientId:
      "131708705239-02b01cemnlljld61bp6vgmmstf7c96ov.apps.googleusercontent.com",
    iosClientId: "TODO",
    offlineAccess: true, // Get refresh token
  });
}

export default function LoginScreen() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // Web authentication
  const [request, response, promptAsync] =
    Platform.OS === "web"
      ? Google.useAuthRequest({
          webClientId:
            "131708705239-02b01cemnlljld61bp6vgmmstf7c96ov.apps.googleusercontent.com",
          scopes: ["profile", "email"],
        })
      : [null, null, null];

  // Handle web authentication response
  useEffect(() => {
    const handleWebAuth = async () => {
      if (Platform.OS === "web" && response?.type === "success") {
        const { accessToken } = response.authentication;
        console.log("WEB access token:", accessToken);
        await fetchUserInfoWeb(accessToken);
      }
    };
    handleWebAuth();
  }, [response]);

  // Fetch user info for web
  const fetchUserInfoWeb = async (accessToken) => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      const user = await response.json();
      const hiResPhoto = user.picture
        ? user.picture.replace(/=s\d+-c/, "=s512-c")
        : null;
      console.log("WEB user info:", hiResPhoto);

      setUserInfo({
        id: user.sub,
        name: user.name,
        email: user.email,
        photo: hiResPhoto,
      });
    } catch (error) {
      console.error("Error fetching user info:", error);
    } finally {
      setLoading(false);
    }
  };

  // Native login
  const nativeLogin = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
      console.log("NATIVE user info:", user);
      const hiResPhoto =
        user.data.user.photo.replace(/=s\d+-c/, "=s512-c") || null;

      setUserInfo({
        id: user.data.user.id,
        name: user.data.user.name,
        email: user.data.user.email,
        photo: hiResPhoto,
      });
    } catch (error) {
      console.error("Native login error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      if (Platform.OS === "web") {
        // For web, just clear local state
        setUserInfo(null);
      } else {
        // For native, sign out properly
        await GoogleSignin.signOut();
        setUserInfo(null);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Custom Google Sign-In Button
  const GoogleSignInButton = ({ onPress, disabled }) => (
    <TouchableOpacity
      style={[styles.googleButton, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <View style={styles.buttonContent}>
        <Image source={GoogleIcon} style={styles.googleIcon} />
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </View>
    </TouchableOpacity>
  );

  // Profile View Component
  const ProfileView = ({ user, onLogout }) => (
    <View style={styles.profileContainer}>
      <Image
        source={{ uri: user.photo }}
        style={styles.profileImage}
        onError={(e) =>
          console.log("Failed to load image", e.nativeEvent.error)
        }
      />
      <Text style={styles.userName}>{user.name}</Text>
      <Text style={styles.userEmail}>{user.email}</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  // Loading State
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {userInfo ? (
        <ProfileView user={userInfo} onLogout={logout} />
      ) : (
        <View style={styles.loginContainer}>
          <Text style={styles.title}>Welcome!</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
          {Platform.OS === "web" ? (
            <GoogleSignInButton
              onPress={() => promptAsync()}
              disabled={!request}
            />
          ) : (
            <GoogleSignInButton onPress={nativeLogin} />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  loginContainer: {
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
  },
  googleButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: "100%",
    maxWidth: 300,
  },
  disabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleButtonText: {
    color: "#444",
    fontSize: 16,
    fontWeight: "600",
  },
  profileContainer: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: "100%",
    maxWidth: 350,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#4285F4",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
    textAlign: "center",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    minWidth: 120,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
});

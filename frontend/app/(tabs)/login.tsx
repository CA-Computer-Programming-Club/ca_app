import { Button, View, Platform } from "react-native";
import { useEffect } from "react";

/* ---------- WEB AUTH ---------- */
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

/* ---------- NATIVE AUTH ---------- */
import { GoogleSignin } from "@react-native-google-signin/google-signin";

WebBrowser.maybeCompleteAuthSession();

/* ---------- CONFIG (ONCE) ---------- */
if (Platform.OS !== "web") {
  GoogleSignin.configure({
    webClientId:
      "131708705239-02b01cemnlljld61bp6vgmmstf7c96ov.apps.googleusercontent.com",
  });
}

export default function LoginScreen() {
  /* ===== WEB ===== */
  const [request, response, promptAsync] =
    Platform.OS === "web"
      ? Google.useAuthRequest({
          webClientId:
            "131708705239-02b01cemnlljld61bp6vgmmstf7c96ov.apps.googleusercontent.com",
        })
      : [null, null, null];

  /* ===== WEB RESULT ===== */
  useEffect(() => {
    if (Platform.OS === "web" && response?.type === "success") {
      console.log("WEB response:", response);
      const { accessToken } = response.authentication;
      console.log("WEB access token:", accessToken);
    } else if (Platform.OS === "web") {
      console.log("WEB auth failed or cancelled");
    }
  }, [response]);

  /* ===== NATIVE LOGIN ===== */
  const nativeLogin = async () => {
    try {
      const userInfo = await GoogleSignin.signIn();
      console.log("NATIVE user:", userInfo.data.user);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      {Platform.OS === "web" ? (
        <Button
          title="Sign in with Google"
          disabled={!request}
          onPress={() => promptAsync()}
        />
      ) : (
        <Button title="Sign in with Google" onPress={nativeLogin} />
      )}
    </View>
  );
}

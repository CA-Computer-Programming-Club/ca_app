import Constants from "expo-constants";

function getDevServerHost() {
  try {
    // Works in older Expo Go
    const manifestHost = Constants.manifest?.debuggerHost?.split(":")[0];
    if (manifestHost) return manifestHost;

    // Works in newer Expo Go / SDK 50+
    const manifest2Host = Constants.manifest2?.extra?.expoGo?.developer?.host;
    if (manifest2Host) return manifest2Host.split(":")[0];

    // Fallback for web: use window.location.hostname
    if (typeof window !== "undefined") {
      return window.location.hostname;
    }

    // Final fallback
    return "localhost";
  } catch {
    return "localhost";
  }
}

function getServerUrl() {
  const host = getDevServerHost();

  if (__DEV__) {
    // return "https://tholos.site/server";
    return `http://${host}:8000`;
  } else {
    return "https://tholos.site/server";
  }
}

export const SERVER_URL = getServerUrl();

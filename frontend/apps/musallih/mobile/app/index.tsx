import { Redirect } from "expo-router";
import { Text } from "react-native";
import { useMobileAuth } from "../src/auth/AuthProvider";

export default function RootIndex() {
  const { status } = useMobileAuth();
  if (status === "loading") {
    return <Text style={{ padding: 16, color: "#a1a1aa" }}>Restoring session...</Text>;
  }
  return <Redirect href={status === "authenticated" ? "/(tabs)/map" : "/(auth)"} />;
}

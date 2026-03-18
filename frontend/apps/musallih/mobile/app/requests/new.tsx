import { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";
import { theme } from "../../src/theme/theme";

export default function CreateRequestScreen() {
  const [draft, setDraft] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("mobile_request_draft").then((stored) => {
      if (stored) {
        setDraft(stored);
      }
    });
  }, []);

  useEffect(() => {
    void AsyncStorage.setItem("mobile_request_draft", draft);
  }, [draft]);

  return (
    <ScreenScaffold
      title="Create Request"
      description="Submit a structured service request with attachments."
    >
      <View style={{ gap: theme.spacing.sm }}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Draft your request details..."
          placeholderTextColor={theme.colors.mutedForeground}
          multiline
          style={{
            minHeight: 140,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.md,
            backgroundColor: theme.colors.card,
            color: theme.colors.foreground,
            padding: theme.spacing.md,
            textAlignVertical: "top",
            fontFamily: theme.fonts.sans,
          }}
        />
        <Text style={{ color: theme.colors.mutedForeground, fontFamily: theme.fonts.sans }}>
          Draft is persisted locally for offline recovery.
        </Text>
      </View>
    </ScreenScaffold>
  );
}

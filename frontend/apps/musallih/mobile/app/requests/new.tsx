import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";
import { theme } from "../../src/theme/theme";
import { SectionCard } from "../../src/components/AppUI";

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
      <SectionCard
        title="Request draft"
        subtitle="Saved locally, so you can continue later."
      >
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Draft your request details..."
          placeholderTextColor={theme.colors.mutedForeground}
          multiline
          style={styles.input}
          accessibilityLabel="Request draft details"
        />
        <Text style={styles.note}>
          Draft is persisted locally for offline recovery.
        </Text>
      </SectionCard>
    </ScreenScaffold>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 180,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.background,
    color: theme.colors.foreground,
    padding: theme.spacing.md,
    textAlignVertical: "top",
    fontFamily: theme.fonts.sans,
  },
  note: {
    color: theme.colors.mutedForeground,
    fontFamily: theme.fonts.sans,
    fontSize: 12,
  },
});

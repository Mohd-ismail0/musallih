import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";
import { theme } from "../../src/theme/theme";
import { SectionCard } from "../../src/components/AppUI";
import { Button } from "../../src/components/Button";
import { createConsumerApi } from "@musallih/api-client";
import { API_BASE_URL } from "../../src/config/api";
import { useMobileAuth } from "../../src/auth/AuthProvider";

export default function CreateRequestScreen() {
  const { accessToken } = useMobileAuth();
  const api = createConsumerApi({
    baseUrl: API_BASE_URL,
    getToken: async () => accessToken,
  });
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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

  const submit = async () => {
    try {
      setBusy(true);
      setError(null);
      const request = await api.createRequest({
        description: draft,
        serviceType: "General",
      });
      await AsyncStorage.removeItem("mobile_request_draft");
      router.replace(`/requests/${request.id}`);
    } catch {
      setError("Unable to submit request right now.");
    } finally {
      setBusy(false);
    }
  };

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
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button
          title={busy ? "Submitting..." : "Submit Request"}
          onPress={submit}
          disabled={!draft.trim() || busy}
        />
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
  error: {
    color: theme.colors.destructive,
    fontFamily: theme.fonts.sans,
    fontSize: 12,
  },
});

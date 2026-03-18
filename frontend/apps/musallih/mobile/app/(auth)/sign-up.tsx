import { Text } from "react-native";
import { ScreenScaffold } from "../../src/components/ScreenScaffold";
import { theme } from "../../src/theme/theme";

export default function SignUpScreen() {
  return (
    <ScreenScaffold title="Sign Up" description="Create account flow scaffold.">
      <Text style={{ color: theme.colors.mutedForeground, fontFamily: theme.fonts.sans }}>
        Sign up implementation can reuse Firebase email/password or provider-based auth.
      </Text>
    </ScreenScaffold>
  );
}

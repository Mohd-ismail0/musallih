import AuthTabsCard from "@/components/ui/auth-tabs-card";

export default function DemoOne() {
  return <AuthTabsCard
    onSignInWithEmail={async () => {}}
    onSignUpWithEmail={async () => {}}
    onSignInWithGoogle={async () => {}}
    onSignInWithApple={async () => {}}
    onStartPhoneAuth={async () => {}}
    onVerifyPhoneOtp={async () => {}}
  />;
}

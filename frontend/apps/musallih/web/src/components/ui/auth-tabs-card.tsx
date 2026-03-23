import * as React from "react";
import { FaApple, FaGoogle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface AuthTabsCardProps {
  loading?: boolean;
  error?: string | null;
  onSignInWithEmail: (email: string, password: string) => Promise<void>;
  onSignUpWithEmail: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  onSignInWithGoogle: () => Promise<void>;
  onSignInWithApple: () => Promise<void>;
  onStartPhoneAuth: (phoneNumber: string) => Promise<void>;
  onVerifyPhoneOtp: (otpCode: string) => Promise<void>;
}

export default function AuthTabsCard({
  loading = false,
  error = null,
  onSignInWithEmail,
  onSignUpWithEmail,
  onSignInWithGoogle,
  onSignInWithApple,
  onStartPhoneAuth,
  onVerifyPhoneOtp,
}: AuthTabsCardProps) {
  const [activeTab, setActiveTab] = React.useState<"sign-in" | "sign-up">(
    "sign-in"
  );
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [otpRequested, setOtpRequested] = React.useState(false);

  const toggleTab = () => {
    setActiveTab((prev) => (prev === "sign-in" ? "sign-up" : "sign-in"));
  };

  const handlePhoneStart = async () => {
    await onStartPhoneAuth(phone);
    setOtpRequested(true);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-border/70 bg-card/95 p-8 shadow-2xl backdrop-blur-sm">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "sign-in" | "sign-up")}
          className="w-full"
        >
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="sign-in">Sign In</TabsTrigger>
            <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="sign-in">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                  disabled={loading}
                  onClick={() => void onSignInWithGoogle()}
                >
                  <FaGoogle /> Continue with Google
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                  disabled={loading}
                  onClick={() => void onSignInWithApple()}
                >
                  <FaApple /> Continue with Apple
                </Button>
              </div>

              <div className="my-2 flex items-center justify-center text-sm text-muted-foreground">
                or
              </div>

              <div>
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="you@example.com"
                  className="mt-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="********"
                  className="mt-1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button
                className="mt-2 w-full"
                disabled={loading}
                onClick={() => void onSignInWithEmail(email, password)}
              >
                Sign In
              </Button>

              <div className="rounded-lg border border-border/60 bg-background/40 p-3">
                <p className="mb-2 text-sm font-medium">Phone OTP</p>
                <div className="space-y-2">
                  <Input
                    type="tel"
                    placeholder="+60123456789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  {otpRequested ? (
                    <>
                      <Input
                        type="text"
                        placeholder="6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                      <Button
                        className="w-full"
                        variant="outline"
                        disabled={loading}
                        onClick={() => void onVerifyPhoneOtp(otp)}
                      >
                        Verify OTP
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="w-full"
                      variant="outline"
                      disabled={loading}
                      onClick={() => void handlePhoneStart()}
                    >
                      Send OTP
                    </Button>
                  )}
                </div>
              </div>

              <p className="mt-2 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="font-medium text-primary hover:underline"
                  onClick={toggleTab}
                >
                  Sign Up
                </button>
              </p>
            </div>
          </TabsContent>

          <TabsContent value="sign-up">
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="signup-name">Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Your Name"
                  className="mt-1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  className="mt-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="********"
                  className="mt-1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button
                className="mt-2 w-full"
                disabled={loading}
                onClick={() => void onSignUpWithEmail(name, email, password)}
              >
                Sign Up
              </Button>

              <div className="my-2 flex items-center justify-center text-sm text-muted-foreground">
                or continue with
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={loading}
                  onClick={() => void onSignInWithGoogle()}
                >
                  <FaGoogle className="mr-2" /> Google
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={loading}
                  onClick={() => void onSignInWithApple()}
                >
                  <FaApple className="mr-2" /> Apple
                </Button>
              </div>

              <p className="mt-2 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  className="font-medium text-primary hover:underline"
                  onClick={toggleTab}
                >
                  Sign In
                </button>
              </p>
            </div>
          </TabsContent>
        </Tabs>
        {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
      </div>
    </div>
  );
}

import * as React from "react";
import { FaApple, FaGoogle } from "react-icons/fa";
import { PhoneInput } from "react-international-phone";
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
  const [identifier, setIdentifier] = React.useState("");
  const [phoneValue, setPhoneValue] = React.useState("");
  const [signUpPhoneValue, setSignUpPhoneValue] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [otpRequested, setOtpRequested] = React.useState(false);
  const [signInMethodOpen, setSignInMethodOpen] = React.useState<
    "email" | "phone" | null
  >(null);
  const [signUpMethodOpen, setSignUpMethodOpen] = React.useState<
    "email" | "phone" | null
  >(null);

  const toggleTab = () => {
    setActiveTab((prev) => (prev === "sign-in" ? "sign-up" : "sign-in"));
    setOtpRequested(false);
    setOtp("");
    setIdentifier("");
    setPassword("");
  };

  const handlePhoneStart = async () => {
    const phone = activeTab === "sign-in" ? phoneValue : signUpPhoneValue;
    await onStartPhoneAuth(phone.trim());
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
                <div className="space-y-2">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-left text-sm font-medium hover:bg-background/60"
                    onClick={() =>
                      setSignInMethodOpen((prev) =>
                        prev === "email" ? null : "email"
                      )
                    }
                  >
                    Email + Password
                    <span className="text-muted-foreground">
                      {signInMethodOpen === "email" ? "−" : "+"}
                    </span>
                  </button>
                  {signInMethodOpen === "email" ? (
                    <div className="rounded-lg border border-border/60 bg-background/40 p-3">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="you@example.com"
                        className="mt-1"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                      />
                      <div className="mt-3">
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
                        className="mt-3 w-full"
                        disabled={loading}
                        onClick={() =>
                          void onSignInWithEmail(identifier.trim(), password)
                        }
                      >
                        Sign In
                      </Button>
                    </div>
                  ) : null}

                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-left text-sm font-medium hover:bg-background/60"
                    onClick={() => {
                      setSignInMethodOpen((prev) =>
                        prev === "phone" ? null : "phone"
                      );
                      setOtpRequested(false);
                      setOtp("");
                    }}
                  >
                    Phone + OTP
                    <span className="text-muted-foreground">
                      {signInMethodOpen === "phone" ? "−" : "+"}
                    </span>
                  </button>
                  {signInMethodOpen === "phone" ? (
                    <div className="rounded-lg border border-border/60 bg-background/40 p-3">
                      <Label htmlFor="signin-phone">Phone</Label>
                      <div className="mt-1 rounded-lg border border-input bg-background px-1 py-1">
                        <PhoneInput
                          defaultCountry="my"
                          value={phoneValue}
                          onChange={setPhoneValue}
                          inputClassName="!w-full !border-0 !bg-transparent !text-sm !text-foreground !shadow-none focus:!ring-0"
                          countrySelectorStyleProps={{
                            buttonClassName:
                              "!border-0 !bg-transparent hover:!bg-accent/60 rounded-md",
                            dropdownStyleProps: {
                              className:
                                "!bg-popover !border !border-border !text-foreground !shadow-lg",
                            },
                          }}
                        />
                      </div>
                      <div className="mt-3 space-y-2">
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
                  ) : null}
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
                <div className="space-y-2">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-left text-sm font-medium hover:bg-background/60"
                    onClick={() =>
                      setSignUpMethodOpen((prev) =>
                        prev === "email" ? null : "email"
                      )
                    }
                  >
                    Email + Password
                    <span className="text-muted-foreground">
                      {signUpMethodOpen === "email" ? "−" : "+"}
                    </span>
                  </button>
                  {signUpMethodOpen === "email" ? (
                    <div className="rounded-lg border border-border/60 bg-background/40 p-3">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        className="mt-1"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                      />
                      <div className="mt-3">
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
                        className="mt-3 w-full"
                        disabled={loading}
                        onClick={() =>
                          void onSignUpWithEmail(name, identifier.trim(), password)
                        }
                      >
                        Sign Up
                      </Button>
                    </div>
                  ) : null}

                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-left text-sm font-medium hover:bg-background/60"
                    onClick={() => {
                      setSignUpMethodOpen((prev) =>
                        prev === "phone" ? null : "phone"
                      );
                      setOtpRequested(false);
                      setOtp("");
                    }}
                  >
                    Phone + OTP
                    <span className="text-muted-foreground">
                      {signUpMethodOpen === "phone" ? "−" : "+"}
                    </span>
                  </button>
                  {signUpMethodOpen === "phone" ? (
                    <div className="rounded-lg border border-border/60 bg-background/40 p-3">
                      <Label htmlFor="signup-phone">Phone</Label>
                      <div className="mt-1 rounded-lg border border-input bg-background px-1 py-1">
                        <PhoneInput
                          defaultCountry="my"
                          value={signUpPhoneValue}
                          onChange={setSignUpPhoneValue}
                          inputClassName="!w-full !border-0 !bg-transparent !text-sm !text-foreground !shadow-none focus:!ring-0"
                          countrySelectorStyleProps={{
                            buttonClassName:
                              "!border-0 !bg-transparent hover:!bg-accent/60 rounded-md",
                            dropdownStyleProps: {
                              className:
                                "!bg-popover !border !border-border !text-foreground !shadow-lg",
                            },
                          }}
                        />
                      </div>
                      <div className="mt-3 space-y-2">
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
                  ) : null}
                </div>
              </div>

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

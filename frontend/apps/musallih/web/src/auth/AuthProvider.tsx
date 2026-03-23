import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  OAuthProvider,
  RecaptchaVerifier,
  signInWithPopup,
  signInWithPhoneNumber,
  type ConfirmationResult,
  linkWithPopup,
  EmailAuthProvider,
  linkWithCredential,
  linkWithPhoneNumber,
  type User,
} from "firebase/auth";
import { exchangeFirebaseToken } from "@musallih/api-client";
import { webFirebaseAuth } from "./firebase";
import { API_BASE_URL } from "@/config/api";

type AuthStatus = "loading" | "authenticated" | "signed_out";

interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  accessToken: string | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  startPhoneSignIn: (phoneNumber: string, recaptchaContainerId: string) => Promise<void>;
  verifyPhoneOtp: (otpCode: string) => Promise<void>;
  getLinkedProviders: () => string[];
  linkGoogle: () => Promise<void>;
  linkApple: () => Promise<void>;
  linkEmailPassword: (email: string, password: string) => Promise<void>;
  linkPhoneNumber: (
    phoneNumber: string,
    recaptchaContainerId: string,
    otpCode?: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
}

const TOKEN_KEY = "musallih_access_token";
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem(TOKEN_KEY)
  );
  const [phoneSignInConfirmation, setPhoneSignInConfirmation] =
    useState<ConfirmationResult | null>(null);
  const [phoneLinkConfirmation, setPhoneLinkConfirmation] =
    useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

  const exchangeToken = useCallback(async (firebaseUser: User) => {
    const idToken = await firebaseUser.getIdToken();
    const exchanged = await exchangeFirebaseToken(idToken, API_BASE_URL);
    setAccessToken(exchanged.access_token);
    localStorage.setItem(TOKEN_KEY, exchanged.access_token);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(webFirebaseAuth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setStatus("signed_out");
        setAccessToken(null);
        localStorage.removeItem(TOKEN_KEY);
        return;
      }

      try {
        await exchangeToken(firebaseUser);
        setStatus("authenticated");
      } catch (error) {
        console.error("Token exchange failed", error);
        setStatus("signed_out");
      }
    });

    return () => unsubscribe();
  }, [exchangeToken]);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(webFirebaseAuth, email, password);
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string) => {
    await createUserWithEmailAndPassword(webFirebaseAuth, email, password);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await signInWithPopup(webFirebaseAuth, new GoogleAuthProvider());
  }, []);

  const signInWithApple = useCallback(async () => {
    const provider = new OAuthProvider("apple.com");
    await signInWithPopup(webFirebaseAuth, provider);
  }, []);

  const getOrCreateRecaptcha = useCallback(
    (containerId: string) => {
      if (recaptchaVerifier) return recaptchaVerifier;
      const verifier = new RecaptchaVerifier(webFirebaseAuth, containerId, {
        size: "invisible",
      });
      setRecaptchaVerifier(verifier);
      return verifier;
    },
    [recaptchaVerifier]
  );

  const startPhoneSignIn = useCallback(
    async (phoneNumber: string, recaptchaContainerId: string) => {
      const verifier = getOrCreateRecaptcha(recaptchaContainerId);
      const confirmation = await signInWithPhoneNumber(webFirebaseAuth, phoneNumber, verifier);
      setPhoneSignInConfirmation(confirmation);
    },
    [getOrCreateRecaptcha]
  );

  const verifyPhoneOtp = useCallback(
    async (otpCode: string) => {
      if (!phoneSignInConfirmation) {
        throw new Error("Phone verification has not been started.");
      }
      await phoneSignInConfirmation.confirm(otpCode);
      setPhoneSignInConfirmation(null);
    },
    [phoneSignInConfirmation]
  );

  const getLinkedProviders = useCallback(() => {
    return user?.providerData.map((provider) => provider.providerId) ?? [];
  }, [user]);

  const linkGoogle = useCallback(async () => {
    if (!webFirebaseAuth.currentUser) throw new Error("No active user session.");
    await linkWithPopup(webFirebaseAuth.currentUser, new GoogleAuthProvider());
  }, []);

  const linkApple = useCallback(async () => {
    if (!webFirebaseAuth.currentUser) throw new Error("No active user session.");
    await linkWithPopup(webFirebaseAuth.currentUser, new OAuthProvider("apple.com"));
  }, []);

  const linkEmailPassword = useCallback(async (email: string, password: string) => {
    if (!webFirebaseAuth.currentUser) throw new Error("No active user session.");
    const credential = EmailAuthProvider.credential(email, password);
    await linkWithCredential(webFirebaseAuth.currentUser, credential);
  }, []);

  const linkPhoneNumber = useCallback(
    async (phoneNumber: string, recaptchaContainerId: string, otpCode?: string) => {
      if (!webFirebaseAuth.currentUser) throw new Error("No active user session.");
      if (!otpCode) {
        const verifier = getOrCreateRecaptcha(recaptchaContainerId);
        const confirmation = await linkWithPhoneNumber(
          webFirebaseAuth.currentUser,
          phoneNumber,
          verifier
        );
        setPhoneLinkConfirmation(confirmation);
        return;
      }
      if (!phoneLinkConfirmation) {
        throw new Error("Phone link verification has not been started.");
      }
      await phoneLinkConfirmation.confirm(otpCode);
      setPhoneLinkConfirmation(null);
    },
    [getOrCreateRecaptcha, phoneLinkConfirmation]
  );

  const signOut = useCallback(async () => {
    await firebaseSignOut(webFirebaseAuth);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      accessToken,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signInWithApple,
      startPhoneSignIn,
      verifyPhoneOtp,
      getLinkedProviders,
      linkGoogle,
      linkApple,
      linkEmailPassword,
      linkPhoneNumber,
      signOut,
    }),
    [
      status,
      user,
      accessToken,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signInWithApple,
      startPhoneSignIn,
      verifyPhoneOtp,
      getLinkedProviders,
      linkGoogle,
      linkApple,
      linkEmailPassword,
      linkPhoneNumber,
      signOut,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

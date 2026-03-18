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
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { exchangeFirebaseToken } from "@musallih/api-client";
import { API_BASE_URL } from "../config/api";
import { mobileFirebaseAuth } from "./firebase";

type AuthStatus = "loading" | "authenticated" | "signed_out";

interface MobileAuthContextValue {
  status: AuthStatus;
  user: User | null;
  accessToken: string | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const TOKEN_KEY = "musallih_mobile_access_token";
const MobileAuthContext = createContext<MobileAuthContextValue | null>(null);

export function MobileAuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const exchangeToken = useCallback(async (firebaseUser: User) => {
    const idToken = await firebaseUser.getIdToken();
    const exchanged = await exchangeFirebaseToken(idToken, API_BASE_URL);
    await AsyncStorage.setItem(TOKEN_KEY, exchanged.access_token);
    setAccessToken(exchanged.access_token);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(mobileFirebaseAuth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setStatus("signed_out");
        setAccessToken(null);
        await AsyncStorage.removeItem(TOKEN_KEY);
        return;
      }

      try {
        await exchangeToken(firebaseUser);
        setStatus("authenticated");
      } catch (error) {
        console.error("Mobile token exchange failed", error);
        setStatus("signed_out");
      }
    });

    return () => unsubscribe();
  }, [exchangeToken]);

  useEffect(() => {
    AsyncStorage.getItem(TOKEN_KEY).then((stored) => {
      if (stored) {
        setAccessToken(stored);
      }
    });
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(mobileFirebaseAuth, email, password);
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(mobileFirebaseAuth);
  }, []);

  const value = useMemo<MobileAuthContextValue>(
    () => ({
      status,
      user,
      accessToken,
      signInWithEmail,
      signOut,
    }),
    [status, user, accessToken, signInWithEmail, signOut]
  );

  return <MobileAuthContext.Provider value={value}>{children}</MobileAuthContext.Provider>;
}

export function useMobileAuth() {
  const context = useContext(MobileAuthContext);
  if (!context) {
    throw new Error("useMobileAuth must be used within MobileAuthProvider");
  }
  return context;
}

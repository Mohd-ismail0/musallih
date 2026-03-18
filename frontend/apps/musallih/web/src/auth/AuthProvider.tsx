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
import { exchangeFirebaseToken } from "@musallih/api-client";
import { webFirebaseAuth } from "./firebase";
import { API_BASE_URL } from "@/config/api";

type AuthStatus = "loading" | "authenticated" | "signed_out";

interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  accessToken: string | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
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

  const signOut = useCallback(async () => {
    await firebaseSignOut(webFirebaseAuth);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      accessToken,
      signInWithEmail,
      signOut,
    }),
    [status, user, accessToken, signInWithEmail, signOut]
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

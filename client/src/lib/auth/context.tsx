import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { signIn, signOut } from "@/lib/auth/api";

import { AppSession, AuthContextType, AuthStatus } from "./types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  initialSession: AppSession | null;
}

export function AuthProvider({ children, initialSession }: AuthProviderProps) {
  const [session, setSession] = useState<AppSession | null>(initialSession);
  const [status, setStatus] = useState<AuthStatus>(AuthStatus.LOADING);
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetSession = useCallback((callback?: () => void) => {
    setSession(null);
    setStatus(AuthStatus.UNAUTHENTICATED);
    callback?.();
  }, []);

  useEffect(() => {
    if (initialSession) {
      setStatus(AuthStatus.AUTHENTICATED);
    } else {
      setStatus(AuthStatus.UNAUTHENTICATED);
    }
  }, [initialSession]);

  useEffect(() => {
    // Check if we were redirected due to session expiry
    if (searchParams.get("expired") === "true") {
      resetSession();
    }
  }, [searchParams, resetSession]);

  const login = async (email: string, password: string) => {
    const newSession = await signIn(email, password);
    setSession(newSession);
    setStatus(AuthStatus.AUTHENTICATED);
  };

  const logout = async () => {
    await signOut();
    resetSession(() => router.push("/auth/signin"));
  };

  return (
    <AuthContext.Provider value={{ session, status, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  signIn as cognitoSignIn,
  signUp as cognitoSignUp,
  signOut as cognitoSignOut,
  confirmSignUp as cognitoConfirmSignUp,
  getCurrentUser,
  getIdToken,
  type AuthUser,
  type SignInParams,
  type SignUpParams,
} from "./cognito";
import { apiClient } from "../api/client";

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  signIn: (params: SignInParams) => Promise<void>;
  signUp: (params: SignUpParams) => Promise<{ userConfirmed: boolean }>;
  signOut: () => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const refreshUser = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      const token = await getIdToken();

      if (token) {
        apiClient.setAuthToken(token);
      }

      setState({
        user,
        isLoading: false,
        isAuthenticated: !!user,
      });
    } catch {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      apiClient.setAuthToken(null);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const signIn = useCallback(async (params: SignInParams) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      await cognitoSignIn(params);
      await refreshUser();
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [refreshUser]);

  const signUp = useCallback(async (params: SignUpParams) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const result = await cognitoSignUp(params);
      setState((prev) => ({ ...prev, isLoading: false }));
      return { userConfirmed: result.userConfirmed };
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const confirmSignUp = useCallback(async (email: string, code: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      await cognitoConfirmSignUp(email, code);
      setState((prev) => ({ ...prev, isLoading: false }));
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    await cognitoSignOut();
    apiClient.setAuthToken(null);
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  const value: AuthContextValue = {
    ...state,
    signIn,
    signUp,
    signOut,
    confirmSignUp,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

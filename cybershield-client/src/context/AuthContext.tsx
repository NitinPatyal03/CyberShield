import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";
import { getProfile } from "../services/profileService";
import type { Profile } from "../types/profile";

interface AuthContextType {
  token: string | null;
  user: Profile | null;
  loading: boolean;

  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;

  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const profile = await getProfile();
      setUser(profile);
    } catch (err) {
      console.error(err);
      setUser(null);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      setLoading(false);
      return;
    }

    setToken(storedToken);

    refreshUser()
      .finally(() => setLoading(false));
  }, []);

  const login = async (jwt: string) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);

    await refreshUser();
  };

  const logout = () => {
    localStorage.removeItem("token");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        logout,
        refreshUser,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
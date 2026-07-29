import { useEffect, useMemo, useState } from "react";
import { getCurrentUser, login as loginRequest, signup as signupRequest } from "../services/authService";
import { AuthContext } from "./authContextCore";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("hm_token"));
  const [isLoading, setIsLoading] = useState(Boolean(token));

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await getCurrentUser();
        if (isMounted) {
          setUser(data.user);
        }
      } catch {
        localStorage.removeItem("hm_token");
        if (isMounted) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [token]);

  async function login(credentials) {
    const data = await loginRequest(credentials);
    localStorage.setItem("hm_token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  async function signup(payload) {
    const data = await signupRequest(payload);
    localStorage.setItem("hm_token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem("hm_token");
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, token, isAuthenticated: Boolean(user), isLoading, login, signup, logout }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

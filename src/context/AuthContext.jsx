import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!localStorage.getItem("staywell_token")) { setLoading(false); return; }
    api("/auth/me").then(({ user: currentUser }) => setUser(currentUser)).catch(() => localStorage.removeItem("staywell_token")).finally(() => setLoading(false));
  }, []);
  const authenticate = async (path, payload) => {
    const result = await api(path, { method: "POST", body: JSON.stringify(payload) });
    localStorage.setItem("staywell_token", result.token);
    setUser(result.user);
    return result.user;
  };
  const logout = () => { localStorage.removeItem("staywell_token"); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, login: (data) => authenticate("/auth/login", data), register: (data) => authenticate("/auth/register", data), logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);

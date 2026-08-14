import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/users/me")
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

    const login = async (username, password) => {
    const formData = new URLSearchParams();

    formData.append("username", username);
    formData.append("password", password);

    const response = await api.post(
        "/users/login",
        formData,
        {
        headers: {
            "Content-Type":
            "application/x-www-form-urlencoded",
        },
        }
    );

    localStorage.setItem(
        "token",
        response.data.access_token
    );

    const profile = await api.get("/users/me");

    setUser(profile.data);

    return profile.data;
    };

    const register = async (userData) => {
  try {
    console.log("📤 Sending registration data:", userData);

    const response = await api.post("/users/register", userData);

    console.log("✅ Registration status:", response.status);
    console.log("✅ Registration response:", response.data);

    return response.data;
  } catch (error) {
    console.error("❌ REGISTRATION ERROR:", error);
    console.error("❌ STATUS:", error.response?.status);
    console.error("❌ RESPONSE:", error.response?.data);

    throw error;
  }
    };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
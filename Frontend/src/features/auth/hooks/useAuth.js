import { useContext, useState } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout } from "../services/auth.api";

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    const { user, setUser, loading, setLoading } = context;
    const [authError, setAuthError] = useState("");

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        setAuthError("");
        try {
            const data = await login({ email, password });
            if (data?.user) {
                if (data.token) {
                    localStorage.setItem("token", data.token);
                }
                localStorage.setItem("user", JSON.stringify(data.user));
                setUser(data.user);
                return data.user;
            }
        } catch (err) {
            const msg = err.response?.data?.message || "Login failed. Please check your credentials.";
            setAuthError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        setAuthError("");
        try {
            const data = await register({ username, email, password });
            if (data?.user) {
                if (data.token) {
                    localStorage.setItem("token", data.token);
                }
                localStorage.setItem("user", JSON.stringify(data.user));
                setUser(data.user);
                return data.user;
            }
        } catch (err) {
            const msg = err.response?.data?.message || "Registration failed. Please try again.";
            setAuthError(msg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
        } catch (err) {
            console.error("Logout API error:", err);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        authError,
        setAuthError,
        handleRegister,
        handleLogin,
        handleLogout
    };
};

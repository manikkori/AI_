import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";

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
            setUser(null);
        } catch (err) {
            console.error("Logout error:", err);
            setUser(null); // still clear local state
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch current user if not already set
        if (!user) {
            const getAndSetUser = async () => {
                try {
                    const data = await getMe();
                    if (data?.user) {
                        setUser(data.user);
                    }
                } catch (err) {
                    // Not logged in or session expired
                    setUser(null);
                } finally {
                    setLoading(false);
                }
            };
            getAndSetUser();
        } else {
            setLoading(false);
        }
    }, []);

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

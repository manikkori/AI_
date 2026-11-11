import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Initial user state from localStorage if available
    const [user, setUser] = useState(() => {
        try {
            const cachedUser = localStorage.getItem("user");
            return cachedUser ? JSON.parse(cachedUser) : null;
        } catch {
            return null;
        }
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        // If no token exists, immediately mark as unauthenticated
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        // Verify token with backend
        getMe()
            .then((data) => {
                if (data?.user) {
                    setUser(data.user);
                    localStorage.setItem("user", JSON.stringify(data.user));
                } else {
                    setUser(null);
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                }
            })
            .catch(() => {
                // Token invalid or expired
                setUser(null);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

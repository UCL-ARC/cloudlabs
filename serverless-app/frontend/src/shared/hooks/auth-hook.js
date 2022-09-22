import { useState, useCallback, useEffect } from "react";

let logoutTimer;
const timeToAutoLogout = 1000 * 60 * 60 * 24 * 7; // 7 days (in milliseconds)

export const useAuth = () => {
    const [token, setToken] = useState(false);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [userId, setUserId] = useState(false);
    const [username, setUsername] = useState(false);

    const login = useCallback((uid, token, username, expirationDate) => {
        setToken(token);
        setUserId(uid);
        setUsername(username);

        const tokenExpirationDate =
            expirationDate || new Date(new Date().getTime() + timeToAutoLogout);

        setTokenExpirationDate(tokenExpirationDate);
        localStorage.setItem(
            "userData",
            JSON.stringify({
                userId: uid,
                token: token,
                username: username,
                expiration: tokenExpirationDate.toISOString(),
            })
        );
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setTokenExpirationDate(null);
        setUserId(null);
        localStorage.removeItem("userData");
        window.location.replace("/");
    }, []);

    useEffect(() => {
        if (token && tokenExpirationDate) {
            const remainingTime =
                tokenExpirationDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, logout, tokenExpirationDate]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("userData"));
        if (
            storedData &&
            storedData.token &&
            storedData.username &&
            new Date(storedData.expiration) > new Date()
        ) {
            login(
                storedData.userId,
                storedData.token,
                storedData.username,
                new Date(storedData.expiration)
            );
        }
    }, [login]);

    return { token, login, logout, userId, username };
};

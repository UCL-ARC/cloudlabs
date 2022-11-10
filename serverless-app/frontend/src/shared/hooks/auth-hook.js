import { useState, useCallback, useEffect } from "react";

import UserPool from "../util/UserPool";

let logoutTimer;
//const timeToAutoLogout = 1000 * 60 * 60 * 24 * 7; // 7 days (in milliseconds)
const localStorageId = process.env.REACT_APP_LOCAL_STORAGE_ID;

export const useAuth = () => {
    const [userId, setUserId] = useState(false);
    const [username, setUsername] = useState(false);
    const [userEmail, setUserEmail] = useState(false);

    const [idToken, setIdToken] = useState(false);
    const [idTokenExpiration, setIdTokenExpiration] = useState(false);

    const [accessToken, setAccessToken] = useState(false);
    const [accessTokenExpiration, setAccessTokenExpiration] = useState(false);

    const [refreshToken, setRefreshToken] = useState(false);

    const login = useCallback(
        (
            userId,
            username,
            userEmail,
            idToken,
            idTokenExpiration,
            accessToken,
            accessTokenExpiration
        ) => {
            setUserId(userId);
            setUsername(username);
            setUserEmail(userEmail);
            setIdToken(idToken);
            setIdTokenExpiration(idTokenExpiration);
            setAccessToken(accessToken);
            setAccessTokenExpiration(accessTokenExpiration);

            localStorage.setItem(
                localStorageId,
                JSON.stringify({
                    userId: userId,
                    username: username,
                    userEmail: userEmail,
                })
            );
        },
        []
    );

    const logout = useCallback(() => {
        const cognitoUser = UserPool.getCurrentUser();
        cognitoUser.signOut();

        setUserId(null);
        setUsername(null);
        setUserEmail(null);
        setIdToken(null);
        setIdTokenExpiration(null);
        setAccessToken(null);
        setAccessTokenExpiration(null);
        setRefreshToken(null);

        localStorage.removeItem(localStorageId);
        clearTimeout(logoutTimer);

        window.location.replace("/");
    }, []);

    const refreshAuth = () => {
        // AWS methods get the current user and auth tokens
        // If the auth token has expired, then getSession() will use the refresh token automatically to get new tokens and start a new session
        const user = UserPool.getCurrentUser();

        user?.getSession(function (err, session) {
            if (err) {
                alert(
                    "Error getting the user session. Please inform your administrator of this issue."
                );
                return;
            }

            const userId = session.getIdToken().decodePayload()["sub"];
            const username = session.getIdToken().decodePayload()[
                "cognito:username"
            ];
            const userEmail = session.getIdToken().decodePayload().email;

            const idToken = session.getIdToken().getJwtToken();
            const idTokenExpiration = session.getIdToken().getExpiration();

            const accessToken = session.getAccessToken().getJwtToken();
            const accessTokenExpiration = session
                .getAccessToken()
                .getExpiration();

            login(
                userId,
                username,
                userEmail,
                idToken,
                idTokenExpiration,
                accessToken,
                accessTokenExpiration
            );
        });
    };

    useEffect(() => {
        if (accessToken && accessTokenExpiration) {
            const remainingTime =
                new Date(accessTokenExpiration * 1000).getTime() -
                new Date().getTime();

            logoutTimer = setTimeout(refreshAuth, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [accessToken, accessTokenExpiration, logout]);

    useEffect(() => {
        refreshAuth();
    }, [login]);

    return {
        userId,
        username,
        userEmail,
        idToken,
        idTokenExpiration,
        accessToken,
        accessTokenExpiration,
        refreshToken,
        login,
        logout,
    };
};

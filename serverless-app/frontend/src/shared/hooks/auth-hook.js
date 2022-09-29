import { useState, useCallback, useEffect } from "react";

import UserPool from "../util/UserPool";

let logoutTimer;
//const timeToAutoLogout = 1000 * 60 * 60 * 24 * 7; // 7 days (in milliseconds)
const timeToAutoLogout = 1000 * 60 * 60; // 1 hour (in milliseconds)

export const useAuth = () => {
    const [userId, setUserId] = useState(false);
    const [username, setUsername] = useState(false);
    const [userEmail, setUserEmail] = useState(false);

    const [idToken, setIdToken] = useState(false);
    const [idTokenExpiration, setIdTokenExpiration] = useState(false);

    const [accessToken, setAccessToken] = useState(false);
    const [accessTokenExpiration, setAccessTokenExpiration] = useState(false);

    const [refreshToken, setRefreshToken] = useState(false);

    // const login = useCallback((uid, token, username, expirationDate) => {
    //     setToken(token);
    //     setUserId(uid);
    //     setUsername(username);

    //     const tokenExpirationDate =
    //         expirationDate || new Date(new Date().getTime() + timeToAutoLogout);

    //     setTokenExpirationDate(tokenExpirationDate);
    //     localStorage.setItem(
    //         "userData",
    //         JSON.stringify({
    //             userId: uid,
    //             token: token,
    //             username: username,
    //             expiration: tokenExpirationDate.toISOString(),
    //         })
    //     );
    // }, []);

    const login = useCallback(
        (
            userId,
            username,
            userEmail,
            idToken,
            idTokenExpiration,
            accessToken,
            accessTokenExpiration,
            refreshToken
        ) => {
            setUserId(userId);
            setUsername(username);
            setUserEmail(userEmail);
            setIdToken(idToken);
            setIdTokenExpiration(idTokenExpiration);
            setAccessToken(accessToken);
            setAccessTokenExpiration(accessTokenExpiration);
            //setRefreshToken(refreshToken);

            console.log("kk");
            console.log(username);
            console.log(new Date(accessTokenExpiration * 1000));
            console.log(new Date(accessTokenExpiration * 1000).getTime());
            console.log(new Date());
            console.log(new Date().getTime());

            console.log(
                new Date(accessTokenExpiration * 1000).getTime() -
                    new Date().getTime()
            );

            // const tokenExpirationDate =
            //     accessTokenExpiration ||
            //     new Date(new Date().getTime() + timeToAutoLogout);

            // setTokenExpirationDate(tokenExpirationDate);

            console.log("setting local storage");
            localStorage.setItem(
                "userData",
                JSON.stringify({
                    userId: userId,
                    username: username,
                    userEmail: userEmail,
                    idToken: idToken,
                    idTokenExpiration: idTokenExpiration,
                    accessToken: accessToken,
                    accessTokenExpiration: accessTokenExpiration,
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

        //setTokenExpirationDate(null);
        localStorage.removeItem("userData");

        window.location.replace("/");
    }, []);

    const refreshAuth = () => {
        // refresh the token or logout if the token is invalid

        // this is where we need to handle the refresh token
        // get the refresh token associated with the currently logged in user
        // exchange the refresh token for new credentials
        // log in the user with these new credentials

        console.log("refresh auth");

        var user = UserPool.getCurrentUser();

        user.getSession(function (err, session) {
            console.log(session);

            const userId = session.getIdToken().decodePayload()["sub"];
            const username = session.getIdToken().decodePayload()[
                "cognito:username"
            ];
            const userEmail = session.getIdToken().decodePayload().email;

            const idToken = session.getIdToken().getJwtToken();
            const idTokenExpiration = session.getIdToken().getExpiration();

            const accessToken = session.getAccessToken().getJwtToken();
            const accessTokenExpiration = session.getIdToken().getExpiration();

            const refreshToken = session.getRefreshToken().getToken();

            console.log(accessToken);
            console.log(accessTokenExpiration);

            login(
                userId,
                username,
                userEmail,
                idToken,
                idTokenExpiration,
                accessToken,
                accessTokenExpiration
                //refreshToken
            );

            // log the user out if a problem occurs in this function
        });
    };

    const remainingTime =
        new Date(accessTokenExpiration * 1000).getTime() - new Date().getTime();

    useEffect(() => {
        console.log("nn");
        console.log(accessToken);
        console.log(accessTokenExpiration);
        if (accessToken && accessTokenExpiration) {
            const remainingTime =
                new Date(accessTokenExpiration * 1000).getTime() -
                new Date().getTime();

            console.log(remainingTime);

            logoutTimer = setTimeout(refreshAuth, remainingTime);
        } else {
            console.log("clear");
            clearTimeout(logoutTimer);
        }
    }, [accessToken, accessTokenExpiration, logout]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("userData"));
        console.log("check auth");
        console.log(storedData);

        // check local storage items exist and that the expiry date is in the future
        if (
            storedData &&
            storedData.userId &&
            storedData.username &&
            storedData.userEmail &&
            storedData.idToken &&
            storedData.accessToken &&
            new Date(storedData.accessTokenExpiration * 1000) > new Date() // multiply the date by 1000 to convert the unix timestamp to milliseconds
        ) {
            console.log("ll");

            // multiply the date by 1000 to convert the unix timestamp to milliseconds
            console.log(new Date(storedData.accessTokenExpiration * 1000));
            console.log(
                new Date(storedData.accessTokenExpiration * 1000) > new Date()
            );

            refreshAuth();
        }
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

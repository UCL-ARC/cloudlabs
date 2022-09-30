import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
    AuthenticationDetails,
} from "amazon-cognito-identity-js";

import Layout from "./shared/layout/Layout";
import NotFound from "./NotFound";
import Home from "./home/Home";
import Users from "./user/pages/Users";
import NewMedia from "./userMedia/pages/NewMedia";
import UserMedia from "./userMedia/pages/UserMedia";
import UpdateMedia from "./userMedia/pages/UpdateMedia";
import Auth from "./user/pages/Auth";

import ErrorModal from "./shared/components/UIElements/ErrorModal";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";

import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";

import UserPool from "./shared/util/UserPool";

function App() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const {
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
    } = useAuth();

    let routes;
    if (idToken) {
        routes = (
            <Routes>
                <Route path="/auth" element={<Navigate replace to="/" />} />

                <Route path="/" element={<Home />} />

                {/* <Route path="/users" element={<Users />} /> */}

                <Route path="/:username/media" element={<UserMedia />} />

                <Route path="/media/new" element={<NewMedia />} />

                <Route
                    path="/media/:username/:mediaId"
                    element={<UpdateMedia />}
                />

                <Route path="*" element={<NotFound />} />
            </Routes>
        );
    } else {
        routes = (
            <Routes>
                <Route path="/" element={<Home />} />

                {/* <Route path="/users" element={<Users />} /> */}

                {/* <Route path="/:username/media" element={<UserMedia />} /> */}

                <Route path="/auth" element={<Auth />} />

                <Route path="*" element={<NotFound />} />
            </Routes>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: !!accessToken,
                userId: userId,
                username: username,
                userEmail: userEmail,
                idToken: idToken,
                idTokenExpiration: idTokenExpiration,
                accessToken: accessToken,
                accessTokenExpiration: accessTokenExpiration,
                refreshToken: refreshToken,
                login: login,
                logout: logout,
            }}
        >
            <ErrorModal error={error} onClear={() => setError(null)} />
            {isLoading && <LoadingSpinner asOverlay />}

            <Layout>{routes}</Layout>
        </AuthContext.Provider>
    );
}

export default App;

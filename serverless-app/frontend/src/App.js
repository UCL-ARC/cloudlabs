import { Route, Routes, Navigate } from "react-router-dom";

import Layout from "./shared/layout/Layout";
import NotFound from "./NotFound";
import Home from "./home/Home";
import Users from "./user/pages/Users";

import NewMedia from "./userMedia/pages/NewMedia";
import UserMedia from "./userMedia/pages/UserMedia";
import UpdateMedia from "./userMedia/pages/UpdateMedia";

import Auth from "./user/pages/Auth";

import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";

function App() {
    const { token, login, logout, userId, username } = useAuth();

    let routes;

    if (token) {
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
                {/* <Route path="/auth" element={<Navigate replace to="/" />} /> */}

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
                isLoggedIn: !!token,
                token: token,
                userId: userId,
                username: username,
                login: login,
                logout: logout,
            }}
        >
            <Layout>{routes}</Layout>
        </AuthContext.Provider>
    );
}

export default App;

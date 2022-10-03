import React, { useContext } from "react";

import { AuthContext } from "../shared/context/auth-context";

import "./Home.css";

const Home = () => {
    const auth = useContext(AuthContext);

    console.log(auth);

    return (
        <main className="homepage-container">
            <p>Hello {auth.username}</p>

            <div className="homepage-header">
                <h1 className="homepage-title">Homepage title</h1>
            </div>

            <div className="homepage-body">
                <p>Main body</p>
            </div>

            <div className="homepage-footer">
                <p>footer info</p>
            </div>
        </main>
    );
};

export default Home;

import React, { useContext } from "react";

import { AuthContext } from "../shared/context/auth-context";
import UserPool from "../shared/util/UserPool";

import "./Home.css";

const Home = () => {
    const auth = useContext(AuthContext);

    console.log(auth);

    // var cognitoUser = UserPool.getCurrentUser();
    // console.log(cognitoUser);

    // if (cognitoUser != null) {
    //     cognitoUser.getUserData(function (err, userData) {
    //         if (err) {
    //             console.log(err.message);
    //             alert(err.message || JSON.stringify(err));
    //             return;
    //         }
    //         console.log("User data for user " + userData);
    //     });
    // }

    // if (cognitoUser != null) {
    //     cognitoUser.getSession(function (err, session) {
    //         if (err) {
    //             alert(err.message || JSON.stringify(err));
    //             return;
    //         }
    //         console.log(session);
    //         console.log("session validity: " + session.isValid());
    //     });
    // }

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

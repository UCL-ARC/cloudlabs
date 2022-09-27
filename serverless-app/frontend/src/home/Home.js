import React, { useContext, useEffect } from "react";
import { CognitoJwtVerifier } from "aws-jwt-verify";

import { AuthContext } from "../shared/context/auth-context";

import "./Home.css";

const Home = () => {
    const auth = useContext(AuthContext);

    useEffect(() => {
        const pageUrl = window.location.href.toString();
        console.log(pageUrl);

        const paramIndex = pageUrl.indexOf("#");
        if (paramIndex === -1) {
            console.log("No URL params present");
            return;
        }

        const params = pageUrl.substring(paramIndex + 1);
        console.log(params);

        //const idToken = pageUrl.split("=")[1].split("&")[0];

        // const extractToken = async () => {
        //     // Verifier that expects valid access tokens:
        //     const verifier = CognitoJwtVerifier.create({
        //         userPoolId: "eu-west-2_7i5YxPcBg",
        //         tokenUse: "access",
        //         clientId: "1t2qrjr63cj2h2tvf7b441ech2",
        //     });

        //     try {
        //         const payload = await verifier.verify(idToken);
        //         console.log("Token is valid. Payload:", payload);
        //     } catch {
        //         console.log("Token not valid!");
        //     }
        // };

        // extractToken();

        // auth.login(
        // 	responseData.userId,
        // 	responseData.token,
        // 	responseData.username
        // );
    }, []);

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

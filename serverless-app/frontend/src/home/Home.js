import React, { useContext, useEffect } from "react";
import { CognitoJwtVerifier } from "aws-jwt-verify";

import {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
    AuthenticationDetails,
} from "amazon-cognito-identity-js";

import { AuthContext } from "../shared/context/auth-context";

import UserPool from "../shared/util/UserPool";

import "./Home.css";

const Home = () => {
    const auth = useContext(AuthContext);

    // useEffect(() => {
    //     const pageUrl = window.location.href.toString();
    //     console.log(pageUrl);

    //     const paramIndex = pageUrl.indexOf("#");
    //     if (paramIndex === -1) {
    //         console.log("No URL params present");
    //         return;
    //     }

    //     const params = pageUrl.substring(paramIndex + 1);
    //     console.log(params);

    //     //const idToken = pageUrl.split("=")[1].split("&")[0];

    //     // const extractToken = async () => {
    //     //     // Verifier that expects valid access tokens:
    //     //     const verifier = CognitoJwtVerifier.create({
    //     //         userPoolId: "eu-west-2_7i5YxPcBg",
    //     //         tokenUse: "access",
    //     //         clientId: "1t2qrjr63cj2h2tvf7b441ech2",
    //     //     });

    //     //     try {
    //     //         const payload = await verifier.verify(idToken);
    //     //         console.log("Token is valid. Payload:", payload);
    //     //     } catch {
    //     //         console.log("Token not valid!");
    //     //     }
    //     // };

    //     // extractToken();

    //     // auth.login(
    //     // 	responseData.userId,
    //     // 	responseData.token,
    //     // 	responseData.username
    //     // );
    // }, []);

    var cognitoUser = UserPool.getCurrentUser();

    if (cognitoUser != null) {
        cognitoUser.getSession(function (err, session) {
            if (err) {
                alert(err.message || JSON.stringify(err));
                return;
            }
            console.log("session validity: " + session.isValid());

            // NOTE: getSession must be called to authenticate user before calling getUserAttributes
            cognitoUser.getUserAttributes(function (err, attributes) {
                if (err) {
                    // Handle error
                } else {
                    // Do something with attributes
                    console.log(attributes);
                }
            });

            // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            //     IdentityPoolId: "...", // your identity pool id here
            //     Logins: {
            //         // Change the key below according to the specific region your user pool is in.
            //         "cognito-idp.<region>.amazonaws.com/<YOUR_USER_POOL_ID>":
            //             session.getIdToken().getJwtToken(),
            //     },
            // });

            // Instantiate aws sdk service objects now that the credentials have been updated.
            // example: var s3 = new AWS.S3();
        });
    }

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

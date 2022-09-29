import React, { useState, useContext } from "react";
import {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
    AuthenticationDetails,
} from "amazon-cognito-identity-js";
import { useNavigate } from "react-router-dom";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import SignupConfirm from "../components/SignupConfirm";
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE,
    VALIDATOR_NO_WHITE_SPACE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import UserPool from "../../shared/util/UserPool";

import "./Auth.css";

const Auth = () => {
    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [showSignupConfirm, setShowSignupConfirm] = useState(false);
    const [cognitoData, setCognitoData] = useState(null);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [localError, setLocalError] = useState(null);
    const [signupWasSuccessful, setSignupWasSuccessful] = useState(null);
    const navigate = useNavigate();

    console.log(cognitoData);

    const [formState, inputHandler, setFormData] = useForm(
        {
            username: {
                value: "",
                isValid: false,
            },
            password: {
                value: "",
                isValid: false,
            },
        },
        false
    );

    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData(
                {
                    ...formState.inputs,
                    email: undefined,
                },
                formState.inputs.email.isValid &&
                    formState.inputs.password.isValid
            );
        } else {
            setFormData(
                {
                    ...formState.inputs,
                },
                false
            );
        }
        setIsLoginMode((prevMode) => !prevMode);
    };

    const loginHandler = () => {
        const authenticationDetails = new AuthenticationDetails({
            Username: formState.inputs.username.value,
            Password: formState.inputs.password.value,
        });

        const cognitoUser = new CognitoUser({
            Username: formState.inputs.username.value,
            Pool: UserPool,
        });

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                const idToken = result.getIdToken().getJwtToken();
                const idTokenExpiration = result.getIdToken().getExpiration();

                const accessToken = result.getAccessToken().getJwtToken();
                const accessTokenExpiration = result
                    .getIdToken()
                    .getExpiration();

                const refreshToken = result.getRefreshToken().getToken();

                const userId = result.getIdToken().decodePayload()["sub"];
                const username = result.getIdToken().decodePayload()[
                    "cognito:username"
                ];
                const userEmail = result.getIdToken().decodePayload().email;

                console.log(result);
                console.log(userId);
                // console.log(refreshToken);
                // console.log(accessToken);
                // console.log(
                //     result.getIdToken().decodePayload()["cognito:username"]
                // );

                // cognitoUser.getUserData(function (err, userData) {
                //     if (err) {
                //         console.log(err.message);
                //         alert(err.message || JSON.stringify(err));
                //         return;
                //     }
                //     console.log(userData);
                // });

                // cognitoUser.getSession(function (err, session) {
                //     if (err) {
                //         alert(err.message || JSON.stringify(err));
                //         return;
                //     }
                //     console.log(session);
                //     console.log("session validity: " + session.isValid());
                // });

                console.log(cognitoUser);

                // need to look into best practices for auth flows and the refresh token
                auth.login(
                    userId,
                    username,
                    userEmail,
                    idToken,
                    idTokenExpiration,
                    accessToken,
                    accessTokenExpiration
                    //refreshToken
                );

                //navigate("/");
            },

            onFailure: function (err) {
                setLocalError(err.message);
            },
        });
    };

    const signupHandler = () => {
        //let cognitoUser;
        UserPool.signUp(
            formState.inputs.username.value,
            formState.inputs.password.value,
            [{ Name: "email", Value: formState.inputs.email.value }],
            null,
            (err, result) => {
                if (err) {
                    console.log(err.message);
                    setLocalError(err.message);
                    return;
                }

                // console.log(result);
                // cognitoUser = result.user;
                // console.log("username is " + cognitoUser.getUsername());

                setCognitoData(result);
                setShowSignupConfirm(true);
            }
        );
    };

    const authSubmitHandler = async (event) => {
        event.preventDefault();

        if (isLoginMode) {
            loginHandler();
        } else {
            signupHandler();
        }
    };

    if (showSignupConfirm) {
        return (
            <SignupConfirm
                cognitoData={cognitoData}
                setShowSignupConfirm={setShowSignupConfirm}
                setSignupWasSuccessful={setSignupWasSuccessful}
                setIsLoginMode={setIsLoginMode}
            />
        );
    }

    return (
        <>
            <ErrorModal
                error={localError}
                onClear={() => setLocalError(null)}
            />

            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay />}
                <h2>Login Required</h2>

                {signupWasSuccessful && (
                    <h3 className="signup-successful-message">
                        Signup was successful, you can now login.
                    </h3>
                )}

                <hr />

                <form onSubmit={authSubmitHandler}>
                    {!isLoginMode && (
                        <Input
                            element="input"
                            id="email"
                            type="text"
                            label="Email"
                            validators={[
                                VALIDATOR_EMAIL(),
                                VALIDATOR_MINLENGTH(3),
                            ]}
                            errorText="Please enter a valid email."
                            onInput={inputHandler}
                        />
                    )}

                    <Input
                        element="input"
                        id="username"
                        label="Username"
                        validators={[
                            VALIDATOR_REQUIRE(),
                            VALIDATOR_MINLENGTH(3),
                            VALIDATOR_NO_WHITE_SPACE(),
                        ]}
                        errorText="Please enter a valid username"
                        onInput={inputHandler}
                    />

                    <Input
                        element="input"
                        id="password"
                        type="password"
                        label="Password"
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText="Please enter a valid password, at least 6 characters."
                        onInput={inputHandler}
                    />

                    <Button type="submit" disabled={!formState.isValid}>
                        {isLoginMode ? "LOGIN" : "SIGNUP"}
                    </Button>
                </form>

                <Button inverse onClick={switchModeHandler}>
                    SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
                </Button>
            </Card>
        </>
    );
};

export default Auth;

import React, { useState, useContext, useRef } from "react";
import {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
} from "amazon-cognito-identity-js";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import { AuthContext } from "../../shared/context/auth-context";

import UserPool from "../../shared/util/UserPool";

import "./SignupConfirm.css";

const SignupConfirm = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const auth = useContext(AuthContext);
    const verificationTextInputRef = useRef();

    const { cognitoData } = props;

    console.log(cognitoData);

    var userData = {
        Username: cognitoData.user.username,
        Pool: UserPool,
    };

    var cognitoUser = new CognitoUser(userData);

    const authSubmitHandler = async (event) => {
        event.preventDefault();

        cognitoUser.confirmRegistration(
            verificationTextInputRef.current.value,
            true,
            function (err, result) {
                if (err) {
                    console.log(err);
                    setError(err);
                    return;
                }
                console.log("call result: " + result);

                if (result !== "SUCCESS") {
                    setError("Could not confirm user. Please try again later");
                }
            }
        );
    };

    const resendVerificationCode = () => {
        cognitoUser.resendConfirmationCode(function (err, result) {
            if (err) {
                alert(err.message || JSON.stringify(err));
                return;
            }
            console.log("call result: " + result);
        });
    };

    return (
        <>
            <ErrorModal error={error} onClear={() => setError(null)} />

            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay />}
                <h2>Confirm Verification Code</h2>
                <p>
                    We have sent a code by email to{" "}
                    {cognitoData.codeDeliveryDetails.Destination}. <br></br>
                    Enter it below to confirm your account.
                </p>
                <hr />

                <br></br>

                <form onSubmit={authSubmitHandler}>
                    <label htmlFor="verification"> Verification Code: </label>
                    <input
                        type="text"
                        id="verification"
                        name="verification"
                        ref={verificationTextInputRef}
                    />

                    <br></br>
                    <br></br>

                    <Button type="submit" disabled={!verificationTextInputRef}>
                        Confirm Account
                    </Button>
                </form>

                <p>
                    Didn't receive a code?{" "}
                    <span
                        className="resend-verification-code-btn"
                        onClick={resendVerificationCode}
                    >
                        Resend it
                    </span>
                </p>
            </Card>
        </>
    );
};

export default SignupConfirm;

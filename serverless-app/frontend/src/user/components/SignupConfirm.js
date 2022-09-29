import React, { useState, useRef } from "react";
import {
    CognitoUserPool,
    CognitoUserAttribute,
    CognitoUser,
} from "amazon-cognito-identity-js";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import UserPool from "../../shared/util/UserPool";

import "./SignupConfirm.css";

const SignupConfirm = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [resendCodeMessage, setResendCodeMessage] = useState("");
    const verificationTextInputRef = useRef();

    const {
        cognitoData,
        setShowSignupConfirm,
        setSignupWasSuccessful,
        setIsLoginMode,
    } = props;

    console.log(cognitoData);

    const cognitoUser = new CognitoUser({
        Username: cognitoData.user.username,
        Pool: UserPool,
    });

    const authSubmitHandler = async (event) => {
        event.preventDefault();

        const verificationCode = verificationTextInputRef.current.value.trim();

        cognitoUser.confirmRegistration(
            verificationCode,
            true,
            (err, result) => {
                if (err) {
                    setError(err.message);
                    return;
                }
                console.log("call result: " + result);

                if (result !== "SUCCESS")
                    setError("Could not confirm user. Please try again later");

                setIsLoginMode(true);
                setSignupWasSuccessful(true);
                setShowSignupConfirm(false);
            }
        );
    };

    const resendVerificationCode = () => {
        cognitoUser.resendConfirmationCode(function (err, result) {
            if (err) {
                setError(err.message);
                return;
            }
            console.log(result);
            setResendCodeMessage(result);
        });
    };

    return (
        <>
            <ErrorModal error={error} onClear={() => setError(null)} />

            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay />}
                <h2>Confirm Signup Code</h2>
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

                {resendCodeMessage && (
                    <p className="resend-verification-code-message">
                        Email resent to{" "}
                        {resendCodeMessage.CodeDeliveryDetails.Destination} {""}
                        Please check your email for a new code
                    </p>
                )}
            </Card>
        </>
    );
};

export default SignupConfirm;

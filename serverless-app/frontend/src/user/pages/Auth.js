import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import FileUpload from "../../shared/components/FormElements/FileUpload";
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE,
    VALIDATOR_NO_WHITE_SPACE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import "./Auth.css";

const Auth = () => {
    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

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
                    image: undefined,
                },
                formState.inputs.email.isValid &&
                    formState.inputs.password.isValid
            );
        } else {
            setFormData(
                {
                    ...formState.inputs,
                    image: {
                        value: null,
                        isValid: false,
                    },
                },
                false
            );
        }
        setIsLoginMode((prevMode) => !prevMode);
    };

    const authSubmitHandler = async (event) => {
        event.preventDefault();

        if (isLoginMode) {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/users/login`,
                    "POST",
                    JSON.stringify({
                        username: formState.inputs.username.value,
                        password: formState.inputs.password.value,
                    }),
                    {
                        "Content-Type": "application/json",
                    }
                );

                auth.login(
                    responseData.userId,
                    responseData.token,
                    responseData.username
                );
            } catch (err) {}
        } else {
            try {
                const formData = new FormData();
                formData.append("email", formState.inputs.email.value);
                formData.append("username", formState.inputs.username.value);
                formData.append("password", formState.inputs.password.value);
                formData.append("image", formState.inputs.image.value);

                // the commented out part below works for the express api but not for the lambda
                // need to figure out why
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
                    // "POST",
                    // formData
                    "POST",
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        username: formState.inputs.username.value,
                        password: formState.inputs.password.value,
                        // image: formState.inputs.image.value,
                    }),
                    {
                        "Content-Type": "application/json",
                    }
                );

                auth.login(
                    responseData.userId,
                    responseData.token,
                    responseData.username
                );
            } catch (err) {}
        }
    };

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />

            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay />}
                <h2>Login Required</h2>

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

                    {!isLoginMode && (
                        <FileUpload
                            center
                            id="image"
                            onInput={inputHandler}
                            errorText="Please provide an image."
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

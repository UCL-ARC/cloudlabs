import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import {
    VALIDATOR_REQUIRE,
    VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import "./NewMedia.css";

const UpdateMedia = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedMedia, setLoadedMedia] = useState();
    const username = useParams().username;
    const mediaId = useParams().mediaId;
    const navigate = useNavigate();

    const [formState, inputHandler, setFormData] = useForm(
        {
            title: {
                value: "",
                isValid: false,
            },
            description: {
                value: "",
                isValid: false,
            },
        },
        false
    );

    useEffect(() => {
        const fetchSingleMedia = async () => {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/media/${username}/${mediaId}`
                );

                setLoadedMedia(responseData.Items[0]);
                setFormData(
                    {
                        title: {
                            value: responseData.media.title,
                            isValid: true,
                        },
                        description: {
                            value: responseData.media.description,
                            isValid: true,
                        },
                    },
                    true
                );
            } catch (err) {}
        };
        fetchSingleMedia();
    }, [sendRequest, username, setFormData]);

    const mediaUpdateSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/media/${mediaId}`,
                "PATCH",
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value,
                }),
                {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + auth.token,
                }
            );

            navigate("/");
        } catch (err) {
            console.log(error);
        }
    };

    if (isLoading) {
        return (
            <div className="center">
                <LoadingSpinner asOverlay />
            </div>
        );
    }

    if (!loadedMedia && !error) {
        return (
            <div className="center">
                <Card>
                    <h2>Could not find media!</h2>
                </Card>
            </div>
        );
    }

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />

            {!isLoading && loadedMedia && (
                <form
                    className="media-form"
                    onSubmit={mediaUpdateSubmitHandler}
                >
                    <Input
                        id="title"
                        element="input"
                        type="text"
                        label="Title"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a valid title."
                        onInput={inputHandler}
                        initialValue={loadedMedia.MediaTitle}
                        initialValid={true}
                    />

                    <Input
                        id="description"
                        element="textarea"
                        label="Description"
                        validators={[VALIDATOR_MINLENGTH(5)]}
                        errorText="Please enter a valid description (min. 5 characters)."
                        onInput={inputHandler}
                        initialValue={loadedMedia.MediaDescription}
                        initialValid={true}
                    />

                    <Button type="submit" disabled={!formState.isValid}>
                        UPDATE MEDIA
                    </Button>
                </form>
            )}
        </>
    );
};

export default UpdateMedia;

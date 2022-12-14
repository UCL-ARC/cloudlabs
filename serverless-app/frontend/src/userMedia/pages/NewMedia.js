import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import FileUpload from "../../shared/components/FormElements/FileUpload";
import {
    VALIDATOR_REQUIRE,
    VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import "./NewMedia.css";

const NewMedia = () => {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    const {
        isLoading,
        setIsLoading,
        error,
        setError,
        sendRequest,
        clearError,
    } = useHttpClient();
    const [formState, inputHandler] = useForm(
        {
            title: {
                value: "",
                isValid: false,
            },
            description: {
                value: "",
                isValid: false,
            },
            file: {
                value: null,
                isValid: false,
            },
        },
        false
    );

    const formatFileName = (file) => {
        const randomString = uuidv4();
        const date = getDate();
        const fileExtension = file.name.split(".").pop();

        const newFileName = `${randomString}-${date}.${fileExtension}`;

        // maximum of 60 characters
        return newFileName.substring(0, 60);
    };

    const getDate = () => {
        let today = new Date();
        return today.toISOString().split("T")[0];
    };

    const s3uploadHandler = async (file) => {
        const newFileName = formatFileName(file);

        // get a presigned url from aws
        const responseData = await sendRequest(
            `${process.env.REACT_APP_API_ENDPOINT}/getPresignedUrl`,
            "POST",
            JSON.stringify({
                filename: newFileName,
                fileType: file.type,
            }),
            {
                Authorization: "Bearer " + auth.accessToken,
            }
        );

        // send the file directly to s3 using the presigned url
        // this allows us to bypass handling the upload in lambda (which could be expensive)
        setIsLoading(true);

        let result;
        try {
            result = await fetch(responseData.uploadURL, {
                method: "PUT",
                body: file,
            });
        } catch (err) {
            console.log(err);
        }

        if (!result.ok) {
            throw new Error(result.statusText);
        }

        setIsLoading(false);

        // final URL for the user doesn't need the query string params
        const s3FileLocation = result.url.split("?")[0];

        return { filename: newFileName, s3FileLocation: s3FileLocation };
    };

    const mediaSubmitHandler = async (event) => {
        event.preventDefault();

        // upload the file to S3 using a presigned url
        let uploadedFile;
        try {
            uploadedFile = await s3uploadHandler(
                formState.inputs.file.value,
                auth
            );
        } catch (err) {
            console.log(err);
        }

        try {
            // const formData = new FormData();
            // formData.append("title", formState.inputs.title.value);
            // formData.append("description", formState.inputs.description.value);
            // formData.append("fileLocation", uploadedFile.location);
            // formData.append("fileType", formState.inputs.file.value.type);
            // formData.append("s3Filename", uploadedFile.key);

            await sendRequest(
                `${process.env.REACT_APP_API_ENDPOINT}/media/${auth.username}/new`,
                "POST",
                //formData,
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value,
                    //image: formState.inputs.image.value,
                    fileLocation: uploadedFile.s3FileLocation,
                    fileType: formState.inputs.file.value.type,
                    s3Filename: uploadedFile.filename,
                }),
                {
                    Authorization: "Bearer " + auth.accessToken,
                }
            );

            navigate("/");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />

            <form className="media-form" onSubmit={mediaSubmitHandler}>
                {isLoading && (
                    <LoadingSpinner
                        asOverlay
                        message={"File upload in progress, please wait"}
                    />
                )}

                <Input
                    id="title"
                    element="input"
                    type="text"
                    label="Title"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid title."
                    onInput={inputHandler}
                />

                <Input
                    id="description"
                    element="textarea"
                    label="Description"
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid description (at least 5 characters)."
                    onInput={inputHandler}
                />

                <FileUpload
                    id="file"
                    onInput={inputHandler}
                    errorText="Please provide an image or video."
                />

                <Button type="submit" disabled={!formState.isValid}>
                    ADD MEDIA
                </Button>
            </form>
        </>
    );
};

export default NewMedia;

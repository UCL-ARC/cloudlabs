import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

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

import { handleUpload } from "../../shared/util/fileHandler";

import "./NewMedia.css";

const NewMedia = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
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

    const navigate = useNavigate();

    const mediaSubmitHandler = async (event) => {
        event.preventDefault();

        // upload the file to S3
        let uploadedFile;
        try {
            uploadedFile = await handleUpload(formState.inputs.file.value);
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
                `${process.env.REACT_APP_BACKEND_URL}/media`,
                "POST",
                //formData,
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value,
                    //image: formState.inputs.image.value,
                    fileLocation: uploadedFile.location,
                    fileType: formState.inputs.file.value.type,
                    s3Filename: uploadedFile.key,
                }),
                {
                    Authorization: "Bearer " + auth.token,
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
                {isLoading && <LoadingSpinner asOverlay />}

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

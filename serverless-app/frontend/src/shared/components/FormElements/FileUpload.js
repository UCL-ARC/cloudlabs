import React, { useRef, useState, useEffect } from "react";

import Button from "./Button";
import "./FileUpload.css";

const FileUpload = (props) => {
    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);
    const filePickerRef = useRef();

    const { id, onInput, center, errorText } = props;

    useEffect(() => {
        if (!file) {
            return;
        }
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    }, [file]);

    const pickedHandler = (event) => {
        let pickedFile;
        let fileIsValid = isValid;
        if (event.target.files && event.target.files.length === 1) {
            pickedFile = event.target.files[0];
            setFile(pickedFile);
            setIsValid(true);
            fileIsValid = true;
        } else {
            setIsValid(false);
            fileIsValid = false;
        }
        onInput(id, pickedFile, fileIsValid);
    };

    const pickImageHandler = () => {
        filePickerRef.current.click();
    };

    return (
        <div className="form-control">
            <input
                id={id}
                ref={filePickerRef}
                style={{ display: "none" }}
                type="file"
                accept=".jpg,.png,.jpeg, .mp4"
                onChange={pickedHandler}
            />
            <div className={`file-upload ${center && "center"}`}>
                <div className="file-upload__preview">
                    {previewUrl && file["type"].includes("image") && (
                        <img src={previewUrl} alt="Preview" />
                    )}

                    {previewUrl && file["type"].includes("video") && (
                        <video controls>
                            <source src={previewUrl} />
                        </video>
                    )}

                    {!previewUrl && <p>Please pick an image or video</p>}
                </div>

                <Button type="button" onClick={pickImageHandler}>
                    Pick Image or Video
                </Button>
            </div>
            {!isValid && <p>{errorText}</p>}
        </div>
    );
};

export default FileUpload;

import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

import { handleFileDelete } from "../../shared/util/fileHandler";

import "./MediaItem.css";

const MediaItem = (props) => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const auth = useContext(AuthContext);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const {
        username,
        description,
        mediaId,
        fileLocation,
        onDelete,
        title,
        fileType,
        s3Filename,
    } = props;

    const showDeleteWarningHandler = () => {
        setShowConfirmModal(true);
    };

    const cancelDeleteHandler = () => {
        setShowConfirmModal(false);
    };

    const confirmDeleteHandler = async () => {
        setShowConfirmModal(false);

        try {
            const response = await handleFileDelete(s3Filename);

            if (!response.ok) {
                throw new Error(response.message);
            }

            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/media/${auth.username}/${mediaId}`,
                "DELETE",
                null,
                {
                    Authorization: "Bearer " + auth.accessToken,
                }
            );
            onDelete(mediaId);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />

            <Modal
                show={showConfirmModal}
                onCancel={cancelDeleteHandler}
                header="Are you sure?"
                footerClass="media-item__modal-actions"
                footer={
                    <>
                        <Button inverse onClick={cancelDeleteHandler}>
                            CANCEL
                        </Button>

                        <Button danger onClick={confirmDeleteHandler}>
                            DELETE
                        </Button>
                    </>
                }
            >
                <p>
                    Do you want to proceed and delete this item? Please note
                    that it can't be undone.
                </p>
            </Modal>

            <li className="media-item">
                <Card className="media-item__content">
                    {isLoading && <LoadingSpinner asOverlay />}

                    <div className="media-item__file">
                        {fileType.includes("image") && (
                            <img src={fileLocation} alt={title} />
                        )}

                        {fileType.includes("video") && (
                            <video controls controlsList="nodownload">
                                <source src={fileLocation} />
                            </video>
                        )}
                    </div>

                    <div className="media-item__info">
                        <h2>{title}</h2>
                        <p>{description}</p>
                    </div>

                    <div className="media-item__actions">
                        {auth.username === username && (
                            <Button to={`/media/${username}/${mediaId}`}>
                                EDIT
                            </Button>
                        )}

                        {auth.username === username && (
                            <Button danger onClick={showDeleteWarningHandler}>
                                DELETE
                            </Button>
                        )}
                    </div>
                </Card>
            </li>
        </>
    );
};

export default MediaItem;

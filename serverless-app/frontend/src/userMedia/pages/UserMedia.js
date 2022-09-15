import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MediaList from "../components/MediaList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

const UserMedia = () => {
    const [loadedMedia, setLoadedMedia] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const username = useParams().username;

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/media/${username}`
                );

                setLoadedMedia(responseData.Items);
            } catch (err) {}
        };
        fetchMedia();
    }, [sendRequest, username]);

    const mediaDeletedHandler = (deletedMediaId) => {
        setLoadedMedia((prevMedia) =>
            prevMedia.filter((item) => item.sk !== deletedMediaId)
        );
    };

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />

            {isLoading && (
                <div className="center">
                    <LoadingSpinner asOverlay />
                </div>
            )}

            {!isLoading && loadedMedia && (
                <MediaList
                    items={loadedMedia}
                    onDeleteMedia={mediaDeletedHandler}
                />
            )}
        </>
    );
};

export default UserMedia;

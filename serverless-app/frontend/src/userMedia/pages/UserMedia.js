import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import MediaList from "../components/MediaList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

const UserMedia = () => {
    const auth = useContext(AuthContext);
    const [loadedMedia, setLoadedMedia] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    
    const username = auth.username;
    console.log("User Name: ", auth.username);
    console.log("API endpoint, ", process.env.REACT_APP_API_ENDPOINT );
    console.log("Authentication token ", auth.accessToken);

    useEffect(() => {
        const fetchMedia = async () => {
            // authorizing the GET request makes sure users can only access their own media and no one elses
            // ideally, you would not want to pass the username as a query param.
            // instead, you could intercept the auth token in lambda and extract the username there
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_API_ENDPOINT}/media/${auth.username}`,
                    "GET",
                    null,
                    {
                        Authorization: "Bearer " + auth.accessToken,
                    }
                );

                setLoadedMedia(responseData);
            } catch (err) {console.log(err);}
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

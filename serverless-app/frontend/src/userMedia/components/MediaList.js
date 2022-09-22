import Card from "../../shared/components/UIElements/Card";
import MediaItem from "./MediaItem";
import Button from "../../shared/components/FormElements/Button";
import "./MediaList.css";

const { v4: uuidv4 } = require("uuid");

const MediaList = (props) => {
    const { items, onDeleteMedia } = props;

    console.log(items);

    if (items.length === 0) {
        return (
            <div className="media-list center">
                <Card>
                    <h2>No media found.</h2>
                    <Button to="/media/new">Add Media</Button>
                </Card>
            </div>
        );
    }

    return (
        <ul className="media-list">
            {items.map((item) => (
                <MediaItem
                    key={uuidv4()}
                    mediaId={item.sk}
                    fileLocation={item.FileLocation}
                    title={item.MediaTitle}
                    description={item.MediaDescription}
                    fileType={item.FileType}
                    s3Filename={item.S3Filename}
                    username={item.pk}
                    onDelete={onDeleteMedia}
                />
            ))}
        </ul>
    );
};

export default MediaList;

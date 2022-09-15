import { Link } from "react-router-dom";

import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";

import "./UserItem.css";

const UserItem = (props) => {
    const { id, username, image, email } = props;

    return (
        <li className="user-item">
            <Card className="user-item__content">
                <Link to={`/${username}/media`}>
                    <div className="user-item__image">
                        <Avatar image={image} alt={username} />
                    </div>

                    <div className="user-item__info">
                        <h2>{username}</h2>
                        <h3>Show media</h3>
                    </div>
                </Link>
            </Card>
        </li>
    );
};

export default UserItem;

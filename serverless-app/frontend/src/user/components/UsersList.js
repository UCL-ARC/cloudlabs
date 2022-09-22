import UserItem from "./UserItem";
import Card from "../../shared/components/UIElements/Card";

import "./UsersList.css";

const UsersList = (props) => {
    const { items } = props;

    if (items.length === 0) {
        return (
            <div className="center">
                <Card>
                    <h2>No users found.</h2>
                </Card>
            </div>
        );
    }

    return (
        <ul className="users-list">
            {items.map((user) => (
                <UserItem
                    key={user.pk}
                    id={user.sk}
                    image={user.UserImage}
                    username={user.UserName}
                    email={user.UserEmail}
                />
            ))}
        </ul>
    );
};

export default UsersList;

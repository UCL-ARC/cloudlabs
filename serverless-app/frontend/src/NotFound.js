import "./NotFound.css";

const NotFound = () => {
    return (
        <div className="not-found">
            <div>Page not found</div>
            <div>
                Either the page doesn't exist, or you are not authorized to
                access this page
            </div>
        </div>
    );
};

export default NotFound;

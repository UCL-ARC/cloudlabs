import MainNavigation from "./MainNavigation";

import "./Layout.css";

const Layout = (props) => {
    return (
        <div className="layout">
            <MainNavigation />
            <main className="main-container">{props.children}</main>
        </div>
    );
};

export default Layout;

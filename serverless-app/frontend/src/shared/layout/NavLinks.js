import React from "react";
import { NavLink, useLocation } from "react-router-dom";

import "./NavLinks.css";

const NavLinks = () => {
    const location = useLocation();

    // custom implementation
    // need to find out if there is a way to automatically assign isActive to nested routes
    const getClassName = (navData, path) => {
        const isActive = location["pathname"].includes(path);
        return "nav-link" + (isActive ? " active" : "");
    };

    return (
        <ul className="nav-links">
            <NavLink
                className={(navData) => getClassName(navData, "dashboard")}
                to="/dashboard/tiles"
            >
                Test route
            </NavLink>

            <NavLink
                className={(navData) => getClassName(navData, "unit-level")}
                to="/unit-level/tiles"
            >
                Test route
            </NavLink>

            <NavLink
                className={(navData) => getClassName(navData, "about-us")}
                to="/about-us"
            >
                Test route
            </NavLink>
        </ul>
    );
};

export default NavLinks;

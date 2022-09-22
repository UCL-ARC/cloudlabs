import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/auth-context";

import "./MainNavigation.css";

// TODO: import the NavLinks component and set up the side drawer for smaller screens

const MainNavigation = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const logoutHandler = () => {
        auth.logout();
    };

    return (
        <header className="header">
            <div className="logo">Serverless Example</div>

            <nav className="nav">
                <ul>
                    <li>
                        <NavLink
                            to="/"
                            className={(navData) =>
                                navData.isActive ? " active" : ""
                            }
                        >
                            Home
                        </NavLink>
                    </li>

                    {/* <li>
                        <NavLink
                            to="/users"
                            className={(navData) =>
                                navData.isActive ? " active" : ""
                            }
                        >
                            All User Media
                        </NavLink>
                    </li> */}

                    {auth.isLoggedIn && (
                        <li>
                            <NavLink
                                to={`/${auth.username}/media`}
                                className={(navData) =>
                                    navData.isActive ? " active" : ""
                                }
                            >
                                My Media
                            </NavLink>
                        </li>
                    )}
                    {auth.isLoggedIn && (
                        <li>
                            <NavLink
                                to="/media/new"
                                className={(navData) =>
                                    navData.isActive ? " active" : ""
                                }
                            >
                                Add Media
                            </NavLink>
                        </li>
                    )}
                    {!auth.isLoggedIn && (
                        <li>
                            <NavLink
                                to="/auth"
                                className={(navData) =>
                                    navData.isActive ? " active" : ""
                                }
                            >
                                Login / Register
                            </NavLink>
                        </li>
                    )}
                    {auth.isLoggedIn && (
                        <li>
                            <div
                                className="logout-btn"
                                onClick={() => logoutHandler()}
                            >
                                Logout
                            </div>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default MainNavigation;

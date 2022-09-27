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

                    {/* {!auth.isLoggedIn && (
                        <li>
                            <a href="https://cloudlabs-basic-user-media.auth.eu-west-2.amazoncognito.com/login?client_id=1t2qrjr63cj2h2tvf7b441ech2&response_type=token&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=http://localhost:3000/home/">
                                Login / Register
                            </a>
                        </li>
                    )} */}

                    {/* {auth.isLoggedIn && (
                        <li>
                            <div
                                className="logout-btn"
                                onClick={() => logoutHandler()}
                            >
                                <a href="https://cloudlabs-basic-user-media.auth.eu-west-2.amazoncognito.com/logout?client_id=1t2qrjr63cj2h2tvf7b441ech2&logout_uri=http://localhost:3000/home/">
                                    Logout
                                </a>
                            </div>
                        </li>
                    )} */}
                </ul>
            </nav>
        </header>
    );
};

export default MainNavigation;

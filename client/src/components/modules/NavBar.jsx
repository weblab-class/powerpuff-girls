import React from "react";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import "./NavBar.css";

/**
 * The navigation bar at the top of all pages. Takes no props.
 */
const NavBar = (props) => {
  return (
    <nav className="NavBar-container">
      <div className="NavBar-title u-inlineBlock">StyleSnap</div>
      <div className="NavBar-linkContainer u-inlineBlock">
        <Link to="/" className="NavBar-link">
          Fashboard
        </Link>
        {props.userId && (
          <Link
            to={`/profile/${props.userId}`}
            className="NavBar-link u-inlineBlock"
          >
            Profile
          </Link>
        )}
        {props.userId ? (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={props.handleLogout}
          >
            Sign out
          </button>
        ) : (
          <GoogleLogin
            text="signin_with"
            onSuccess={props.handleLogin}
            onFailure={(err) => console.log(err)}
            containerProps={{
              className: "NavBar-link NavBar-login u-inlineBlock",
            }}
          />
        )}
      </div>
    </nav>
  );
};

export default NavBar;

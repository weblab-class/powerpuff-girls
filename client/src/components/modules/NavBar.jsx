import React from "react";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import "../../tailwind.css";

/**
 * The navigation bar at the top of all pages. Takes no props.
 */
const NavBar = (props) => {
  return (
    <nav
      className="fixed top-0 left-0 right-0 bg-white/100 shadow-sm z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            {/* <div className="text-2xl font-bold text-stylesnap-gray hover:text-stylesnap-pink transition-colors">
              StyleSnap
            </div> */}
            <img src="/logo2.png" alt="logo" className="h-10 w-auto" />
            <Link
              to="/"
              className="px-3 py-2 rounded-md text-sm font-medium text-stylesnap-gray hover:text-stylesnap-pink hover:bg-stylesnap-softGray transition-colors"
            >
              Fashboard
            </Link>
            {props.userId && (
              <Link
                to={`/saved/${props.userId}`}
                className="px-3 py-2 rounded-md text-sm font-medium text-stylesnap-gray hover:text-stylesnap-pink hover:bg-stylesnap-softGray transition-colors"
              >
                Saved Fits
              </Link>
            )}
            {props.userId && (
              <Link
                to={`/profile/${props.userId}`}
                className="px-3 py-2 rounded-md text-sm font-medium text-stylesnap-gray hover:text-stylesnap-pink hover:bg-stylesnap-softGray transition-colors"
              >
                Profile
              </Link>
            )}
          </div>

          {props.userId ? (
            <button
              className="px-3 py-2 rounded-md text-sm font-medium text-stylesnap-gray hover:text-stylesnap-pink hover:bg-stylesnap-softGray transition-colors"
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
      </div>
    </nav>
  );
};

export default NavBar;

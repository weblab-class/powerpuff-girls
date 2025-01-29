import React from "react";
import { Link, NavLink } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import "../../tailwind.css";

/**
 * The navigation bar at the top of all pages. Takes no props.
 */
const NavBar = (props) => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/100 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <img src="/logo2.png" alt="logo" className="h-10 w-auto" />
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[#936ff7] bg-[#936ff7]/10"
                    : "text-stylesnap-gray hover:text-[#936ff7] hover:bg-[#936ff7]/5"
                }`
              }
            >
              Fashboard
            </NavLink>
            {props.userId && (
              <NavLink
                to={`/saved/${props.userId}`}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#936ff7] bg-[#936ff7]/10"
                      : "text-stylesnap-gray hover:text-[#936ff7] hover:bg-[#936ff7]/5"
                  }`
                }
              >
                Saved Fits
              </NavLink>
            )}
            {props.userId && (
              <NavLink
                to={`/myfits/${props.userId}`}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#936ff7] bg-[#936ff7]/10"
                      : "text-stylesnap-gray hover:text-[#936ff7] hover:bg-[#936ff7]/5"
                  }`
                }
              >
                My Fits
              </NavLink>
            )}
            {props.userId && (
              <NavLink
                to={`/profile/${props.userId}`}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#936ff7] bg-[#936ff7]/10"
                      : "text-stylesnap-gray hover:text-[#936ff7] hover:bg-[#936ff7]/5"
                  }`
                }
              >
                Profile
              </NavLink>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {props.userId ? (
              <button
                onClick={props.handleLogout}
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-[#936ff7] hover:bg-[#b79eff] transition-all duration-300 ease-in-out hover:transform hover:scale-[1.02]"
              >
                Logout
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
      </div>
    </nav>
  );
};

export default NavBar;

import React, { useState, useEffect } from "react";

import NavBar from "./modules/NavBar";

import { socket } from "../client-socket";

import { get, post } from "../utilities";

import { Outlet } from "react-router-dom";

// to use styles, import the necessary CSS files
import "../utilities.css";
import "./App.css";
import "../index.css";
import "../tailwind.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

/**
 * Define the "App" component as a function.
 */
const App = () => {
  const [userId, setUserId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false); // Whether music is playing or not
  const [audio] = useState(new Audio("/peppy_fash.mp3")); // Path to your MP3 file


  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        setUserId(user._id);
      }
    });
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio]);

  const toggleMusic = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleLogin = (res) => {
    const userToken = res.credential;
    post("/api/login", { token: userToken }).then((user) => {
      // the server knows we're logged in now
      setUserId(user._id);
      console.log(user);
    });
  };

  const handleLogout = () => {
    console.log("Logged out successfully!");
    setUserId(null);
    post("/api/logout");
  };

  // required method: whatever is returned defines what
  // shows up on screen
  return (
    // <> is like a <div>, but won't show
    // up in the DOM tree
    <MantineProvider>
      <Notifications />
      <NavBar
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        userId={userId}
      />
      <div style={{
        backgroundImage: `url('/purple.gif')`, // Or '/background.jpg' if in public
        backgroundSize: 'cover', // Ensures the image covers the whole area
        backgroundPosition: 'center', // Centers the image
        backgroundRepeat: 'no-repeat', // Prevents tiling
        minHeight: '100vh', // Full viewport height
        minWidth: '100vw', // Full viewport width
        margin: 0,
        padding: 80,
      }} className="App-container">
        <Outlet context={{ userId: userId }} />
      </div>
      <div
            className="fixed bottom-2 right-2 p-2 bg-[#936ff7] hover:bg-[#b79eff] rounded-full shadow-lg cursor-pointer flex items-center justify-center transition-all duration-300 ease-in-out hover:transform hover:scale-[1.02]"
            onClick={toggleMusic}
          >
            <i
              className={`fa-solid ${
                isPlaying ? "fa-volume-high" : "fa-volume-xmark"
              } text-white text-1xl`}
            />
          </div>
    </MantineProvider>
  );
};

export default App;

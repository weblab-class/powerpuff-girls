import React, { useState, useEffect } from "react";

import Card from "../modules/Card";
import { NewStory } from "../modules/NewPostInput";
import { SearchFeed } from "../modules/SearchBar";
import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ImageWithLoading from "../modules/ImageWithLoading";

import { get, post } from "../../utilities";
import "../../tailwind.css";
import "./Feed.css";

const Saved = () => {
  let navigate = useNavigate();
  let props = useOutletContext();
  const [stories, setStories] = useState([]);
  const [filterStories, setFilterStories] = useState([]);
  const [base64Image, setBase64Image] = useState();
  //const [popUp, setPopUp] = useState(-1); //-1 means nothing, otherwise give index of card

  const [isPlaying, setIsPlaying] = useState(false); // Whether music is playing or not
  const [audio] = useState(new Audio("/peppy_fash.mp3")); // Path to your MP3 file

  // called when the "Feed" component "mounts", i.e.
  // when it shows up on screen
  useEffect(() => {
    document.title = "My Saved Fits";
    get("/api/stories").then((storyObjs) => {
      get("/api/getAllSaved").then((savedObjs) => {
        const savedStoryIds = savedObjs.map((saveObj) => saveObj.parent);
        const filteredStoryObjs = storyObjs.filter((storyObj) => {
          return savedStoryIds.includes(storyObj._id);
        });
        let reversedStoryObjs = filteredStoryObjs.reverse();
        setStories(reversedStoryObjs);
        setFilterStories(reversedStoryObjs);
      });
      return () => {
        audio.pause();
        audio.currentTime = 0;
      };
    });
  }, [audio]);

  const toggleMusic = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    get("/api/whoami").then((user) => {
      if (
        user == null ||
        (typeof user === "object" && Object.keys(user).length === 0)
      ) {
        //logged out probably
        navigate("/");
      }
    });
  }, [props.userId]);

  useEffect(() => {
    if (stories.length > 0) {
      const image_urls =
        stories.map(
          (storyObj) =>
            `https://res.cloudinary.com/stylesnap/image/upload/w_300,h_600,c_fill/${storyObj.publicId}`
        ) || [];
      console.log("client side image urls is ", image_urls);

      post("/api/imageprocess", { image_urls }).then((paletteString) => {
        console.log("post request worked yay");
        console.log(paletteString.paletteBase64);
        setBase64Image(paletteString.paletteBase64);
      });
    }
  }, [stories]); // This effect runs every time `stories` is updated

  // this gets called when the user pushes "Submit", so their
  // post gets added to the screen right away
  const addNewStory = (storyObj) => {
    setStories([storyObj].concat(stories));
  };

  let storiesList = null;
  if (filterStories.length !== 0) {
    storiesList = filterStories.map((storyObj) => (
      <button onClick={() => navigate(`/post/${storyObj._id}`)}>
        <Card
          key={`Card_${storyObj._id}`}
          _id={storyObj._id}
          creator_name={storyObj.creator_name}
          creator_id={storyObj.creator_id}
          userId={props.userId}
          content={storyObj.content}
          publicId={storyObj.publicId}
          alt={storyObj.alt}
          tags={storyObj.tags}
          showComments={false}
          handleDelete={() => {
            setStories((oldStories) => {
              return oldStories.filter((story) => story._id !== storyObj._id);
            });
            setFilterStories((oldStories) => {
              return oldStories.filter((story) => story._id !== storyObj._id);
            });
            console.log("deleting story");
          }}
        />
      </button>
    ));
  } else {
    storiesList = (
      <div className="col-span-full flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-4">📸</div>
        <h2 className="text-3xl font-bold text-[#8B6EE3] mb-2">
          Nothing Saved Yet!
        </h2>
        <p className="text-gray-500 text-lg">
          Start exploring and save some amazing fits!
        </p>
        <Link
          to="/"
          className="mt-6 px-8 py-3 bg-[#8B6EE3] text-white rounded-sm hover:bg-[#7B5ED3] transition-colors duration-200"
        >
          Explore Fits
        </Link>
      </div>
    );
  }
  return (
    <>
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {storiesList}
        </div>
        {filterStories.length > 0 && (
          <ImageWithLoading base64Image={base64Image} />
        )}
        <div
          className="fixed bottom-2 right-2 p-2 bg-[#8B6EE3] rounded-full shadow-lg cursor-pointer flex items-center justify-center hover:bg-[#7B5ED3] transition-colors duration-200"
          onClick={toggleMusic}
        >
          <i
            className={`fa-solid ${
              isPlaying ? "fa-volume-high" : "fa-volume-xmark"
            } text-white text-1xl`}
          />
        </div>
      </div>
    </>
  );
};

export default Saved;

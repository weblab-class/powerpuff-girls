import "@fortawesome/fontawesome-free/css/all.min.css";
import React, { useState, useEffect } from "react";
import Card from "../modules/Card";
import { NewStory } from "../modules/NewPostInput";
import { SearchFeed } from "../modules/SearchBar";
import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { get } from "../../utilities";
import "../../tailwind.css";
import "./Feed.css";

const Feed = () => {
  let navigate = useNavigate();
  let props = useOutletContext();
  const [stories, setStories] = useState([]);
  const [filterStories, setFilterStories] = useState([]);
  const [showing, setShowing] = useState(0);
  const [popUp, setPopUp] = useState(-1); //-1 means nothing, otherwise give index of card

  // Music player states
  const [isPlaying, setIsPlaying] = useState(false); // Whether music is playing or not
  const [audio] = useState(new Audio('/ambient_background.mp3')); // Path to your MP3 file

  useEffect(() => {
    document.title = "Fashion Feed";
    get("/api/stories").then((storyObjs) => {
      let reversedStoryObjs = storyObjs.reverse();
      setStories(reversedStoryObjs);
      setFilterStories(reversedStoryObjs);
    });
    setShowing(0);

    // Clean up the audio instance when the component unmounts
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio]);

  const addNewStory = (storyObj) => {
    setStories([storyObj].concat(stories));
  };

  const filterFeed = (query) => {
    if (query === "") {
      setFilterStories(stories);
      setShowing(0);
    } else {
      let filteredCards = stories.filter((storyObj) =>
        storyObj.content.toLowerCase().includes(query.toLowerCase())
      );
      setFilterStories(filteredCards);
      setShowing(0);
    }
  };

  const clearSearch = () => {
    setFilterStories(stories);
    setShowing(0);
  };

  const goRight = () => {
    if (showing * 4 + 4 <= filterStories.length - 1) {
      setShowing(showing + 1);
    }
  };

  const goLeft = () => {
    if (showing * 4 - 4 >= 0) {
      setShowing(showing - 1);
    }
  };

  const toggleMusic = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  let storiesList = null;
  if (filterStories.length !== 0) {
    let fourStories = filterStories.slice(
      showing * 4,
      Math.min(showing * 4 + 4, filterStories.length)
    );
    storiesList = fourStories.map((storyObj) => (
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
          showComments={false}
        />
      </button>
    ));
  } else if (filterStories.length === 0 && stories.length !== 0) {
    storiesList = <div>Nothing matches your search...</div>;
  } else {
    storiesList = <div>Nothing in your feed!</div>;
  }

  return (
    <>
      <div className="container mx-auto px-4 pt-24 pb-12">
        <SearchFeed
          filterFeed={filterFeed}
          className="w-full pl-12 pr-4 py-3 text-lg bg-white border-stylesnap-beige focus:border-stylesnap-pink transition-colors"
        />
        <button
          className="bg-custom-clear-search-gray hover:bg-blue-500 text-white font-bold py-1 px-2 rounded mt-4 mb-4"
          onClick={clearSearch}
        >
          Clear Search
        </button>

        <div>
          <button onClick={goLeft} className="arrow-button arrow-left"></button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {storiesList}
          </div>
          <button onClick={goRight} className="arrow-button arrow-right"></button>
        </div>

        {/* Music Toggle Button */}
        <div
          className="fixed bottom-2 right-2 p-2 bg-blue-500 rounded-full shadow-lg cursor-pointer flex items-center justify-center"
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

export default Feed;

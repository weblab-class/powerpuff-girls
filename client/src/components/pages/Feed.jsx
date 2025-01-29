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
import { GrNext, GrPrevious } from "react-icons/gr";

const Feed = () => {
  let navigate = useNavigate();
  let props = useOutletContext();
  const [stories, setStories] = useState([]);
  const [filterStories, setFilterStories] = useState([]);
  const [showing, setShowing] = useState(0);
  const [popUp, setPopUp] = useState(-1); //-1 means nothing, otherwise give index of card

  useEffect(() => {
    document.title = "Fashion Feed";
    get("/api/stories").then((storyObjs) => {
      let reversedStoryObjs = storyObjs.reverse();
      setStories(reversedStoryObjs);
      setFilterStories(reversedStoryObjs);
    });
    setShowing(0);

    // Clean up the audio instance when the component unmounts
  }, []);

  const addNewStory = (storyObj) => {
    setStories([storyObj].concat(stories));
  };

  const filterFeed = (query) => {
    if (query === "") {
      setFilterStories(stories);
      setShowing(0);
    } else {
      let filteredCards = stories.filter(
        (storyObj) =>
          storyObj.content.toLowerCase().includes(query.toLowerCase()) ||
          storyObj.creator_name.toLowerCase().includes(query.toLowerCase()) ||
          storyObj.tags.some((str) => str.toLowerCase() === query.toLowerCase())
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

  let storiesList = null;
  if (filterStories.length !== 0) {
    let fourStories = filterStories.slice(
      showing * 4,
      Math.min(showing * 4 + 4, filterStories.length)
    );
    storiesList = fourStories.map((storyObj) => (
      <div>
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
          // handleDelete={() => {
          //   setStories((oldStories) => {
          //     return oldStories.filter((story) => story._id !== storyObj._id);
          //   });
          //   setFilterStories((oldStories) => {
          //     return oldStories.filter((story) => story._id !== storyObj._id);
          //   });
          //   console.log("deleting story");
          // }}
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
      </div>
    ));
  } else if (filterStories.length === 0 && stories.length !== 0) {
    storiesList = <div>Nothing matches your search...</div>;
  } else {
    storiesList = <div>Nothing in your feed!</div>;
  }

  return (
    <>
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <SearchFeed
            filterFeed={filterFeed}
            clearSearch={clearSearch}
            className="w-full px-6 py-3 text-lg bg-white border-2 border-stylesnap-beige rounded-full focus:outline-none focus:border-stylesnap-pink focus:ring-2 focus:ring-stylesnap-pink/20 transition-all duration-200 shadow-sm hover:shadow-md placeholder-gray-400"
          />
        </div>

        <div className="flex justify-center items-center relative">
          {/* Left Arrow */}
          <button
            onClick={goLeft}
            className="arrow-button arrow-left absolute left-[-40px] top-1/2"
          >
            <GrPrevious color="white" size={15} />
          </button>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {storiesList}
          </div>

          {/* Right Arrow */}
          <button
            onClick={goRight}
            className="arrow-button arrow-left absolute right-[-40px] top-1/2"
          >
            <GrNext color="white" size={15} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Feed;

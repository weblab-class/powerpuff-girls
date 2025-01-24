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

const Saved = () => {
  let navigate = useNavigate();
  let props = useOutletContext();
  const [stories, setStories] = useState([]);
  const [filterStories, setFilterStories] = useState([]);
  const [popUp, setPopUp] = useState(-1); //-1 means nothing, otherwise give index of card

  // called when the "Feed" component "mounts", i.e.
  // when it shows up on screen
  useEffect(() => {
    document.title = "Fashion Feed";
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
    });
  }, []);

  // this gets called when the user pushes "Submit", so their
  // post gets added to the screen right away
  const addNewStory = (storyObj) => {
    setStories([storyObj].concat(stories));
  };

  /*const filterFeed = (query) => {
    if (query === "") {
      setFilterStories(stories);
      setShowing(0);
    } else {
      let filteredCards = stories.filter(
        (storyObj) =>
          storyObj.content.toLowerCase().includes(query.toLowerCase())
        //rn it only looks in caption, but can easily modify this to make it searchable by tag
        //or by user or something
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
  };*/

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
        />
      </button>
    ));
  } else {
    storiesList = <div>Nothing Saved!</div>;
  }
  return (
    <>
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {storiesList}
          </div>
        </div>
      </div>
    </>
  );
};

export default Saved;

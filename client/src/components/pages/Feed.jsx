import React, { useState, useEffect } from "react";

import Card from "../modules/Card";
import { NewStory } from "../modules/NewPostInput";
import { SearchFeed } from "../modules/SearchBar";
import { useOutletContext } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { get } from "../../utilities";
import "./Feed.css";

const Feed = () => {
  let props = useOutletContext();
  const [stories, setStories] = useState([]);
  const [filterStories, setFilterStories] = useState([]);
  const [showing, setShowing] = useState(0);
  const [popUp, setPopUp] = useState(-1); //-1 means nothing, otherwise give index of card

  // called when the "Feed" component "mounts", i.e.
  // when it shows up on screen
  useEffect(() => {
    document.title = "Fashion Feed";
    get("/api/stories").then((storyObjs) => {
      let reversedStoryObjs = storyObjs.reverse();
      setStories(reversedStoryObjs);
      setFilterStories(reversedStoryObjs);
    });
    setShowing(0);
  }, []);

  // this gets called when the user pushes "Submit", so their
  // post gets added to the screen right away
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
  };

  let storiesList = null;
  if (filterStories.length !== 0) {
    console.log(filterStories);
    let fourStories = filterStories.slice(
      showing * 4,
      Math.min(showing * 4 + 4, filterStories.length)
    );
    storiesList = fourStories.map((storyObj) => (
      <div>
        <Link to={`/post/${storyObj._id}`}>
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
        </Link>
      </div>
    ));
  } else if (filterStories.length === 0 && stories.length !== 0) {
    console.log(filterStories);
    storiesList = <div>Nothing matches your search...</div>;
  } else {
    storiesList = <div>Nothing in your feed!</div>;
  }
  return (
    <>
      {/*props.userId && <NewStory addNewStory={addNewStory} />*/}
      {<SearchFeed filterFeed={filterFeed} />}
      <button onClick={clearSearch}>Clear search</button>

      <div className="horizontal-spread">
        <button onClick={goLeft} className="arrow-button"></button>
        <div className="horizontal-spread">{storiesList}</div>
        <button onClick={goRight} className="arrow-button"></button>
      </div>
    </>
  );
};

export default Feed;

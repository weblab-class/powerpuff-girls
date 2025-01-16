import React, { useState, useEffect } from "react";
import Card from "../modules/Card";
import { NewStory } from "../modules/NewPostInput";
import { useOutletContext } from "react-router-dom";

import { get } from "../../utilities";
import "./Feed.css";

const Feed = () => {
  let props = useOutletContext();
  const [stories, setStories] = useState([]);
  const [showing, setShowing] = useState(0);

  // called when the "Feed" component "mounts", i.e.
  // when it shows up on screen
  useEffect(() => {
    document.title = "News Feed";
    get("/api/stories").then((storyObjs) => {
      let reversedStoryObjs = storyObjs.reverse();
      setStories(reversedStoryObjs);
    });
  }, []);

  // this gets called when the user pushes "Submit", so their
  // post gets added to the screen right away
  const addNewStory = (storyObj) => {
    setStories([storyObj].concat(stories));
  };

  const goRight = () => {
    if (showing * 4 + 4 <= stories.length - 1) {
      setShowing(showing + 1);
    }
  };
  const goLeft = () => {
    if (showing * 4 - 4 >= 0) {
      setShowing(showing - 1);
    }
  };

  let storiesList = null;
  const hasStories = stories.length !== 0;
  if (hasStories) {
    let fourStories = stories.slice(
      showing * 4,
      Math.min(showing * 4 + 4, stories.length)
    );
    storiesList = fourStories.map((storyObj) => (
      <Card
        key={`Card_${storyObj._id}`}
        _id={storyObj._id}
        creator_name={storyObj.creator_name}
        creator_id={storyObj.creator_id}
        userId={props.userId}
        content={storyObj.content}
      />
    ));
  } else {
    storiesList = <div>Nothing in your feed!</div>;
  }
  return (
    <>
      {props.userId && <NewStory addNewStory={addNewStory} />}
      <div className="horizontal-spread">{storiesList}</div>

      <div>
        <span>
          <button onClick={goLeft}>Left</button>
        </span>
        <span>
          <button onClick={goRight}>Right</button>
        </span>
      </div>
    </>
  );
};

export default Feed;

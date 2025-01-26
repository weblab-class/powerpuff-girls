import React, { useState } from "react";
import { get, post } from "../../utilities";
import { useParams, useOutletContext } from "react-router-dom";
import { Button } from "../ui/button";
/**
 * New Post is a parent component for all input components
 *
 * Proptypes
 * @param {string} defaultText is the placeholder text
 * @param {string} storyId optional prop, used for comments
 * @param {({storyId, value}) => void} onSubmit: (function) triggered when this post is submitted, takes {storyId, value} as parameters
 */
const NewPostInput = (props) => {
  const [value, setValue] = useState("");

  // called whenever the user types in the new post input box
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  // called when the user hits "Submit" for a new post
  const handleSubmit = (event) => {
    event.preventDefault();
    props.onSubmit && props.onSubmit(value);
    setValue("");
  };

  return (
    <div className="u-flex">
      <input
        type="text"
        placeholder={props.defaultText}
        value={value}
        onChange={handleChange}
        className="NewPostInput-input"
      />
      <button
        type="submit"
        className="NewPostInput-button u-pointer"
        value="Submit"
        onClick={handleSubmit}
      >
        Search
      </button>
    </div>
  );
};

const SendFriendReq = (props) => {
  const search = (email) => {
    props.requestfunct(email);
  };
  return (
    <NewPostInput
      className="text-white"
      defaultText="Search friends by email..."
      onSubmit={search}
    />
  );
};

export { SendFriendReq };

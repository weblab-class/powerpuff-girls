import React, { useState } from "react";

import "./SearchBar.css";
import { post } from "../../utilities";

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
    <div className="text-right">
      <input
        type="text"
        placeholder={props.defaultText}
        value={value}
        onChange={handleChange}
        className="NewPostInput-input py-1.5"
      />
      <button
        type="submit"
        className="bg-purple-new hover:bg-purple-700 text-white font-bold py-1.5 px-3 rounded mb-2 u-pointer"
        value="Submit"
        onClick={handleSubmit}
      >
        Search
      </button>
    </div>
  );
};

const SearchFeed = (props) => {
  const search = (value) => {
    props.filterFeed(value);
  };
  return (
    <NewPostInput
      className="NewPostInput-input flex justify-end"
      defaultText="Search for your dream look..."
      onSubmit={search}
    />
  );
};

export { SearchFeed };

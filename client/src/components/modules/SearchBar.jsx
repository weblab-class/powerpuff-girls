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
    <div className="flex justify-end">
      <div className="w-2/5 flex">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={props.defaultText}
            value={value}
            onChange={handleChange}
            className="NewPostInput-input w-full"
          />
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={props.clearSearch}
          >
            ✕
          </button>
        </div>
        <button
          type="submit"
          className="bg-[#936ff7] hover:bg-[#b79eff] text-white font-bold px-6 transition-colors h-[36px]"
          value="Submit"
          onClick={handleSubmit}
        >
          Search
        </button>
      </div>
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
      clearSearch={props.clearSearch}
    />
  );
};

export { SearchFeed };

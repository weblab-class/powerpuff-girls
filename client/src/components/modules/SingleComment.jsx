import React from "react";
import { Link } from "react-router-dom";

/**
 * Component to render a single comment
 *
 * Proptypes
 * @param {string} _id of comment
 * @param {string} creator_name
 * @param {string} creator_id
 * @param {string} content of the comment
 */
const SingleComment = (props) => {
  return (
    <div className="flex flex-col space-y-1 p-2 rounded-md hover:bg-gray-50 transition-colors">
      <Link 
        to={`/profile/${props.creator_id}`} 
        className="text-sm font-medium text-stylesnap-pink hover:text-stylesnap-gray transition-colors"
      >
        {props.creator_name}
      </Link>
      <p className="text-sm text-stylesnap-gray">{props.content}</p>
    </div>
  );
};

export default SingleComment;

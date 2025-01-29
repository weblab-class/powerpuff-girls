import React from "react";
import SingleComment from "./SingleComment";
import { NewComment } from "./NewPostInput";

/**
 * Component that holds all the comments for a story
 *
 * Proptypes
 * @param {ContentObject[]} comments
 * @param {ContentObject} story
 */
const CommentsBlock = (props) => {
  return (
    <div className="w-full space-y-4">
      <div className="space-y-3">
        {props.comments.map((comment) => (
          <SingleComment
            key={`SingleComment_${comment._id}`}
            _id={comment._id}
            creator_name={comment.creator_name}
            creator_id={comment.creator_id}
            content={comment.content}
          />
        ))}
      </div>
      {props.userId && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <NewComment
            storyId={props.storyId}
            addNewComment={props.addNewComment}
          />
        </div>
      )}
    </div>
  );
};

export default CommentsBlock;
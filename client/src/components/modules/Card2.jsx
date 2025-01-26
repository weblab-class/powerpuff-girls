import React, { useState, useEffect } from "react";
import SingleStory from "./SingleStory";
import CommentsBlock from "./CommentsBlock";
import { get, post } from "../../utilities";
import CloudinaryImage from "./Image";
import { Bookmark } from "lucide-react";
import { Button } from "../ui/button";
import { CardUI, CardContent, CardFooter } from "../ui/card";
import { Link } from "react-router-dom";

/**
 * Card is a component for displaying content like stories
 *
 * Proptypes
 * @param {string} _id of the story
 * @param {string} creator_name
 * @param {string} creator_id
 * @param {string} content of the story
 */
const Card2 = (props) => {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    get("/api/comment", { parent: props._id }).then((comments) => {
      setComments(comments);
    });
    setShowComments(props.showComments);
  }, []);

  const addNewComment = (commentObj) => {
    setComments(comments.concat([commentObj]));
  };

  const [isBookmarked, setIsBookmarked] = useState(false);
  const handleBookmark = (event) => {
    event.stopPropagation();
    if (isBookmarked) {
      post("/api/deleteSave", { parent: props._id }).then(() => {
        setIsBookmarked(false);
      });
    } else {
      post("/api/save", { parent: props._id }).then((save) => {
        setIsBookmarked(true);
      });
    }
  };

  useEffect(() => {
    get("/api/isStorySaved", { parent: props._id }).then((saveObj) => {
      if (saveObj.isSaved) {
        setIsBookmarked(true);
      }
    });
  }, [props.userId]);

  return (
    <CardUI className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg animate-fadeIn">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Section: Image */}
        <div className="flex-1">
          <CardContent className="p-0 relative">
            <CloudinaryImage
              publicId={props.publicId}
              alt={props.alt}
              width={600} // Increased image size
              height={800}
              className="w-full h-auto rounded-lg"
            />
            {props.userId && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBookmark}
                className={`absolute top-2 right-2 text-white hover:text-stylesnap-pink bg-black/20 hover:bg-white/90 transition-colors ${
                  isBookmarked ? "text-stylesnap-pink" : ""
                }`}
              >
                <Bookmark
                  className="h-5 w-5"
                  fill={isBookmarked ? "currentColor" : "none"}
                />
              </Button>
            )}
          </CardContent>
        </div>

        {/* Right Section: Comments */}
        <div className="flex-1 lg:w-1/3 bg-white rounded-lg shadow-md p-4">
          <CardFooter className="flex flex-col items-start">
            <Link
              to={`/profile/${props.creator_id}`}
              className="u-bold text-sm font-medium text-stylesnap-pink hover:text-stylesnap-gray transition-colors"
            >
              {props.creator_name}
            </Link>
            <p className="text-sm text-stylesnap-gray mb-4">{props.content}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {Array.isArray(props.tags) &&
                props.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-stylesnap-softGray text-stylesnap-gray rounded-full"
                  >
                    {tag}
                  </span>
                ))}
            </div>
            {showComments && (
              <CommentsBlock
                comments={comments}
                creator_id={props.creator_id}
                userId={props.userId}
                addNewComment={addNewComment}
              />
            )}
          </CardFooter>
        </div>
      </div>
    </CardUI>
  );
};

export default Card2;
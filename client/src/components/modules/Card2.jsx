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
  const [showComments, setShowComments] = useState(true);

  useEffect(() => {
    get("/api/comment", { parent: props._id }).then((comments) => {
      setComments(comments);
    });
    setShowComments(props.showComments);
  }, []);

  const addNewComment = (commentObj) => {
    console.log("added new comment client side card2 component");
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
    <CardUI className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg animate-fadeIn rounded-none">
      <div className="flex flex-col lg:flex-row">
        {/* Left Section: Image */}
        <div className="flex-1">
          <CardContent className="p-0 relative">
            <div className="flex items-center justify-center p-4">
              <CloudinaryImage
                publicId={props.publicId}
                alt={props.alt}
                width={600}
                height={800}
                className="w-full h-auto"
              />
              {props.userId && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBookmark}
                  className={`absolute top-6 right-6 w-8 h-8 rounded-full text-black hover:text-stylesnap-pink bg-white/60 hover:bg-white/90 transition-colors ${
                    isBookmarked ? "text-stylesnap-pink" : ""
                  }`}
                >
                  <Bookmark
                    className="h-4 w-4"
                    fill={isBookmarked ? "currentColor" : "none"}
                  />
                </Button>
              )}
            </div>
          </CardContent>
        </div>

        {/* Right Section: Comments */}
        <div className="flex-1 lg:w-1/3 bg-white/90">
          <CardFooter className="flex flex-col items-start p-6">
            <Link
              to={`/profile/${props.creator_id}`}
              className="text-xl font-semibold text-stylesnap-pink hover:text-stylesnap-gray transition-colors mb-2"
            >
              {props.creator_name}
            </Link>
            <p className="text-lg text-stylesnap-gray mb-6 leading-relaxed">
              {props.content}
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {Array.isArray(props.tags) &&
                props.tags.map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="text-xs px-2 py-1 bg-stylesnap-softGray text-stylesnap-gray rounded-full"
                  >
                    {tag}
                  </span>
                ))}
            </div>
            <div className="text-sm">
              {showComments && (
                <CommentsBlock
                  comments={comments}
                  creator_id={props.creator_id}
                  userId={props.userId}
                  addNewComment={addNewComment}
                  storyId={props._id}
                />
              )}
            </div>
          </CardFooter>
        </div>
      </div>
    </CardUI>
  );
};

export default Card2;

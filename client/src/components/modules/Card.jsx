import React, { useState, useEffect } from "react";
import SingleStory from "./SingleStory";
import CommentsBlock from "./CommentsBlock";
import { get, post} from "../../utilities";
import CloudinaryImage from "./Image";
import { Bookmark, ClipboardSignatureIcon } from "lucide-react";
import { Button } from "../ui/button";
import { CardUI, CardContent, CardFooter } from "../ui/card";

/**
 * Card is a component for displaying content like stories
 *
 * Proptypes
 * @param {string} _id of the story
 * @param {string} creator_name
 * @param {string} creator_id
 * @param {string} content of the story
 */
const Card = (props) => {
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    get("/api/comment", { parent: props._id }).then((comments) => {
      setComments(comments);
    });
    setShowComments(props.showComments);
  }, []);

  // this gets called when the user pushes "Submit", so their
  // post gets added to the screen right away
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
      <CardContent className="p-0 relative">
        <CloudinaryImage
          publicId={props.publicId} // Replace with your Cloudinary image public ID
          alt={props.alt}
          width={300}
          height={600}
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
      <SingleStory
        _id={props._id}
        creator_name={props.creator_name}
        creator_id={props.creator_id}
        content={props.content}
        publicId={props.publicId}
        alt={props.alt}
      />
      {showComments && (
        <CommentsBlock
          story={props}
          comments={comments}
          creator_id={props.creator_id}
          userId={props.userId}
          addNewComment={addNewComment}
        />
      )}
    </CardUI>
  );
};

export default Card;

import React, { useState, useEffect } from "react";
import SingleStory from "./SingleStory";
import CommentsBlock from "./CommentsBlock";
import { get, post } from "../../utilities";
import CloudinaryImage from "./Image";
import { Bookmark, ClipboardSignatureIcon, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { CardUI, CardContent, CardFooter } from "../ui/card";
import { Link, useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";

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

  const navigate = useNavigate();

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

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = (event) => {
    event.stopPropagation();
    post("/api/deleteCard", { _id: props._id }).then(() => {
      props.handleDelete();
      notifications.show({
        title: "Post Deleted",
        message: "Successfully deleted post!",
      });
    });
  };

  useEffect(() => {
    get("/api/isStorySaved", { parent: props._id }).then((saveObj) => {
      if (saveObj.isSaved) {
        setIsBookmarked(true);
      }
    });
  }, [props.userId]);

  return (
    <button key={props._id} onClick={() => navigate(`/post/${props._id}`)}>
      <CardUI className="group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fadeIn w-[300px] rounded-none border-0 mb-2 border-b-4 border-b-stylesnap-pink">
        <CardContent className="p-0 relative">
          <div className="flex items-center justify-center mt-4">
            <CloudinaryImage
              publicId={props.publicId} // Replace with your Cloudinary image public ID
              alt={props.alt}
              width={268}
              height={360}
            />
          </div>
          <div className="absolute top-2 right-6 flex flex-col gap-2">
            {props.userId && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBookmark}
                className={`w-8 h-8 rounded-full text-black hover:text-stylesnap-pink bg-white/60 hover:bg-white/90 transition-colors ${
                  isBookmarked ? "text-stylesnap-pink" : ""
                }`}
              >
                <Bookmark
                  className="h-4 w-4"
                  fill={isBookmarked ? "currentColor" : "none"}
                />
              </Button>
            )}
            {props.userId === props.creator_id && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="w-8 h-8 rounded-full text-black hover:text-red-500 bg-white/60 hover:bg-white/90 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start h-[110px] p-4 bg-white/90 relative pb-4">
          <Link
            to={`/profile/${props.creator_id}`}
            className="u-bold text-sm font-medium text-stylesnap-pink hover:text-stylesnap-gray transition-colors"
          >
            {props.creator_name}
          </Link>
          <p className="text-sm text-stylesnap-gray mb-2">{props.content}</p>
          <div className="flex flex-wrap gap-2 max-h-[100px] overflow-hidden relative">
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
        </CardFooter>
      </CardUI>
    </button>
  );
};

export default Card;

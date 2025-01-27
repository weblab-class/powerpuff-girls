import React, { useState, useEffect } from "react";
import SingleStory from "./SingleStory";
import CommentsBlock from "./CommentsBlock";
import { get, post } from "../../utilities";
import CloudinaryImage from "./Image";
import { Bookmark, ClipboardSignatureIcon, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { CardUI, CardContent, CardFooter } from "../ui/card";
import { Link } from "react-router-dom";
import { useToast } from "../ui/use-toast";
/*import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";*/

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
        console.log("unbookmarked!");
      });
    } else {
      post("/api/save", { parent: props._id }).then((save) => {
        setIsBookmarked(true);
        console.log("bookmarked!");
      });
    }
  };

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const handleDelete = (event) => {
    event.stopPropagation();
    post("/api/deleteCard", { _id: props._id }).then(() => {
      console.log("deleting now xd");
      toast({
        title: "Post deleted",
        description: "Your post has been successfully deleted",
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
    <>
      {/*<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>*/}
      <CardUI className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg animate-fadeIn">
        <CardContent className="p-0 relative">
          <CloudinaryImage
            publicId={props.publicId} // Replace with your Cloudinary image public ID
            alt={props.alt}
            width={300}
            height={600}
          />
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            {props.userId && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBookmark}
                className={`text-white hover:text-stylesnap-pink bg-black/20 hover:bg-white/90 transition-colors ${
                  isBookmarked ? "text-stylesnap-pink" : ""
                }`}
              >
                <Bookmark
                  className="h-5 w-5"
                  fill={isBookmarked ? "currentColor" : "none"}
                />
              </Button>
            )}
            {props.userId === props.creator_id && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="text-white hover:text-red-500 bg-black/20 hover:bg-white/90 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start p-4 bg-white/90">
          <Link
            to={`/profile/${props.creator_id}`}
            className="u-bold text-sm font-medium text-stylesnap-pink hover:text-stylesnap-gray transition-colors"
          >
            {props.creator_name}
          </Link>
          <p className="text-sm text-stylesnap-gray mb-2">{props.content}</p>
          <div className="flex flex-wrap gap-2">
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
          {showComments && (
            <CommentsBlock
              comments={comments}
              creator_id={props.creator_id}
              userId={props.userId}
              addNewComment={addNewComment}
            />
          )}
        </CardFooter>
      </CardUI>
    </>
  );
};

export default Card;

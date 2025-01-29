import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { get } from "../../utilities";
import Card2 from "../modules/Card2";

import { useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";

import "../../tailwind.css";

const Postpage = () => {
  let props = useOutletContext();

  const { _id } = useParams();
  const [postcard, setPostcard] = useState({});

  useEffect(() => {
    document.title = "Post Page";
    get("/api/postpage", { _id: _id })
      .then((storyObj) => setPostcard(storyObj))
      .catch(console.log("this postcard no longer exists"));
    console.log("navigated to post page and retrieved story");
    // Clean up the audio instance when the component unmounts
  }, []);

  return (
    <>
      <div className="w-full mx-auto px-4 pt-24 pb-12">
        <div className="relative flex justify-center">
          {postcard && Object.keys(postcard).length > 0 ? (
            <Card2
              key={`Card2_${postcard._id}`}
              _id={postcard._id}
              creator_name={postcard.creator_name}
              creator_id={postcard.creator_id}
              userId={props.userId}
              content={postcard.content}
              publicId={postcard.publicId}
              alt={postcard.alt}
              showComments={true}
              tags={postcard.tags}
            />
          ) : (
            <div>Sorry, this post no longer exists!</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Postpage;

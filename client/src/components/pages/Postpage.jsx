import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { get } from "../../utilities";
import Card from "../modules/Card";

import { useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";

import "../../tailwind.css";
//import "../../index.css"

const Postpage = () => {
  let props = useOutletContext();

  const { _id } = useParams();
  const [postcard, setPostcard] = useState({});

  useEffect(() => {
    document.title = "Post Page";
    get("/api/postpage", { _id: _id }).then((storyObj) =>
      setPostcard(storyObj)
    );
    console.log("navigated to post page and retrieved story");
  }, []);

  return (
    <>
      <div className="container mx-auto px-4 pt-24 pb-12">
        <Link to="/">
          <button className="bg-red-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mb-4">
            Back to Feed
          </button>
        </Link>

        <Card
          key={`Card_${postcard._id}`}
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
      </div>
    </>
  );
};

export default Postpage;

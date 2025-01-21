import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { get } from "../../utilities";
import Card from "../modules/Card";

import { useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";

import "../../tailwind.css"
import "../../index.css"

const Postpage = () => {
  let props = useOutletContext();

  const { _id } = useParams();
  const [postcard, setPostcard] = useState({});

  useEffect(() => {
    document.title = "Post Page";
    get("/api/postpage", { _id: _id }).then((storyObj) =>
      setPostcard(storyObj)
    );
  }, []);

  return (
    <>
      <Link to="/">
        <button className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
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
      />
    </>
  );
};

export default Postpage;

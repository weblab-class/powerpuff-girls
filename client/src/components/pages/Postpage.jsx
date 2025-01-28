import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { get } from "../../utilities";
import Card2 from "../modules/Card2";

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
    get("/api/postpage", { _id: _id })
      .then((storyObj) => setPostcard(storyObj))
      .catch(console.log("this postcard no longer exists"));
    console.log("navigated to post page and retrieved story");
    // Clean up the audio instance when the component unmounts
  }, []);  


  return (
    <>
      <div className="container mx-auto px-4 pt-24 pb-12">
        <Link to="/">
          <button className="bg-red-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mb-4">
            Back to Feed
          </button>
        </Link>

        {/*postcard && (
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
        )*/}

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
    </>
  );
};

export default Postpage;

// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { get } from "../../utilities";
// import { useOutletContext } from "react-router-dom";
// import { Link } from "react-router-dom";

// import "../../tailwind.css";

// const Postpage = () => {
//   let props = useOutletContext();

//   const { _id } = useParams();
//   const [postcard, setPostcard] = useState({});

//   useEffect(() => {
//     document.title = "Post Page";
//     get("/api/postpage", { _id: _id }).then((storyObj) =>
//       setPostcard(storyObj)
//     );
//     console.log("navigated to post page and retrieved story");
//   }, []);

//   return (
//     <>
//       <div className="container mx-auto px-4 pt-24 pb-12">
//         <Link to="/">
//           <button className="bg-red-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mb-4">
//             Back to Feed
//           </button>
//         </Link>

//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Left Section: Image */}
//           <div className="flex-1">
//             {postcard.publicId ? (
//               <div className="bg-white p-4 rounded-lg shadow-lg">
//                 <img
//                   src={postcard.publicId} // Image source
//                   alt={postcard.alt || "Outfit"}
//                   className="w-full h-auto rounded-lg"
//                 />
//                 <h2 className="text-2xl font-bold mt-4">{postcard.creator_name}</h2>
//                 <p className="text-gray-700 mt-2">{postcard.content}</p>
//                 <div className="flex gap-2 mt-4">
//                   {postcard.tags?.map((tag, index) => (
//                     <span
//                       key={index}
//                       className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm"
//                     >
//                       #{tag}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             ) : (
//               <p className="text-gray-500">Loading image...</p>
//             )}
//           </div>

//           {/* Right Section: Comments */}
//           <div className="flex-1 lg:w-1/3">
//             <h2 className="text-xl font-bold mb-4">Comments</h2>
//             {postcard.comments && postcard.comments.length > 0 ? (
//               <ul className="space-y-4">
//                 {postcard.comments.map((comment, index) => (
//                   <li
//                     key={index}
//                     className="bg-gray-100 p-3 rounded-lg shadow-sm"
//                   >
//                     <p className="font-semibold">{comment.creator_name}</p>
//                     <p className="text-gray-700">{comment.text}</p>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-gray-500">No comments yet. Be the first to comment!</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Postpage;

import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities";
import { Link, useNavigate } from "react-router-dom";
import "../../tailwind.css";

//prop is userId, which person's list you want to display
//for all 3 of these lists
//requestedout will have a button to cancel request
//requestedin will have button to accept/reject
const FriendsList = (props) => {
  let rawFriendsList = props.user?.friends || [];

  if (rawFriendsList.length === 0) {
    console.log("mei you peng you");
    return <div>No friends yet</div>;
  } else {
    console.log("NONZERO FRIENDS");
    let friendsList = rawFriendsList.map((pairObj) => (
      <div key={pairObj.googleid} className="m-1 p-1">
        {pairObj.name}
      </div>
    ));
    return <div>{friendsList}</div>;
  }
};

const RequestedOutList = (props) => {
  let rawRequestedList = props.user?.requestedOut || [];

  const cancelRequest = (user1, user2) => {
    const body = { user1: user1, user2: user2 };
    post("/api/cancelreq", body); //user1 previously requested user2 but wants to cancel that
  };

  if (rawRequestedList.length === 0) {
    return <div className="m-1 p-1">No outgoing requests</div>;
  } else {
    let requestedList = rawRequestedList.map((pairObj) => (
      <div key={pairObj.googleid} className="m-1 p-1">
        <span>{pairObj.name}</span>
        <span>
          <button
            onClick={() => cancelRequest(props.user, pairObj)}
            className="bg-stylesnap-pink rounded-sm text-sm m-4 p-2 hover:bg-stylesnap-gray text-white"
          >
            Cancel request
          </button>
        </span>
      </div>
    ));
    return <div>{requestedList}</div>;
  }
};

const RequestedInList = (props) => {
  let rawPendingList = props.user?.requestedIn || [];

  const acceptRequest = (user1, user2) => {
    const body = { user1: user1, user2: user2 };
    post("/api/acceptreq", body);
  };

  const rejectRequest = (user1, user2) => {
    const body = { user1: user1, user2: user2 };
    post("/api/rejectreq", body);
  };

  if (rawPendingList.length === 0) {
    return <div className="m-1 p-1">No incoming requests</div>;
  } else {
    let pendingList = rawPendingList.map((pairObj) => (
      <div key={pairObj.googleid} className="m-1 p-1">
        <span className="flex space-x-4 items-center">
          <span className="flex-none">{pairObj.name}</span>
          <button
            onClick={() => acceptRequest(props.user, pairObj)}
            className="bg-stylesnap-pink rounded-sm text-sm m-1 p-2 hover:bg-stylesnap-gray text-white"
          >
            Accept
          </button>
          <button
            onClick={() => rejectRequest(props.user, pairObj)}
            className="bg-stylesnap-pink rounded-sm text-sm m-1 p-2 hover:bg-stylesnap-gray text-white"
          >
            Reject
          </button>
        </span>
      </div>
    ));
    return <div>{pendingList}</div>;
  }
};

export { FriendsList, RequestedInList, RequestedOutList };

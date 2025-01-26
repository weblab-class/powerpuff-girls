import React, { useState, useEffect } from "react";
import { get, post } from "../../utilities";

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
      <div key={pairObj.name}>{pairObj.name}</div>
    ));
    return <div>{friendsList}</div>;
  }
};

const RequestedOutList = (props) => {
  let rawRequestedList = props.user?.requestedOut || [];
  if (rawRequestedList.length === 0) {
    return <div>No outgoing friend requests</div>;
  } else {
    let requestedList = rawRequestedList.map((pairObj) => (
      <div key={pairObj.name}>
        <span>{pairObj.name}</span>
        <span>
          <button>Cancel request</button>
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

  if (rawPendingList.length === 0) {
    return <div>No pending friend requests</div>;
  } else {
    let pendingList = rawPendingList.map((pairObj) => (
      <div key={pairObj.name}>
        <span>{pairObj.name}</span>
        <span>
          <button onClick={() => acceptRequest(props.user, pairObj)}>
            Accept
          </button>
        </span>
        <span>
          <button>Reject</button>
        </span>
      </div>
    ));
    return <div>{pendingList}</div>;
  }
};

export { FriendsList, RequestedInList, RequestedOutList };

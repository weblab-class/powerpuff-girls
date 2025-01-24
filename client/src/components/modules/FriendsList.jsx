import React, { useState, useEffect } from "react";
import { get } from "../../utilities";

//prop is userId, which person's list you want to display
//for all 3 of these lists
//requestedout will have a button to cancel request
//requestedin will have button to accept/reject
const FriendsList = (props) => {
  let rawFriendsList = props.user?.friends || [];

  if (rawFriendsList.length === 0) {
    return <div>No friends yet</div>;
  } else {
    console.log("NONZERO FRIENDS");
    let friendsList = rawFriendsList.map((pairObj) => (
      <div>{pairObj.name}</div>
    ));
    return <div>{friendsList}</div>;
  }
};

const RequestedInList = (props) => {};

const RequestedOutList = (props) => {};

export { FriendsList, RequestedInList, RequestedOutList };

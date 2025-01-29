/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");
const { spawn } = require("child_process");

// import models so we can interact with the database
const Story = require("./models/story");
const Comment = require("./models/comment");
const User = require("./models/user");
const Message = require("./models/message");
const Save = require("./models/save");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

const socketManager = require("./server-socket");

router.get("/stories", (req, res) => {
  // empty selector means get all documents
  Story.find({}).then((stories) => res.send(stories));
});

router.get("/postpage", (req, res) => {
  Story.findById(req.query._id)
    .then((storyObj) => {
      res.send(storyObj);
    })
    .catch((err) => {
      res.status(500).send("Post not found");
    });
});

router.post("/story", auth.ensureLoggedIn, (req, res) => {
  const tags = req.body.tags.split(",");
  const trimmedTags = tags
    .map((tag) => tag.trim())
    .filter((item) => item.trim() !== "");

  const newStory = new Story({
    creator_id: req.user._id,
    creator_name: req.user.name,
    content: req.body.content,
    publicId: req.body.publicId,
    alt: req.body.content,
    tags: trimmedTags,
  });

  newStory.save().then((story) => res.send(story));
});

router.post("/deleteCard", auth.ensureLoggedIn, (req, res) => {
  Story.deleteOne({ _id: req.body._id }).then(() => {
    console.log(req.body._id);
    res.send({});
  });
});

router.post("/save", auth.ensureLoggedIn, (req, res) => {
  const newSave = new Save({
    creator_id: req.user._id,
    parent: req.body.parent,
  });
  newSave.save().then((save) => res.send(save));
});

router.post("/deleteSave", auth.ensureLoggedIn, (req, res) => {
  Save.deleteOne({ parent: req.body.parent, creator_id: req.user._id }).then(
    () => {
      console.log(req.body.parent);
      res.send({});
    }
  );
});

router.get("/getAllSaved", auth.ensureLoggedIn, (req, res) => {
  Save.find({ creator_id: req.user._id }).then((saves) => {
    res.send(saves);
  });
});

router.get("/isStorySaved", auth.ensureLoggedIn, (req, res) => {
  Save.findOne({ parent: req.query.parent, creator_id: req.user._id }).then(
    (save) => {
      if (save) res.send({ isSaved: true });
      else res.send({ isSaved: false });
    }
  );
});

router.get("/comment", (req, res) => {
  Comment.find({ parent: req.query.parent }).then((comments) => {
    res.send(comments);
  });
});

router.post("/comment", auth.ensureLoggedIn, (req, res) => {
  const newComment = new Comment({
    creator_id: req.user._id,
    creator_name: req.user.name,
    parent: req.body.parent,
    content: req.body.content,
  });

  newComment.save().then((comment) => res.send(comment));
});

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.get("/user", (req, res) => {
  User.findById(req.query.userid)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send("User Not");
    });
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  res.send({});
});

router.get("/chat", (req, res) => {
  const query = { "recipient._id": "ALL_CHAT" };
  Message.find(query).then((messages) => res.send(messages));
});

router.post("/message", auth.ensureLoggedIn, (req, res) => {
  console.log(
    `Received a chat message from ${req.user.name}: ${req.body.content}`
  );
  // insert this message into the database
  const message = new Message({
    recipient: req.body.recipient,
    sender: {
      _id: req.user._id,
      name: req.user.name,
    },
    content: req.body.content,
  });
  message.save();
  // TODO (step 0.1): emit to all clients that a message was received (1 line)
});

router.post("/requestout", auth.ensureLoggedIn, (req, res) => {
  const you = req.body.you;
  User.findOne({ email: req.body.email })
    .then((founduser) => {
      console.log("found them: ", founduser);

      User.updateOne(
        {
          email: you.email,
          "requestedOut.googleid": { $ne: founduser.googleid }, //no duplicates
          "friends.googleid": { $ne: founduser.googleid }, //not already friended
          "requestedIn.googleid": { $ne: founduser.googleid }, //you should accept their request instead
        },
        {
          $push: {
            requestedOut: {
              name: founduser.name,
              googleid: founduser.googleid,
            },
          },
        }
      ).catch((error) => {
        console.error("Error updating your requested out list:", error); // Handle errors
      });

      User.updateOne(
        {
          email: founduser.email,
          "requestedIn.googleid": { $ne: you.googleid },
          "friends.googleid": { $ne: you.googleid },
          "requestedOut.googleid": { $ne: you.googleid },
        },
        {
          $push: {
            requestedIn: {
              name: you.name,
              googleid: you.googleid,
            },
          },
        }
      ).catch((error) => {
        console.error("Error updating their requested in list:", error); // Handle errors
      });

      User.updateOne(
        {
          email: you.email,
          "requestedIn.googleid": founduser.googleid, // Ensure they are in the requestedIn list
        },
        {
          $pull: { requestedIn: { googleid: founduser.googleid } }, // Remove them from requestedIn
          $push: {
            friends: { name: founduser.name, googleid: founduser.googleid },
          }, // Add them to your friends
        }
      ).catch((error) => {
        console.error("Error updating the friends list:", error); // Handle errors
      });

      User.updateOne(
        {
          email: founduser.email,
          "requestedOut.googleid": you.googleid, // they requested you
        },
        {
          $pull: { requestedOut: { googleid: you.googleid } }, // Remove you from requestedOut
          $push: {
            friends: { name: you.name, googleid: you.googleid },
          }, // Add you to their friends
        }
      ).catch((error) => {
        console.error("Error updating the friends list:", error); // Handle errors
      });

      res.send(founduser);
    })
    .catch((error) => {
      console.log("Error finding user: ", error);
    });
});

router.post("/acceptreq", auth.ensureLoggedIn, (req, res) => {
  //user1 is accepting request from user2
  const you = req.body.user1; //type user object
  const founduser = req.body.user2; //keep in mind that user2 is actually not a user object here, it's a pair with name and googleid
  User.updateOne(
    {
      googleid: founduser.googleid,
      "requestedOut.googleid": you.googleid, // they requested you
    },
    {
      $pull: { requestedOut: { googleid: you.googleid } }, // Remove you from requestedOut
      $push: {
        friends: { name: you.name, googleid: you.googleid },
      }, // Add you to their friends
    }
  ).catch((error) => {
    console.error("Error updating the friends list:", error); // Handle errors
  });

  User.updateOne(
    {
      googleid: you.googleid,
      "requestedIn.googleid": founduser.googleid, // they requested you
    },
    {
      $pull: { requestedIn: { googleid: founduser.googleid } }, // Remove them from requestedIn
      $push: {
        friends: { name: founduser.name, googleid: founduser.googleid },
      }, // Add you to their friends
    }
  ).catch((error) => {
    console.log("error friending user");
  });
  res.send(founduser);
});

router.post("/rejectreq", auth.ensureLoggedIn, (req, res) => {
  //user1 is rejecting request from user2
  const you = req.body.user1; //type user object
  const founduser = req.body.user2; //keep in mind that user2 is actually not a user object here, it's a pair with name and googleid
  User.updateOne(
    {
      googleid: founduser.googleid,
      "requestedOut.googleid": you.googleid, // they requested you
    },
    {
      $pull: { requestedOut: { googleid: you.googleid } }, // Remove you from requestedOut
    }
  ).catch((error) => {
    console.error("Error rejecting friend req:", error); // Handle errors
  });

  User.updateOne(
    {
      googleid: you.googleid,
      "requestedIn.googleid": founduser.googleid, // they requested you
    },
    {
      $pull: { requestedIn: { googleid: founduser.googleid } }, // Remove them from requestedIn
    }
  ).catch((error) => {
    console.log("error rejecting friend req");
  });
  res.send(founduser);
});

router.post("/cancelreq", auth.ensureLoggedIn, (req, res) => {
  //user1 is canceling request to user2
  const you = req.body.user1; //type user object
  const founduser = req.body.user2; //keep in mind that user2 is actually not a user object here, it's a pair with name and googleid
  User.updateOne(
    {
      googleid: founduser.googleid,
      "requestedIn.googleid": you.googleid, // you requested them
    },
    {
      $pull: { requestedIn: { googleid: you.googleid } }, // Remove you from requestedIn
    }
  ).catch((error) => {
    console.error("Error rejecting friend req:", error); // Handle errors
  });

  User.updateOne(
    {
      googleid: you.googleid,
      "requestedOut.googleid": founduser.googleid,
    },
    {
      $pull: { requestedOut: { googleid: founduser.googleid } }, // Remove them from requestedOut
    }
  ).catch((error) => {
    console.log("error rejecting friend req");
  });
  res.send(founduser);
});

router.post("/imageprocess", (req, res) => {
  console.log("inside api endpoint");
  const path = require("path");
  const scriptPath = path.join(__dirname, "clothessegment.py");

  const args = req.body.image_urls;
  console.log("IMAGE URLS PASSED IN", args);
  /*const venvPath = "../.venv/bin/activate";
  const child = spawn("../.venv/bin/python", [scriptPath, ...(args || [])], {
    env: {
      ...process.env,
      PATH: `${venvPath}:${process.env.PATH}`,
    },
  });*/

  const venvBinPath = path.join(__dirname, "../.venv/bin");
  const pythonPath = path.join(venvBinPath, "python");
  console.log("pythonPath is ", pythonPath);
  console.log(
    "PATH name becomes this ",
    `${venvBinPath}${path.delimiter}${process.env.PATH}`
  );
  const child = spawn(pythonPath, [scriptPath, ...(args || [])], {
    env: {
      ...process.env,
      PATH: `${venvBinPath}${path.delimiter}${process.env.PATH}`,
    },
  });

  /*const venvPath = path.join(__dirname, "../.venv/bin/activate"); // Adjust this path if necessary
  const child = spawn("bash", [
    "-c",
    `source ${venvPath} && python ${scriptPath} ${args.join(" ")}`,
  ]);*/

  let output = "";

  child.stdout.on("data", (data) => {
    output += data.toString();
  });

  child.stderr.on("data", (err) => {
    console.error("Python error:", err.toString());
  });

  child.on("error", (error) => {
    console.error("Failed to start Python process:", error.message);
    res.status(500).send("Failed to execute Python script.");
  });

  child.on("close", (code) => {
    if (code === 0) {
      // Send the base64-encoded image back to the client
      console.log("output is this: ", output);
      res.status(200).json({
        message: "Python script finished successfully",
        paletteBase64: output,
      });
    } else {
      res.status(500).send(`Python script exited with code ${code}`);
    }
  });
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;

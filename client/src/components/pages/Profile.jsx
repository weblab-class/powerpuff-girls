import React, { useState, useEffect, useRef } from "react";
import { get, post } from "../../utilities";
import { useParams, useOutletContext } from "react-router-dom";
import { SendFriendReq } from "../modules/SendFriendReq";
import {
  FriendsList,
  RequestedOutList,
  RequestedInList,
} from "../modules/FriendsList";

import { Button } from "../ui/button";
import { CardUI, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Upload, Users } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { Form, FormField, FormItem, FormControl } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import * as z from "zod";
import "../../tailwind.css";

const formSchema = z.object({
  caption: z.string().min(1, "Caption is required"),
  tags: z.string(),
  image: z.any(),
});

const Profile = () => {
  let props = useParams(); //userId tells you whose profile page based on specific url
  let outletProps = useOutletContext(); //userId tells you who's logged in rn
  const [user, setUser] = useState();
  const [userUpdate, setUserUpdate] = useState(0);
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); // Whether music is playing or not
  const [audio] = useState(new Audio("/peppy_fash.mp3")); // Path to your MP3 file

  useEffect(() => {
    document.title = "Profile Page";
    get(`/api/user`, { userid: props.userId }).then((userObj) =>
      setUser(userObj)
    );
  }, [props.userId, outletProps.userId, userUpdate]); //this is really scuffed but putting user here and constantly rendering it
  //temporary fix for why userUpdate doesn't really trigger rerenders

  const handleUserUpdate = () => {
    setUserUpdate((prev) => prev + 1);
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      caption: "",
      tags: "",
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      handleFileChange({ target: { files: dataTransfer.files } });
    }
  };

  const uploadImage = async (file, caption, tags) => {
    console.log("got in here at all yay");
    const uploadPreset = "card-resize"; // Replace with the unsigned upload preset name

    const formData = new FormData();
    formData.append("file", file); // The file you want to upload
    formData.append("upload_preset", uploadPreset); // The unsigned preset

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/stylesnap/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json(); // The uploaded image info
        console.log("Upload successful:", data);
        const body = { content: caption, publicId: data.public_id, tags };
        post("/api/story", body);
        return data; // The image's URL and other information
      } else {
        console.error("Upload failed:", response.status, response.statusText);
        const responseBody = await response.text();
        console.log("Response body:", responseBody);
      }
    } catch (error) {
      console.error("Error during upload:", error);
    }
  };

  const onSubmit = async (values) => {
    if (!previewUrl) {
      notifications.show({
        title: "Error",
        description: "Please select an image to upload",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically upload to a backend service
    console.log(previewUrl);
    console.log(values);
    uploadImage(previewUrl, values.caption, values.tags);

    notifications.show({
      title: "Post created",
      message: "Successfully uploaded fit!",
    });

    // Reset the form
    form.reset();
    setPreviewUrl(null);
  };

  const requestfunct = (email) => {
    console.log("client post endpoint in profile.jsx");
    const body = { email: email, you: user }; //only when you're logged in though
    post("/api/requestout", body);
  };

  if (!user) {
    return <div> Loading!</div>;
  }
  return (
    <div className="min-h-[95vh] max-w-[90%] mx-auto bg-white">
      <main className="container mx-auto px-0.5 pt-10 pb-4">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="flex items-center justify-between mb-6 bg-[#8B6EE3] p-6 shadow-lg transform hover:scale-[1.02] transition-all duration-300">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {user.name}
              </h1>
              <div className="flex items-center space-x-4">
                <span className="flex items-center px-4 py-2 bg-white/10 text-white hover:bg-white/20 transition-colors">
                  <Users className="inline-block mr-2 h-5 w-5" />
                  {user.friends.length} friends
                </span>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <Tabs
            selectedIndex={tabIndex}
            onSelect={(index) => setTabIndex(index)}
            className="shadow-sm"
          >
            <TabList className="flex border-b-2 border-[#8B6EE3]/20 mb-6">
              {outletProps.userId === props.userId && (
                <Tab
                  className={`px-8 py-3 text-base font-medium transition-colors duration-200 ${
                    tabIndex === 0
                      ? "bg-[#8B6EE3] text-white"
                      : "text-gray-500 hover:text-[#8B6EE3] hover:bg-[#8B6EE3]/5"
                  }`}
                >
                  Upload New Fit
                </Tab>
              )}
              <Tab
                className={`px-8 py-3 text-base font-medium transition-colors duration-200 ${
                  tabIndex === (outletProps.userId === props.userId ? 1 : 0)
                    ? "bg-[#8B6EE3] text-white"
                    : "text-gray-500 hover:text-[#8B6EE3] hover:bg-[#8B6EE3]/5"
                }`}
              >
                Friends
              </Tab>
            </TabList>

            <div className="py-6">
              {outletProps.userId === props.userId && (
                <TabPanel>
                  <div>
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold text-[#7158b9] mb-4">
                        Upload a New Fit
                      </h2>
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="space-y-4"
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                          <div
                            className={`border-2 border-dashed border-[#8B6EE3] p-8 text-center transition-all duration-300 hover:border-[#7B5ED3] cursor-pointer ${
                              previewUrl
                                ? "bg-[#8B6EE3]/5"
                                : "hover:bg-[#8B6EE3]/5"
                            }`}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            {previewUrl ? (
                              <div className="relative group">
                                <img
                                  src={previewUrl}
                                  alt="Preview"
                                  className="max-h-64 mx-auto shadow-md group-hover:opacity-90 transition-opacity"
                                />
                                <p className="text-sm text-[#7B5ED3] mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  Click to change image
                                </p>
                              </div>
                            ) : (
                              <>
                                <Upload className="mx-auto h-12 w-12 text-[#8B6EE3] mb-2" />
                                <p className="text-sm text-[#7B5ED3]">
                                  Drag and drop your photo here, or click to
                                  browse
                                </p>
                              </>
                            )}
                          </div>

                          <FormField
                            control={form.control}
                            name="caption"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder="Add a caption..."
                                    className="border-[#8B6EE3] focus:border-[#7B5ED3] px-4 py-2 bg-white/80"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Textarea
                                    placeholder="Add tags (separated by commas)..."
                                    className="border-[#8B6EE3] focus:border-[#7B5ED3] px-4 py-2 bg-white/80"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-[#8B6EE3] to-[#7B5ED3] hover:from-[#7B5ED3] hover:to-[#8B6EE3] text-white py-2 transition-all duration-300 transform hover:scale-[1.02]"
                          >
                            Post Fit
                          </Button>
                        </form>
                      </Form>
                    </div>
                  </div>
                </TabPanel>
              )}

              <TabPanel>
                <div className="grid grid-cols-3 gap-4">
                  <div className="w-full p-4 bg-white/80 border border-[#8B6EE3]/20 shadow-sm hover:shadow-md transition-shadow">
                    <div className="font-bold text-[#7B5ED3] mb-4">Friends</div>
                    <div className="bg-[#8B6EE3]/5 p-4">
                      <FriendsList
                        user={user}
                        handleUserUpdate={handleUserUpdate}
                      />
                    </div>
                  </div>
                  {outletProps.userId === props.userId && (
                    <div className="w-full p-4 bg-white/80 border border-[#8B6EE3]/20 shadow-sm hover:shadow-md transition-shadow">
                      <div className="font-bold text-[#7B5ED3] mb-4">
                        Outgoing requests
                      </div>
                      <div className="bg-[#8B6EE3]/5 p-4">
                        <RequestedOutList
                          user={user}
                          handleUserUpdate={handleUserUpdate}
                        />
                        <div className="mt-4 pt-4 border-t border-[#8B6EE3]/20">
                          <SendFriendReq
                            requestfunct={requestfunct}
                            handleUserUpdate={handleUserUpdate}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {outletProps.userId === props.userId && (
                    <div className="w-full p-4 bg-white/80 border border-[#8B6EE3]/20 shadow-sm hover:shadow-md transition-shadow">
                      <div className="font-bold text-[#7B5ED3] mb-4">
                        Pending requests
                      </div>
                      <div className="bg-[#8B6EE3]/5 p-4">
                        <RequestedInList
                          user={user}
                          handleUserUpdate={handleUserUpdate}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </TabPanel>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;

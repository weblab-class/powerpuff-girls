import React, { useState, useEffect, useRef } from "react";
import { get, post } from "../../utilities";
import { useParams, useOutletContext } from "react-router-dom";
import { SendFriendReq } from "../modules/SendFriendReq";

import { Button } from "../ui/button";
import { CardUI, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Upload, Users } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { Form, FormField, FormItem, FormControl } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [friends, setFriends] = useState();
  const [requestedOut, setRequestedOut] = useState();
  const [requestedIn, setRequestedIn] = useState();

  useEffect(() => {
    document.title = "Profile Page";
    get(`/api/user`, { userid: props.userId }).then((userObj) =>
      setUser(userObj)
    );
    console.log("just set user");
    /*if (!user.friends) {
      setFriends([]);
    } else {
      setFriends(user.friends);
    }
    if (!user.requestedOut) {
      setRequestedOut([]);
    } else {
      setRequestedOut(user.requestedOut);
    }
    if (!user.requestedIn) {
      setRequestedIn([]);
    } else {
      setRequestedIn(user.requestedIn);
    }*/

    console.log("mounted");
  }, []);

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
      toast({
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

    // For now, we'll just show a success toast
    toast({
      title: "Success!",
      description: "Your fit has been uploaded.",
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
    <div className="min-h-screen bg-gradient-to-b from-white to-stylesnap-softGray">
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-stylesnap-gray mb-2">
                {user.name}
                <div>{user.email && user.email}</div>
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-stylesnap-gray">
                  <Users className="inline-block mr-2 h-5 w-5" />
                  <div>
                    <div>Public friends: {user.friends}</div>
                    {outletProps.userId === props.userId && (
                      <div>
                        Check if logged in, print friends you requested:
                        {/*user.requestedOut*/}
                        <SendFriendReq requestfunct={requestfunct} />
                      </div>
                    )}
                    {outletProps.userId === props.userId && (
                      <div>
                        Check if logged in, print pending friend requests:
                        {user.requestedIn}
                      </div>
                    )}
                  </div>
                </span>
                <span className="text-stylesnap-gray">128 fits</span>
              </div>
            </div>
          </div>

          {outletProps.userId === props.userId && (
            <div>
              <CardUI className="mb-8">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-stylesnap-gray mb-4">
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
                        className={`border-2 border-dashed border-stylesnap-beige rounded-lg p-8 text-center transition-colors ${
                          previewUrl ? "bg-stylesnap-softGray/10" : ""
                        }`}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {previewUrl ? (
                          <div className="relative">
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="max-h-64 mx-auto rounded-lg"
                            />
                            <p className="text-sm text-stylesnap-gray mt-2">
                              Click to change image
                            </p>
                          </div>
                        ) : (
                          <>
                            <Upload className="mx-auto h-12 w-12 text-stylesnap-gray mb-2" />
                            <p className="text-sm text-stylesnap-gray">
                              Drag and drop your photo here, or click to browse
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
                                className="border-stylesnap-beige focus:border-stylesnap-pink"
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
                                className="border-stylesnap-beige focus:border-stylesnap-pink"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full bg-stylesnap-pink hover:bg-stylesnap-gray text-white"
                      >
                        Post Fit
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </CardUI>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;

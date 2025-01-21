import React, { useState, useEffect, useRef } from "react";
import CatHappiness from "../modules/CatHappiness";
import { get } from "../../utilities";
import { useParams } from "react-router-dom";

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Upload, Users } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { Form, FormField, FormItem, FormControl } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";

const formSchema = z.object({
  caption: z.string().min(1, "Caption is required"),
  tags: z.string(),
  image: z.any(),
});

const Profile = () => {
  let props = useParams();
  const [user, setUser] = useState();
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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
    // For now, we'll just show a success toast
    toast({
      title: "Success!",
      description: "Your fit has been uploaded.",
    });

    // Reset the form
    form.reset();
    setPreviewUrl(null);
  };

  useEffect(() => {
    document.title = "Profile Page";
    get(`/api/user`, { userid: props.userId }).then((userObj) =>
      setUser(userObj)
    );
  }, []);

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
                Your profile
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-stylesnap-gray">
                  <Users className="inline-block mr-2 h-5 w-5" />
                  42 friends
                </span>
                <span className="text-stylesnap-gray">128 fits</span>
              </div>
            </div>
            <Button
              className="bg-stylesnap-pink hover:bg-stylesnap-gray text-white"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" /> Upload Fit
            </Button>
          </div>

          <Card className="mb-8">
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
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;

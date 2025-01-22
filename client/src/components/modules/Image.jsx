/*import React from "react";

const CloudinaryImage = ({ publicId, alt, width, height }) => {
  // Cloudinary base URL for your cloud
  const cloudName = "stylesnap"; // Replace with your Cloudinary cloud name
  const imageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;

  return <img src={imageUrl} alt={alt} width={width} height={height} />;
};

export default CloudinaryImage;*/
import React from "react";

const CloudinaryImage = ({ publicId, alt, width, height }) => {
  // Cloudinary base URL for your cloud
  const cloudName = "stylesnap"; // Replace with your Cloudinary cloud name
  const imageUrl = `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},h_${height},c_fill/${publicId}`;

  return <img src={imageUrl} alt={alt} width={width} height={height} />;
};

export default CloudinaryImage;

import React from "react";
import PropTypes from "prop-types"; // For prop validation
import {
  AdvancedImage,
  lazyload,
  responsive,
  accessibility,
} from "@cloudinary/react"; // Core components
import { Cloudinary } from "@cloudinary/url-gen"; // SDK for creating Cloudinary objects
import { fill } from "@cloudinary/url-gen/actions/resize"; // Image transformations

// Create a Cloudinary instance
const cloudinary = new Cloudinary({
  cloud: {
    cloudName: "stylesnap", // Replace with your Cloudinary cloud name
  },
});

const CloudinaryImage = ({ publicId, alt, width, height }) => {
  // Create a Cloudinary image object
  const myImage = cloudinary.image(publicId);

  // Apply transformations (e.g., resizing)
  myImage.resize(fill().width(width).height(height));

  return (
    <AdvancedImage
      cldImg={myImage} // Pass the Cloudinary image object
      alt={alt} // Add alt text for accessibility
      plugins={[lazyload(), responsive(), accessibility()]} // Optional plugins
    />
  );
};

// Define default props and prop types
CloudinaryImage.defaultProps = {
  width: 300, // Default width
  height: 600, // Default height
  alt: "Cloudinary Image", // Default alt text
};

CloudinaryImage.propTypes = {
  publicId: PropTypes.string.isRequired, // Cloudinary public ID
  alt: PropTypes.string, // Alt text for the image
  width: PropTypes.number, // Width of the image
  height: PropTypes.number, // Height of the image
};

export default CloudinaryImage;

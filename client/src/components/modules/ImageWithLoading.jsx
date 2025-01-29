import React, { useState, useEffect } from "react";
import "../../tailwind.css";

const ImageWithLoading = ({ base64Image }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (base64Image) {
      setLoading(false);
    }
  }, [base64Image]);

  return (
    <div className="flex items-center justify-center m-4">
      {loading ? (
        <div className="flex items-center justify-center m-4">
          Loading your AI color palette analysis!
          <svg
            className="h-8 w-8 animate-spin text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
        </div>
      ) : (
        <div className="flex items-center space-x-4 bg-white w-full">
          <span className="text-lg font-semibold m-4 text-5xl animate-fadeIn">
            Your AI color palette:
          </span>
          <img
            src={`data:image/png;base64,${base64Image}`}
            alt="Dominant color analysis"
            className="transition-opacity duration-500 ease-in-out opacity-0"
            onLoad={(e) => (e.currentTarget.style.opacity = 1)}
          />
        </div>
      )}
    </div>
  );
};

export default ImageWithLoading;

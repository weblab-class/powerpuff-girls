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
    <div className="w-full p-4 bg-white/80 border border-[#8B6EE3]/20 shadow-sm hover:shadow-md transition-shadow mt-8">
      {loading ? (
        <div className="flex items-center justify-center py-8 text-[#8B6EE3]">
          <span className="mr-3 text-lg">Analyzing your color palette</span>
          <svg
            className="h-6 w-6 animate-spin text-[#8B6EE3]"
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
        <div className="bg-[#8B6EE3]/5 p-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-semibold text-[#8B6EE3]">AI Color Analysis:</div>
              <div className="text-lg text-[#7B5ED3] mt-1">Your Color Palette</div>
            </div>
            <div className="flex-shrink-0 ml-8">
              <img
                src={`data:image/png;base64,${base64Image}`}
                alt="Dominant color analysis"
                className="transition-opacity duration-500 ease-in-out opacity-0 max-h-32"
                onLoad={(e) => (e.currentTarget.style.opacity = 1)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageWithLoading;

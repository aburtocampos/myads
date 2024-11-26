import React from "react";

interface PlaceholderImageProps {
  text?: string;
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({ text = "No Image" }) => {
  return (
    <div
      className="flex items-center justify-center bg-gray-300 text-gray-700 font-bold"
      style={{
        width: "100%",
        height: "5rem",
        borderRadius: "8px",
      }}
    >
      {text}
    </div>
  );
};

export default PlaceholderImage;

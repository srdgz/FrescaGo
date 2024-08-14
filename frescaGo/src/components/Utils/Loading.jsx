import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center space-x-2">
      <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
      <div className="w-3 h-3 bg-secondary rounded-full animate-pulse"></div>
      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
    </div>
  );
};

export default Loading;

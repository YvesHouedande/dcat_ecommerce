import React from "react";

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
  </div>
);

export default LoadingSpinner;

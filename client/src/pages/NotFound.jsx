import React from "react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <img
        src="/LogoF.png"
        alt="Codex Logo"
        className="w-24 h-24 rounded-full mb-6 animate-bounce"
      />
      <h1 className="text-6xl font-extrabold text-gray-800 mb-4 animate__animated animate__fadeIn">
        404
      </h1>
      <p className="text-2xl text-gray-600 mb-8 animate__animated animate__fadeIn animate__delay-1s">
        OOPs , <span className="text-blue-500">Page not found!</span>
      </p>
    </div>
  );
};

export default NotFound;

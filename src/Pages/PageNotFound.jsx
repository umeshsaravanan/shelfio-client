import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setAnimate(true);
  }, []);

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800">
      <div className="flex flex-col items-center justify-center w-full p-4">
        <div
          className={`w-full max-w-md p-8 mx-auto text-center bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-xl border border-white border-opacity-20 transform transition-all duration-700 ${
            animate ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div
            className={`mb-6 transform transition-all duration-1000 delay-300 ${
              animate ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h1 className="mb-2 text-6xl font-bold text-white">404</h1>
            <div className="w-16 h-1 mx-auto my-4 bg-purple-400 rounded-full"></div>
            <h2 className="mb-4 text-2xl font-semibold text-white">
              No such page exists
            </h2>
          </div>

          <div
            className={`mb-8 text-gray-100 transform transition-all duration-1000 delay-500 ${
              animate ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <p className="mb-4">
              The page you are looking for might have been removed, had its name
              changed, or is temporarily unavailable.
            </p>
          </div>

          <button
            onClick={handleGoHome}
            className={`px-6 py-3 font-semibold text-indigo-900 transition-all duration-300 bg-white rounded-md hover:bg-opacity-90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-900 transform ${
              animate
                ? "translate-y-0 opacity-100 delay-700"
                : "translate-y-8 opacity-0"
            } hover:scale-105`}
          >
            Return to Homepage
          </button>
        </div>

        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white bg-opacity-10"
              style={{
                width: `${Math.random() * 10 + 5}rem`,
                height: `${Math.random() * 10 + 5}rem`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 20}s infinite linear`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.3,
              }}
            />
          ))}
        </div>
      </div>

      {/* CSS for the floating animation */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(30px, -50px) rotate(120deg);
          }
          66% {
            transform: translate(-20px, 20px) rotate(240deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default PageNotFound;

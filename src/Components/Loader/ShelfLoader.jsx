import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const ShelfLoader = ({
  color = "text-blue-600",
  size = "w-36 h-36",
  loadingText = "Loading",
}) => {
  const [dots, setDots] = useState("");

  // Animate the dots for loading text
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
      <div className={`${size} mx-auto ${color}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Bookshelf Base */}
          <rect x="10" y="70" width="80" height="10" className="fill-current" />

          {/* Animated Books */}
          {[
            { x: 15, y: 30, height: 40, delay: 0 },
            { x: 30, y: 20, height: 50, delay: 0.3 },
            { x: 45, y: 40, height: 30, delay: 0.6 },
            { x: 60, y: 10, height: 60, delay: 0.9 },
            { x: 75, y: 50, height: 20, delay: 1.2 },
          ].map((book, index) => (
            <rect
              key={index}
              x={book.x}
              y={book.y}
              width="10"
              height={book.height}
              className="fill-current opacity-90"
              style={{
                animation: "bookRead 3s linear infinite",
                animationDelay: `${book.delay}s`,
              }}
            />
          ))}
        </svg>

        <div className={`font-medium ${color} text-center`}>
          <span>{loadingText}</span>
          <span className="inline-block w-8 text-left">{dots}</span>
        </div>

        <style jsx>{`
          @keyframes bookRead {
            0%,
            10% {
              transform: translateY(0);
            }
            15% {
              transform: translateY(-10px);
            }
            20%,
            40% {
              transform: translateY(-70px);
              opacity: 0.3;
            }
            45% {
              transform: translateY(-10px);
              opacity: 0.9;
            }
            50%,
            100% {
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </div>,
    document.getElementById("root")
  );
};

export default ShelfLoader;

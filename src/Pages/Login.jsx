import { useState } from "react";

import LoginForm from "../Components/Login/LoginForm";
import SignupForm from "../Components/Login/SignUpForm";

export default function Login() {
  const [showLogin, setShowLogin] = useState(true);
  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative flex items-center justify-center w-full p-4">
        <div className="flex bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden">
          {/* Left Panel */}
          <div className="w-1/2 hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-indigo-700 to-purple-800 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute transform rotate-45 bg-white/20"
                  style={{
                    width: "200%",
                    height: "40px",
                    left: "-50%",
                    top: `${i * 200}px`,
                  }}
                ></div>
              ))}
            </div>

            <div className="relative z-10 text-center">
              <div className="mb-8">
                <svg
                  viewBox="0 0 100 100"
                  className="w-24 h-24 mx-auto text-white"
                >
                  {/* Bookshelf Base */}
                  <rect
                    x="10"
                    y="70"
                    width="80"
                    height="10"
                    className="fill-current"
                  />
                  {/* Books */}
                  <rect
                    x="15"
                    y="30"
                    width="10"
                    height="40"
                    className="fill-current opacity-50"
                  />
                  <rect
                    x="30"
                    y="20"
                    width="10"
                    height="50"
                    className="fill-current opacity-70"
                  />
                  <rect
                    x="45"
                    y="40"
                    width="10"
                    height="30"
                    className="fill-current opacity-50"
                  />
                  <rect
                    x="60"
                    y="10"
                    width="10"
                    height="60"
                    className="fill-current opacity-70"
                  />
                  <rect
                    x="75"
                    y="50"
                    width="10"
                    height="20"
                    className="fill-current opacity-50"
                  />
                </svg>
                <h1 className="text-3xl font-bold mt-4">shelf.io</h1>
              </div>
              <h2 className="text-2xl font-light mb-6">Welcome Back!</h2>
              <p className="text-lg opacity-90">
                Access your digital bookshelf and continue your learning journey
              </p>
              <div className="mt-12 space-y-4"></div>
            </div>
          </div>

          {showLogin ? (
            <LoginForm onCreateAccount={() => setShowLogin(false)} />
          ) : (
            <SignupForm onSignIn={() => setShowLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
}

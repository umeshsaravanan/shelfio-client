import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../Hooks/useAxios";
import { FORGOT_PASSWORDS_API_ENDPOINT } from "../Config/UserApiEndPoints";
import BtnLoader from "../Components/Loader/BtnLoader";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { axiosInstance, isLoading, setIsLoading } = useAxios();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const { data } = await axiosInstance.post(FORGOT_PASSWORDS_API_ENDPOINT, {
        email,
      });

      setMessage(data);
    } catch (error) {
      setError(error.response?.data?.error || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800">
      <div className="m-auto w-full max-w-md p-8 bg-white rounded-xl shadow-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate("/login")}
              className="p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
            >
              <span className="material-symbols-outlined text-indigo-700">
                arrow_back
              </span>
            </button>
            <div className="w-10 h-10 mx-auto rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-white">
                lock_reset
              </span>
            </div>
            <div className="w-8"></div> {/* Empty div for balanced layout */}
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Forgot Password</h2>
          <p className="text-gray-500 mt-2">
            Enter your email address to reset your password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-gray-700 font-medium">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                <span className="material-symbols-outlined text-indigo-600">
                  mail
                </span>
              </span>
              <input
                type="email"
                className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition outline-none text-gray-700"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition duration-300 shadow-lg flex justify-center items-center space-x-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <BtnLoader />
            ) : (
              <>
                <span>Send Reset Link</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </>
            )}
          </button>

          {/* Status Messages */}
          {message && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
              <span className="material-symbols-outlined mr-2">
                check_circle
              </span>
              <p>{message}</p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg justify-center flex items-center text-red-700">
              <span className="material-symbols-outlined mr-2">error</span>
              <p>{error}</p>
            </div>
          )}
        </form>

        {/* Footer */}
        <p className="text-center text-gray-500 mt-8">
          Remember your password?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-indigo-600 font-medium hover:text-indigo-800 transition"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;

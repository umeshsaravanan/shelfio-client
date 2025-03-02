import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxios from "../Hooks/useAxios";
import { RESET_PASSWORDS_API_ENDPOINT } from "../Config/UserApiEndPoints";
import { useAuthCtx } from "../Contexts/AuthCtx";
import { DASHBOARD_ROUTE_POINT } from "../Config/Routes";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);
  const { axiosInstance } = useAxios();

  const navigate = useNavigate();
  const location = useLocation();
  const { handleToken } = useAuthCtx();

  useEffect(() => {
    // Extract token from URL
    const searchParams = new URLSearchParams(location.search);
    const urlToken = searchParams.get("token");

    if (!urlToken) {
      setError("Missing reset token. Please try again with a valid link.");
      setTokenExpired(true);
      return;
    }

    setToken(urlToken);
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { data } = await axiosInstance.post(RESET_PASSWORDS_API_ENDPOINT, {
        token,
        password,
      });

      setMessage("Password reset successful!");

      setTimeout(() => {
        handleToken(data.token);
        navigate(DASHBOARD_ROUTE_POINT);
      }, 500);
    } catch (error) {
      setTokenExpired(true);
      setError(
        error.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800">
      <div className="m-auto w-full max-w-md p-8 bg-white rounded-xl shadow-2xl">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-3xl">
                lock_reset
              </span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
          <p className="text-gray-500 mt-2">
            Create a new secure password for your account
          </p>
        </div>

        {tokenExpired ? (
          <div className="space-y-6">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
              <span className="material-symbols-outlined mr-2">error</span>
              <p>{error}</p>
            </div>
            <button
              onClick={() => navigate("/forgot-password")}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition duration-300 shadow-lg"
            >
              Try Again
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password Field */}
            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">
                New Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                  <span className="material-symbols-outlined text-indigo-600">
                    lock
                  </span>
                </span>
                <input
                  type={passwordVisible ? "text" : "password"}
                  className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition outline-none text-gray-700"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="8"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  <span className="material-symbols-outlined text-gray-500">
                    {passwordVisible ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
              <p className="text-gray-500 text-sm">
                Password must be at least 8 characters
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200   rounded-lg flex items-center text-red-700">
                <span className="material-symbols-outlined mr-2">error</span>
                <p>{error}</p>
              </div>
            )}

            {/* Status Messages */}
            {message && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
                <span className="material-symbols-outlined mr-2">
                  check_circle
                </span>
                <p>{message}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition duration-300 shadow-lg flex justify-center items-center space-x-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Reset Password</span>
                  <span className="material-symbols-outlined">check</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer */}
        <p className="text-center text-gray-500 mt-8">
          Already have access?{" "}
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

export default ResetPassword;

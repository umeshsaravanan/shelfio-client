import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        "https://your-api.com/api/auth/forgot-password",
        { email }
      );
      setMessage(response.data.message);
      
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={() => navigate("/login")}
          className="absolute top-4 left-4 text-gray-700 hover:text-gray-900 transition"
        >
          <span className='material-symbols-outlined text-gray-700 hover:text-gray-900 transition text-2xl'>arrow_back</span>
        </button>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Forgot Password
        </h2>
        <p className="text-gray-600 text-center mb-4">
          Enter your email address to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full border-2 rounded-lg p-3 focus:border-indigo-500 transition outline-none text-gray-700"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition duration-300 shadow-lg hover:shadow-xl"
            disabled={loading}
          >
            {loading ? "Sending..." : "Submit"}
          </button>
        </form>
        {message && <p className="text-green-600 text-center mt-4">{message}</p>}
        {error && <p className="text-red-600 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;

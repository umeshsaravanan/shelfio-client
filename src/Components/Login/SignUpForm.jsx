import { useState } from "react";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import useAxios from "../../Hooks/useAxios";
import { useAuthCtx } from "../../Contexts/AuthCtx";
import { CREATE_ACCOUNT_API_ENDPOINT } from "../../Config/UserApiEndPoints";
import { DASHBOARD_ROUTE_POINT } from "../../Config/Routes";
import { validateSignup } from "./Validations";

const SignupForm = ({ onSignIn }) => {
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState(false);

  const {
    axiosInstance,
    handleError,
    errorMsg,
    setErrorMsg,
    isLoading,
    setIsLoading,
  } = useAxios();
  const { handleToken } = useAuthCtx();
  const navigate = useNavigate();

  const signUp = async () => {
    try {
      setIsLoading(true);
      setErrorMsg("");
      setValidationErrors(false);

      const { data } = await axiosInstance.post(
        CREATE_ACCOUNT_API_ENDPOINT,
        signupData
      );

      handleToken(data.token);
      navigate(DASHBOARD_ROUTE_POINT);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUpBtnHandler = () => {
    const isValidated = validateSignup(signupData, setValidationErrors);

    if (isValidated) {
      signUp();
    }
  };

  const onChangeHandler = (field, value) => {
    setSignupData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full lg:w-1/2 p-8 md:p-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        Create an Account
      </h2>
      <div className="space-y-6" onSubmit={signUpBtnHandler}>
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">Full Name</label>
          <div className="flex items-center border-2 rounded-lg p-3 focus-within:border-indigo-500 transition">
            <input
              value={signupData.name}
              autoFocus
              type="text"
              placeholder="John Doe"
              onChange={(e) => onChangeHandler("name", e.target.value)}
              className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            />
            <FaUser className="text-gray-400 ml-2 h-5 w-5" />
          </div>
          {validationErrors?.name && (
            <span className="text-red-600 text-xs">
              {validationErrors.name}
            </span>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">Email</label>
          <div className="flex items-center border-2 rounded-lg p-3 focus-within:border-indigo-500 transition">
            <input
              value={signupData.email}
              type="email"
              placeholder="you@example.com"
              onChange={(e) => onChangeHandler("email", e.target.value)}
              className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            />
          </div>
          {validationErrors?.email && (
            <span className="text-red-600 text-xs">
              {validationErrors.email}
            </span>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">Password</label>
          <div className="flex items-center border-2 rounded-lg p-3 focus-within:border-indigo-500 transition">
            <input
              value={signupData.password}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              onChange={(e) => onChangeHandler("password", e.target.value)}
              className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            />
            {showPassword ? (
              <FaEyeSlash
                className="text-gray-400 cursor-pointer hover:text-gray-600"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <FaEye
                className="text-gray-400 cursor-pointer hover:text-gray-600"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>

          {validationErrors?.password && (
            <span className="text-red-600 text-xs">
              {validationErrors.password}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          onClick={signUpBtnHandler}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition duration-300 shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
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
            </div>
          ) : (
            "Sign up"
          )}
        </button>

        {errorMsg && (
          <p className="text-xs text-red-600 text-center">{errorMsg}</p>
        )}

        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <span
              onClick={onSignIn}
              className="text-indigo-600 hover:text-indigo-800 cursor-pointer transition"
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;

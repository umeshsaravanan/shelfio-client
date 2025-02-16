import { useEffect, useState } from "react";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import useAxios from "../../Hooks/useAxios";
import { useAuthCtx } from "../../Contexts/AuthCtx";
import { LOGIN_API_ENDPOINT } from "../../Config/UserApiEndPoints";
import { DASHBOARD_ROUTE_POINT } from "../../Config/Routes";
import { validateLogin } from "./Validations";

const LoginForm = ({ onCreateAccount }) => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    axiosInstance,
    handleError,
    errorMsg,
    setErrorMsg,
    setIsLoading,
    isLoading,
  } = useAxios();
  const { handleToken } = useAuthCtx();
  const navigate = useNavigate();

  const onChangeHandler = (type, value) => {
    setErrorMsg("");
    setLoginData((prevData) => ({ ...prevData, [type]: value }));
  };

  const handleRememberMe = (e) => {
    setRememberMe(e.target.checked);
  };

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setLoginData((prevData) => ({ ...prevData, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  const login = async () => {
    try {
      setIsLoading(true);
      setErrorMsg("");
      const { data } = await axiosInstance.post(LOGIN_API_ENDPOINT, loginData);

      handleToken(data.token);

      // On login, store email in localStorage if "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", loginData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      navigate(DASHBOARD_ROUTE_POINT);
    } catch (error) {
      handleError(error, false);
    } finally {
      setIsLoading(false);
    }
  };

  const loginBtnHandler = async (e) => {
    const isValid = validateLogin(loginData, setValidationErrors);

    if (isValid) {
      login();
    }
  };

  return (
    <div className="w-full lg:w-1/2 p-8 md:p-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Log in</h2>
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">Email</label>
          <div className="flex items-center border-2 rounded-lg p-3 focus-within:border-indigo-500 transition">
            <input
              value={loginData.email}
              type="email"
              placeholder="you@example.com"
              autoFocus
              onChange={(e) => onChangeHandler("email", e.target.value)}
              className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            />
            <FaUser className="text-gray-400 ml-2 h-5 w-5" />
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
              value={loginData.password}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              onChange={(e) => onChangeHandler("password", e.target.value)}
              className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            />
            {showPassword ? (
              <FaEyeSlash
                className="text-gray-400 cursor-pointer hover:text-gray-600 transition h-5 w-5"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <FaEye
                className="text-gray-400 cursor-pointer hover:text-gray-600 transition h-5 w-5"
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

        <div className="flex items-center justify-between">
          <label className="flex items-center text-gray-600 cursor-pointer group">
            <input
              onChange={handleRememberMe}
              checked={rememberMe}
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 group-hover:text-gray-800 transition">
              Remember me
            </span>
          </label>
          <a
            href="/forgot-password"
            className="text-indigo-600 hover:text-indigo-800 transition"
          >
            Forgot password?
          </a>
        </div>

        <button
          disabled={isLoading}
          onClick={loginBtnHandler}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition duration-300 shadow-lg hover:shadow-xl relative"
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
            "Sign in"
          )}
        </button>

        {errorMsg && (
          <p className="text-xs text-red-600 text-center">{errorMsg}</p>
        )}

        <div className="text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <span
              onClick={onCreateAccount}
              className="text-indigo-600 hover:text-indigo-800 cursor-pointer transition"
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

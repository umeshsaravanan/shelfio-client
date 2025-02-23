import React from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import useAxios from "../../Hooks/useAxios";
import { useAuthCtx } from "../../Contexts/AuthCtx";
import { FcGoogle } from "react-icons/fc";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const GoogleLogin = () => {

    const { axiosInstance, setErrorMsg, isLoading, setIsLoading } = useAxios();
    const { handleToken } = useAuthCtx();

    const login = useGoogleLogin({
        onSuccess: async (response) => {
            setIsLoading(true);
            try {
                const { data } = await axiosInstance.post(
                    `register/service/google`,
                    { token: response.access_token },
                    { headers: { "Content-Type": "application/json" } }
                );
                handleToken(data.token);
            } catch (error) {
                console.error("Error during login:", error);
                setErrorMsg("Something went wrong. Please try again later.");
            } finally{
                setIsLoading(false);
            }
        },
        onError: (error) => {
            console.error({Login_Failed :  error});
            setErrorMsg("Login failed. Please try again.");
            setIsLoading(false);
        },
        scope: "openid email profile",
        flow: "implicit",
    });

    return (
        <button
            onClick={login}
            className="group border rounded-lg text-sm font-semibold p-2 border-gray-900 hover:bg-gray-900 hover:text-white flex justify-center items-center w-full gap-2 h-12 duration-200"
        >
            {
                isLoading ?
                    <div className="flex items-center justify-center">
                        <svg
                            className="animate-spin h-5 w-5 text-black group-hover:text-white"
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
                    :
                    <>
                        <FcGoogle className="text-xl" />
                        <span>Continue With Google</span>
                    </>
            }
        </button>
    );
};

const GoogleLoginButton = () => {
    return (
        <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin />
        </GoogleOAuthProvider>
    );
};

export default GoogleLoginButton;

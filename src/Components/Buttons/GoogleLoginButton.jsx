import React from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import useAxios from "../../Hooks/useAxios";
import { useAuthCtx } from "../../Contexts/AuthCtx";
import { FcGoogle } from "react-icons/fc";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const GoogleLogin = () => {

    const { axiosInstance, setErrorMsg } = useAxios();
    const { handleToken } = useAuthCtx();

    const login = useGoogleLogin({
        onSuccess: async (response) => {

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
            }
        },
        onError: () => {
            console.error("Login Failed");
            setErrorMsg("Login failed. Please try again.");
        },
        scope: "openid email profile",
        flow: "implicit",
    });

    return (
        <button onClick={login} className=" border rounded-lg text-sm font-semibold p-2 border-gray-900 hover:bg-gray-900 hover:text-white flex justify-center items-center w-full gap-2 h-12 duration-200">
            <FcGoogle className="text-xl" />
            Continue With Google
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

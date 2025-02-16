import React from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import Button from "./Button";
import useAxios from "../../Hooks/useAxios";
import { useAuthCtx } from "../../Contexts/AuthCtx";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const GoogleLogin = () => {

    const { axiosInstance, isLoading, setErrorMsg } = useAxios();
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
      <Button isLoading={isLoading} onClick={login} name="Continue With Google" type = "secondary" customClassNames="h-12 duration-200" />
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

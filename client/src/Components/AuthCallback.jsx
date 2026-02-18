import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { storeTokens } from "../utils/auth";
import { api } from "../utils/api";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const tempTokenId = searchParams.get("tempTokenId");

    if (tempTokenId) {
      const exchangeToken = async () => {
        try {
          const response = await api.post("/auth/exchange-temp-token", {
            tempTokenId,
          });
          const { accessToken, refreshToken } = response.data;
          storeTokens(accessToken, refreshToken);
          // Notify app that auth tokens have been set so components (e.g. Navbar) can update
          window.dispatchEvent(new Event("tokenRefreshed"));
          toast.success("Google login successful!");
          navigate("/");
        } catch (error) {
          console.error("Token exchange error:", error);
          toast.error("Google login failed");
          navigate("/");
        }
      };
      exchangeToken();
    } else {
      toast.error("Google login failed");
      navigate("/");
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing login...</p>
      </div>
    </div>
  );
};

export default AuthCallback;

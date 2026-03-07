import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../zustands/useAuthStore";
import { toast } from "react-toastify";

export const useGoogleOAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAccessToken, fetchMe } = useAuthStore();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const token = searchParams.get("token");
      const error = searchParams.get("error");

      if (token) {
        try {
          setAccessToken(token);

          await fetchMe();
          navigate("/", { replace: true });
        } catch (error) {
          console.error("Error handling OAuth callback:", error);
          toast.error("Đã xảy ra lỗi khi đăng nhập");
          navigate("/login", { replace: true });
        }
      }

      if (error) {
        console.log(error);
        toast.error("Dăng nhập thất bại: ");
        navigate("/login", { replace: true });
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, setAccessToken, fetchMe]);
};

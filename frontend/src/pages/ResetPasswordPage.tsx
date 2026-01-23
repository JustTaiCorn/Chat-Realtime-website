import { useState } from "react";
import { useAuthStore } from "../zustands/useAuthStore";
import { useForm } from "react-hook-form";
import { Loader2, Lock, MessageSquareDashed, Eye, EyeOff } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import AuthImagePattern from "../components/common/ImagePattern";

type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { resetPassword, loading } = useAuthStore();
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<ResetPasswordFormData>();

  const password = watch("password");

  const onSubmit = handleSubmit(async (data: ResetPasswordFormData) => {
    if (!token) return;
    try {
      await resetPassword(token, data.password);
      navigate("/login");
    } catch (error) {
      console.error("Reset password failed:", error);
    }
  });

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquareDashed className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-semibold mt-2">Set New Password</h1>
              <p className="text-base-content/60 ">
                "Enter your new password below"
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium mb-1">
                  New Password
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 flex left-0 pl-3 items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="input w-full pl-10 input-bordered"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text font-medium mb-1">
                  Confirm New Password
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 flex left-0 pl-3 items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="input w-full pl-10 input-bordered"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full mt-6"
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Resetting password...</span>
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right side */}
      <AuthImagePattern
        title="Secure Your Account"
        subtitle="Make sure your new password is strong and unique."
      />
    </div>
  );
}

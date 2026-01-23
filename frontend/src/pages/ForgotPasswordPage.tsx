import { useAuthStore } from "../zustands/useAuthStore";
import { useForm } from "react-hook-form";
import { Loader2, Mail, MessageSquareDashed, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/common/ImagePattern";

type ForgotPasswordFormData = {
  email: string;
};

export default function ForgotPasswordPage() {
  const { forgotPassword, loading } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = handleSubmit(async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword(data.email);
    } catch (error) {
      console.error("Forgot password request failed:", error);
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
              <h1 className="text-2xl font-semibold mt-2">Forgot Password</h1>
              <p className="text-base-content/60 ">
                "Enter your email to reset password"
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium mb-1">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 flex left-0 pl-3 items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input w-full pl-10 input-bordered"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
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
                  <span>Sending reset link...</span>
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link
              to="/login"
              className="text-primary flex items-center justify-center gap-2 hover:underline"
            >
              <ArrowLeft className="size-4" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Right side */}
      <AuthImagePattern
        title="Reset Password"
        subtitle="We'll help you get back into your account."
      />
    </div>
  );
}

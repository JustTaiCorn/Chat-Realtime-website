import React from "react";
import AuthImagePattern from "../components/common/ImagePattern";
import { useForm } from "react-hook-form";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  MessageSquareDashed,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "../zustands/useAuthStore";
import LoginOauth2 from "../components/common/LoginOauth2.tsx";
 type SignupData ={
   email: string;
   password: string;
   fullName: string;
 }
export default function SignUpPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const { signup, loading } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignupData>();
  const onSubmit = handleSubmit(
    async (data: SignupData) => {
      try {
        await signup(data);
      } catch (error) {
        // Error đã được handle trong useAuthStore
        console.log("Signup failed:", error);
      }
    },
    (errors) => {
      Object.values(errors).map((error, index) =>
        toast.error(error.message, { toastId: index })
      );
    }
  );

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/*left side*/}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquareDashed className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-semibold mt-2">Create Account</h1>
              <p className="text-base-content/60 ">
                "Get started with your free account"
              </p>
            </div>
          </div>
          {/* FORM */}
          <form onSubmit={onSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium mt-5 mb-1">
                  Full Name
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 flex left-0  pl-3 items-center pointer-events-none">
                  <User className="w-5 h-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="input w-full pl-10 input-bordered"
                  {...register("fullName", {
                    required: "Full name is required",
                  })}
                />
              </div>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium mt-5 mb-1">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 flex left-0  pl-3 items-center pointer-events-none">
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
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium mt-5 mb-1">
                  Password
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 flex left-0  pl-3 items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="input w-full pl-10 input-bordered"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must contain at least 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </button>
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
                  <span>Signing Up...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <div className="text-center my-6">
            <span className="text-base-content/40">or</span>
          </div>
          <div><LoginOauth2/></div>
          <div className="mt-4 text-center">
            <p className="text-sm text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="text-primary">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/*right side*/}
      <AuthImagePattern
        title="Create Account"
        subtitle="Get started with your free account"
      />
    </div>
  );
}

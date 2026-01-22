import React, { useEffect, useState } from "react";
import axios from "../context/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login: React.FC<any> = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/login", { email, password });
      if (response.status === 200) {
        const token = response.data.token;
        login(token);
        setErrorMessage("");
        navigate("/home");
      }
    } catch (error: any) {
      if (error.response) {
        setErrors(error.response.data.errors || {});
        if (error.status === 404) {
          setErrorMessage(error.response.data.message);
        }
      } else {
        console.error("Login error:", error.message);
        setErrorMessage(
          "Sorry, we could not find the API. Please come back later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const googleAuthUrl = `${process.env.REACT_APP_BASE_URL}/auth/google`;
    window.open(googleAuthUrl, "_self");
  };

  useEffect(() => {
    document.title = "Ordering App | Login";
  }, []);

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          {errorMessage && (
            <div className="flex items-center justify-center p-4 mb-4 text-red-700 bg-red-100 border-l-4 border-red-400 rounded-md w-96">
              <div className="flex-1">
                <p className="font-medium">{errorMessage}</p>
              </div>
              <button className="ml-4 text-gray-500 hover:text-gray-700">
                &times;
              </button>
            </div>
          )}
          <div className="p-6 space-y-8 bg-white border rounded-lg shadow-md w-96">
            <h2 className="mb-4 text-2xl font-bold text-center">Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2 text-gray-700" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {errors.email &&
                  errors.email.map((error, index) => (
                    <p key={index} className="text-red-500">
                      {error}
                    </p>
                  ))}
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-gray-700" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />

                {errors.password &&
                  errors.password.map((error, index) => (
                    <p key={index} className="text-red-500">
                      {error}
                    </p>
                  ))}
              </div>
              <button
                disabled={loading}
                type="submit"
                className="w-full px-4 py-2 text-white transition duration-200 bg-blue-500 rounded-md hover:bg-blue-600"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
            <div className="relative">
              <span className="block w-full h-px bg-gray-300"></span>
              <p className="absolute inset-x-0 inline-block px-2 mx-auto text-sm bg-white w-fit -top-2">
                Or continue with
              </p>
            </div>
            <div className="space-y-4 text-sm font-medium">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-x-3 py-2.5 border rounded-lg hover:bg-gray-50 duration-150 active:bg-gray-100"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_17_40)">
                    <path
                      d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z"
                      fill="#34A853"
                    />
                    <path
                      d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z"
                      fill="#FBBC04"
                    />
                    <path
                      d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z"
                      fill="#EA4335"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_17_40">
                      <rect width="48" height="48" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                Continue with Google
              </button>
            </div>
            <p className="mt-4 text-center">
              Don't have an account?{" "}
              <a href="/register" className="text-blue-500 hover:underline">
                Register
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

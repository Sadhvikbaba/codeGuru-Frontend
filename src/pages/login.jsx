import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import loginImage from "@/assets/loginImage.jpeg";
import {login as stateLogin} from "@/store/authSlice"
import { useDispatch } from "react-redux";

export default function Login() {
  const navigate = useNavigate();
  const Dispatch = useDispatch();

  // Google login handler
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/v1/user/get-started",
          { token: tokenResponse.access_token, provider: "google" },
          { withCredentials: true }
        );
        Dispatch(stateLogin(response.data?.message?.user))

        navigate("/problems");
      } catch (error) {
        console.error("Error during Google OAuth:", error.response);
      }
    },
  });

  // GitHub login handler
  const handleGitHubLogin = async () => {
    const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_OAUTH_CLIENT_ID;
    const REDIRECT_URI = "http://localhost:5173/auth/github/callback";
  
    try {
      // Redirect user to GitHub OAuth authorization URL
      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user:email`;
      window.location.href = githubAuthUrl;
    } catch (error) {
      console.error("Error initiating GitHub OAuth:", error);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/get-started",
        { email, password, provider: "normal" },
        { withCredentials: true }
      );
      Dispatch(stateLogin(response.data?.message?.user))

      navigate("/problems");
    } catch (error) {
      console.error("Error during normal login:", error.response);
    }
  };

  return (
    <div className="min-h-[38rem] flex items-center" >
      <div className="w-1/2 min-h-[41rem] rounded-r-2xl bg-cover bg-center p-28 "style={{ backgroundImage:`url(${loginImage})` }}>
      </div>
      <div className="w-96 p-6 rounded-lg mx-auto">
        <h1 className="text-2xl font-bold mb-2">Get started</h1>
        <p className="text-slate-400 mb-6">Enter your email below to login / signup</p>
        <div className="flex gap-4 mb-4">
          <Button onClick={handleGitHubLogin} className="flex-1" variant="outline">
            <span className="mr-2">
              <FaGithub />
            </span>
            GitHub
          </Button>
          <Button onClick={() => loginWithGoogle()} className="flex-1" variant="outline">
            <span className="mr-2">
              <FaGoogle />
            </span>
            Google
          </Button>
        </div>
        <div className="flex items-center my-4">
          <div className="border-t flex-grow"></div>
          <span className="px-4 text-sm dark:text-gray-600 text-gray-700">OR CONTINUE WITH</span>
          <div className="border-t flex-grow"></div>
        </div>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <Label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </Label>
            <Input id="email" name="email" type="email" placeholder="Enter your email" />
          </div>
          <div className="mb-6">
            <Label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </Label>
            <Input id="password" name="password" type="password" placeholder="Enter your password" />
          </div>
          <Button type="submit" className="w-full rounded-xl">
            Login
          </Button>
        </form>
        <div className="text-right w-full mt-1">
          <span className="cursor-pointer text-gray-600 hover:dark:text-gray-300 hover:text-gray-950" onClick={()=> navigate("/")}>go back to home</span>
          </div>
      </div>
    </div>
  );
}

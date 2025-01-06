import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { login as stateLogin } from "@/store/authSlice";
import axios from "axios";

const GithubCallback = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (code) {
      axios
        .post(
          "http://localhost:8000/api/v1/user/get-started",
          { code, provider: "github" },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true, 
          }
        )
        .then((response) => {
          dispatch(stateLogin(response?.data?.message?.user)); 
          navigate("/problems"); 
        })
        .catch((err) => {
          console.error("Error authenticating with GitHub:", err);
        });
    }
  }, [code, dispatch, navigate]);

  return <div>Authenticating with GitHub...</div>;
};

export default GithubCallback;

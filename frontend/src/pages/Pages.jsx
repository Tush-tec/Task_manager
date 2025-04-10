import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GoogleSuccess = () => {
  const navigate = useNavigate();
  const { setUser, setToken, setIsAuthenticate } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    
    const user = params.get("user");
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (user && accessToken && refreshToken) {
      const parsedUser = JSON.parse(decodeURIComponent(user));
      console.log("parsed user",parsedUser);
      
      localStorage.setItem("user", JSON.stringify(parsedUser));
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      setUser(parsedUser);
      setToken(accessToken);
      setIsAuthenticate(true);

      navigate("/");
    } else {
      alert("Login failed. Missing data.");
      navigate("/login");
    }
  }, []);

  return <h2>Logging you in with Google...</h2>;
};

export default GoogleSuccess;

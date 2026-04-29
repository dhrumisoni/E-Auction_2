import { useContext, useEffect } from "react";
import api from "../../api";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
  const navigate = useNavigate();
  let { logout } = useContext(AuthContext);

  useEffect(() => {
    const logoutOperation = async () => {
      await fetch(`${import.meta.env.VITE_API_URL}/logout`);
    };
    navigate("/", { replace: true });
    logout();
    logoutOperation()
  })
};

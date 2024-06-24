import React, { useEffect } from "react";
import { useUsersContext } from "../../hooks/UsersContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

function AccessProfil(profile = "isAdmin") {
  const navigate = useNavigate();
  const storedUser = Cookies.get("user");

  useEffect(() => {
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
    
    if (parsedUser?.role !== "isAdmin" && parsedUser?.role !== profile) {
      Swal.fire({
        position: "top",
        icon: "info",
        title: "No está autorizado para trabajar en la sección",
        showConfirmButton: false,
        timer: 3500,
      });
      navigate(`/`);
    }
  } catch (error) {
    console.error("Failed to parse user from cookie:", error);
  }
}
  }, [storedUser, profile, navigate]);

  return null; // No renderiza nada
}

export default AccessProfil;

import React, { useEffect } from "react";
import { useUsersContext } from "../../hooks/UsersContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function AccessProfil(profile = "isAdmin") {
  const { usersContext } = useUsersContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (usersContext.role !== "isAdmin" && usersContext.role !== profile) {
      Swal.fire({
        position: "top",
        icon: "info",
        title: "No está autorizado para trabajar en la sección",
        showConfirmButton: false,
        timer: 3500,
      });
      navigate(`/`);
    }
  }, [usersContext.role, profile, navigate]);

  return null; // No renderiza nada
}

export default AccessProfil;

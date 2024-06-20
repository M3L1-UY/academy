import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useUsersContext } from '../../hooks/UsersContext';
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const { usersContext } = useUsersContext();

  useEffect(() => {
    if (usersContext?.login) {
      Swal.fire({
        title: '¿Está seguro?',
        text: '¿Desea cerrar su sesión?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'No, cancelar',
        dangerMode: true,
      }).then((result) => {
        if (result.isConfirmed) {
          // Llamar a la API de logout
          fetch('/user/logout', {
            method: 'POST',
            credentials: 'include', // Para enviar cookies si estás utilizando cookies
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.status === '200') {
                Swal.fire('Sesión cerrada', 'Su sesión ha sido cerrada exitosamente', 'success').then(() => {
                  navigate('/'); 
                });
              } else {
                Swal.fire('Error', 'Hubo un problema al cerrar la sesión', 'error');
              }
            })
            .catch((error) => {
              console.error('Error al cerrar la sesión:', error);
              Swal.fire('Error', 'Hubo un problema al cerrar la sesión', 'error');
            });
        } else {
          navigate('/');
        }
      });
    } else {
      navigate('/');
    }
  }, [usersContext, navigate]);

  return null; 
};

export default Logout;

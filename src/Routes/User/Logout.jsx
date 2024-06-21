import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useUsersContext } from '../../hooks/UsersContext';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'; // Importa js-cookie

const Logout = () => {
  const navigate = useNavigate();
  const { usersContext, setUsersContext } = useUsersContext();

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
          fetch(`${import.meta.env.VITE_REACT_APP_SERVER_HOST}/api/user/logout`, {
            method: 'POST',
            credentials: 'include',
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.status === '200') {
                Cookies.remove('user'); 
                setUsersContext(null); 
                Swal.fire('Sesión cerrada', 'Su sesión ha sido cerrada exitosamente', 'success').then(() => {
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
  }, [usersContext, navigate, setUsersContext]);

  return null; 
};

export default Logout;

import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./menu.css"; // Archivo CSS donde definiremos los estilos
import { useUsersContext } from "../../hooks/UsersContext";

function MenuItem({ item }) {
  const { usersContext } = useUsersContext();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  // Función para obtener la ruta correcta
  const getItemRoute = () => {
    if (item.subItems.length === 0) {
      return item.route; // Si no hay subItems, devuelve la ruta del elemento
    } else {
      return null; // Si hay subItems, no redirige a ninguna parte
    }
  };

  const getSessionMessage = () => {
    if (usersContext?.role === 'isAdmin') {
      return "Sesión de administrador";
    } else if (usersContext?.role === 'isStudent') {
      return "Sesión de estudiante";
    } else if (usersContext?.role === 'isTeacher') {
      return "Sesión de profesor";
    }
    return null;
  };

  return (
    <div className="menuItem">
      {getItemRoute() ? (
        <Link to={getItemRoute()} className="menuItemLink text-decoration-none text-dark">
          <div className="menuItemTitle">
            <span>{item.title}</span>
          </div>
        </Link>
      ) : (
        <div onClick={handleToggle} className="menuItemTitle">
          <span>{item.title}</span>
        </div>
      )}

      <div className={isOpen ? "submenu open" : "submenu"}>
        {item.subItems.map((subItem) => (
          <Link
            to={subItem.route}
            key={subItem.title}
            onClick={() => setIsOpen(false)}
            className="submenuItemLink text-decoration-none text-dark"
          >
            <div className="submenuItem">
              {subItem.title}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Menu() {
  const { usersContext } = useUsersContext();

  const menuItems = [
    {
      title: "Home",
      route: "/",
      subItems: [],
    },
  usersContext?.role === 'isStudent' && {
      title: "Estudiante",
      subItems: [
        { title: "Perfil", route: "/perfil" },
      ],
    },
    
    usersContext?.role === 'isAdmin' && {
      title: "Administración",
      subItems: [
        { title: "Cursos", route: "/cursos" },
        { title: "Estudiantes", route: "/students" },
        { title: "Profesores", route: "/teachers" },
        { title: "Matriculación", route: "/matricula" },
        { title: "Usuarios", route: "/users" },
        { title: "Contactos", route: "/contact" },
      ],
    },
    {
      title: "Listados",
      subItems: [
        { title: "Cursos", route: "/vercurso" },
        { title: "Estudiantes por Curso", route: "/matricula" },
      ],
    },
    {
      title: "Accesos",
      subItems: usersContext?.login
        ? [
            { title: "Cambiar Clave", route: "/cambioClave" },
            { title: "Salir", route: "/salir" },
          ]
        : [
            { title: "Iniciar Sesión", route: "/login" },
          ],
    },
  ].filter(Boolean); 

  const [isExpanded, setIsExpanded] = useState(false);
  const menuRef = useRef(null);

  const getSessionMessage = () => {
    if (usersContext?.role === 'isAdmin') {
      return "Sesión de administrador";
    } else if (usersContext?.role === 'isStudent') {
      return "Sesión de estudiante";
    } else if (usersContext?.role === 'isTeacher') {
      return "Sesión de profesor";
    }
    return null;
  };

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className="menu " ref={menuRef}>
        {menuItems.map((item) => (
          <MenuItem className="" key={item.title} item={item} />
        ))}
        {usersContext?.login && (
          <>
            <p className="m-8 text-white text-uppercase text-center fw-bold x-small">
              {getSessionMessage()}
            </p>
            <p className="text-white text-center x-small">
              Sr(a) {usersContext?.nombre} {usersContext?.apellido}
            </p>
          </>
        )}
      </div>
    </>
  );
}

export default Menu;

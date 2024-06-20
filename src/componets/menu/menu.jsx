import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./menu.css"; // Archivo CSS donde definiremos los estilos

function MenuItem({ item }) {
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
  const menuItems = [
    {
      title: "Home",
      route: "/",
      subItems: [],
    },
    {
      title: "Estudiante",
      subItems: [
        { title: "Registro", route: "/register" },
        { title: "Perfil", route: "/perfil" },
      ],
    },
    {
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
      subItems: [
        { title: "Inicio Sesión", route: "/login" },
        { title: "Cambio de Clave", route: "/cambioClave" },
        { title: "Salir", route: "/salir" },
      ],
    },
  ];

  const [isExpanded, setIsExpanded] = useState(false);
  const menuRef = useRef(null);



  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
    <div className="menu" ref={menuRef}>
      {menuItems.map((item) => (
        <MenuItem key={item.title} item={item} />
      ))}
    </div>
    </>
  );
}

export default Menu;

import React from "react";

import Home from "./Hone/home";
import Cursos from "./Cursos/ListCursos";
import Registro from "./Estudiantes/Registro";
import Perfil from "./Estudiantes/Perfil";
import Students from "./Estudiantes/ListStudents";
import Teachers from "./Profesores/ListTeachers";
import Matricula from "./MatriculaCursos/ListMatricula";
import Contact from "./Contacts/ListContacts";
import Users from "./User/ListUser";
import Login from "./User/Login";
import Logout from "./User/Logout";
import Cambio from "./User/CambioClave";

// import Exit from "./components/Exit";

const routes = [
  { path: "/", element: <Home /> },
  {
    path: "/cursos",
    element: <Cursos title={"Gestión de Cursos"} accion={"gestionar"} />,
  },
  {
    path: "/students",
    element: <Students title={"Gestión de Estudiantes"} />,
  },
  {
    path: "/register",
    element: <Registro title={"Registro de Estudiantes"} />,
  },
  {
    path: "/perfil",
    element: <Perfil title={"Modificación de Perfil del Estudiante"} />,
  },
  {
    path: "/teachers",
    element: <Teachers title={"Gestión de Profesores"} />,
  },
  {
    path: "/matricula",
    element: <Matricula title={"Matriculación de Estudiantes"} />,
  },
  {
    path: "/vercurso",
    element: <Cursos title={"Consulta de Cursos"} accion={"ver"} />,
  },
  {
    path: "/contact",
    element: <Contact title={"Contactos"} />,
  },
  {
    path: "/users",
    element: <Users title={"Gestión de Usuarios"} />,
  },
  {
    path: "/login",
    element: <Login title={"Login"} />,
  },
  { path: "/salir", element: <Logout /> },
  { path: "/cambioClave", element: <Cambio /> },
];

export default routes;

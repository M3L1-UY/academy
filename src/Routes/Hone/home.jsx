import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DropdownMenu from "../../componets/menu/menu";
import Menu from "../../componets/menu/menu";
import routes from "../index";
import { Link } from "react-router-dom";
import MainSection from "./MainSection";
import CardCourse from "./CardCourse";
import Contact from "../Contacts/Contact";

const Home = () => {
  return (
    <>
      <div className="container">
        <MainSection />
        <CardCourse />
        <h3 className="mt-5">Únete a Nosotros</h3>
        <hr className="icon"/>
        <p>
          Envíanos un mensaje y te atenderemos a la brevedad posible. Registrate
          en el siguiente <Link to={"/register"} className="text-decoration-none">link</Link> y forma parte de
          nuestro selecto grupos de estudiantes.
        </p>
        <br/>
        <Contact />
      </div>
    </>
  );
};

export default Home;

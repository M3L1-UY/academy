import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Menu from "./componets/menu/menu";
import ScrollButton from "./Routes/Hone/ScrollButton";
import routes from "./Routes/index";
import Footer from "./Routes/footer/Footer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import "./App.css";

const AcademApp = () => {
  const [menuActive, setMenuActive] = useState(false);
  const menuRef = useRef(null);
  const navIconRef = useRef(null);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const handleClickOutside = (event) => {
    if (!menuRef.current.contains(event.target) && !navIconRef.current.contains(event.target)) {
      setMenuActive(false);
    }
  };

  useEffect(() => {
    if (menuActive) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuActive]);

  return (
    <Router>
      <header>
        <div ref={navIconRef} onClick={toggleMenu} className="nav-icon">
          <FontAwesomeIcon icon={faBars} />
        </div>
        <div className="banner">
        <h3>IT ACADEMY</h3>
        </div>
      </header>
      <main className="main">
        <aside ref={menuRef} className={`aside ${menuActive ? 'active' : ''} sticky`}>
          <Menu />
        </aside>
        <section className="section">
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </section>
        
      </main>

      <Footer />
      <ScrollButton />
    </Router>
  );
};

export default AcademApp;

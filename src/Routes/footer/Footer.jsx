import React from "react";
import { SlSocialInstagram } from "react-icons/sl";
import { ImWhatsapp } from "react-icons/im";
import { TfiEmail } from "react-icons/tfi";
import { BsTelephone } from "react-icons/bs";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { PiMapPinLine } from "react-icons/pi";
import "./Footer.css";

export default function Footer() {
  return (
    <>
      <footer>
        <section className="footer-body">
          <div className="ubicacion">
            <h6 className="linea"> Ubicación</h6>
            <p className="encuentrano">
              {" "}
              <PiMapPinLine className="icon-color" /> Primer piso, Sindhu
              Center, Moon Market, cerca del restaurante Bundu Khan, Allama
              Iqbal Town, Lahore
            </p>
            <p className="phone">
              <BsTelephone className="icon-color" /> +598 543234543
            </p>
            <p className="correo">
              <MdOutlineMarkEmailRead className="icon-color" /> info@academy.com
            </p>
          </div>
          <div className="abour">
            <h6 className="linea">Nosotros</h6>
            <p>
              Estamos aquí para la comunidad. La misión es hacer que la
              educación de calidad sea asequible y accesible para todos en esta
              región. 
            </p>
          </div>
          <div className="ubicanos">
            <h6 className="linea">Contactanos</h6>
            <p>
              <ImWhatsapp className="icon-color" /> WhatSapp
            </p>
            <p>
              <SlSocialInstagram className="icon-color" /> Instagram
            </p>
            <p>
              <TfiEmail className="icon-color" /> Correo Electrónico
            </p>
          </div>
        </section>
        <section className="footer-footer">
          <p>Copyright 2024 - IT Academy - Todos los derechos reservados.</p>
        </section>
      </footer>
    </>
  );
}

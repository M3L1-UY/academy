import img from "../../assets/vertical-market-software.webp";

function MainSection() {
  return (
    <>
      {
        <div className="mt-2">
          <h3>Bienvenido!</h3>
          <hr />
          <section className="prinSetion">
              <div className="cont-image">
              <p>
                Nos complace ofrecer una amplia gama de 
                <b> cursos de informática </b>
                 diseñados para satisfacer sus necesidades de aprendizaje, sin
                importar su nivel de experiencia. En nuestro instituto,
                encontrará un equipo dedicado de instructores expertos
                apasionados por la enseñanza y listos para ayudarlo a tener
                éxito.

              <br/>
              <br/>
                Nuestra misión es brindarle las habilidades y conocimientos que
                necesita para tener éxito en la era digital actual. Creemos que
                todos deberían tener acceso a una educación de calidad, por eso
                nos esforzamos por brindar opciones de aprendizaje asequibles y
                flexibles. Nuestros cursos están diseñados para ser prácticos y
                prácticos, brindándole la oportunidad de aplicar lo que aprende
                en entornos del mundo real.
                <br/>
                <br/>
                <b>Únase al mejor instituto de IT</b> y emprenda un viaje de
                crecimiento y éxito con nosotros.
              </p>
              <img src={img} alt="" />
              </div>
          </section>
        </div>
      }
    </>
  );
}

export default MainSection;

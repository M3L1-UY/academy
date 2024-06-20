import { useRef, useState, useEffect } from "react";
import { AppContextProvider } from "../../hooks/appContext";
import { VscChromeClose } from "react-icons/vsc";
import "./modal.css";

function Modal({ children, title, modalClose, size, modalNivel, bgChange }) {
  const [clase, setClase] = useState("");
  const ref = useRef(null);
  const modelref = useRef(null);

  useEffect(() => {
    switch (size) {
      case "small":
        setClase("modalView modalViewSmall");
        break;
      case "medio":
        setClase(
          `modalView modalViewMedio ${bgChange ? "modalBodyGrey" : "modalBodyWhite"}`
        );
        break;
      case "big":
        setClase("modalView modalViewBig");
        break;
      default:
        setClase("modalView");
        break;
    }
  }, [size, bgChange]);

  function handleClose() {
    ref.current.classList.add("fadeOut");
    ref.current.addEventListener("animationend", () => {
      modalClose();
      ref.current.remove();
    });
  }

  function handleNivelClose() {
    modelref.current.classList.add("fadeOut");
    modelref.current.addEventListener("animationend", () => {
      modelref.current.remove();
    });
  }

  return (
    <AppContextProvider>
      <div className="modalContainer" ref={modalNivel === 1 ? ref : modelref}>
        <div className={clase}>
          <div className="modalHeader">
            <div className="title">{title}</div>
            <div>
              <button
                className="closeButton"
                onClick={modalNivel === 1 ? handleClose : handleNivelClose}
              >
                <VscChromeClose />
              </button>
            </div>
          </div>
          <div className="modalContent">{children}</div>
        </div>
      </div>
    </AppContextProvider>
  );
}

export default Modal;

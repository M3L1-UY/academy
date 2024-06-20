import React, { Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";

function OpenModal(openModal, handleClose, size, tittle, modalNivel, bgChange) {
  const Modal = lazy(() => import("./Modal"));
  const modalDiv = document.createElement("div");
  modalNivel == 1 ? (modalDiv.id = "modal") : (modalDiv.id = "modalDos");
  document.body.appendChild(modalDiv);
  const root = createRoot(modalDiv);
  root.render(
    <Suspense fallback={<div>Cargando...</div>}>
    <Modal
      // root={root}
      title={tittle}
      modalClose={handleClose}
      size={size}
      modalNivel={modalNivel}
      bgChange={bgChange}
    >
      {openModal}
    </Modal>
    </Suspense>
  );
}

export default OpenModal;

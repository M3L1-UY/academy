import { useState, useEffect } from "react";
import { ImPrevious2 } from "react-icons/im";
import { ImNext2 } from "react-icons/im";
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { TbPlayerTrackPrevFilled } from "react-icons/tb";

const Pagination = ({ items, page, pagItems, nextPage, onPageChange }) => {
  const [pageSize, setPageSize] = useState(pagItems);
  const [currentPage, setCurrentPage] = useState(page);
  let firstPage = 1;
  let botonSeleccionado = null;

  const listItems = [];
  if (!items) {
    return;
  }
  const totalPages = Math.ceil(items.length / pageSize);

  const onPageSizeChange = (newPageSize) => {
    const startIndex = (currentPage - 1) * newPageSize;
    const endIndex = startIndex + newPageSize;
    const currentItems = items.slice(startIndex, endIndex);
    setPageSize(newPageSize);
    nextPage(newPageSize, currentPage);
    onPageChange(currentItems);
  };

  const handlePageChange = (newPage) => {
    if (newPage > totalPages) {
      newPage = totalPages;
    }
    if (newPage < 1) {
      newPage = 1;
    }

    /* Seccion de selección del boton actívo */
    if (botonSeleccionado) {
      botonSeleccionado.classList.remove("activo");
    }
    const nuevoBoton = document.getElementById(`btn${newPage}`);
    if (nuevoBoton) {
      nuevoBoton.classList.add("activo");
      botonSeleccionado = nuevoBoton;
    }
    /* **************************************** */

    setCurrentPage(newPage);
    const startIndex = (newPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentItems = items ? items.slice(startIndex, endIndex) : 1;
    nextPage(pageSize, newPage);
    onPageChange(currentItems);
  };

  let start = 1;
  let end = currentPage + 3;
  if (end >= totalPages) {
    end = totalPages;
  }
  start = end - 4;

  if (start < 0) {
    start = 0;
  }

  for (let index = start; index < end; index++) {
    listItems.push(
      <li
        id={`btn${index + 1}`}
        key={index}
        onClick={() => handlePageChange(index + 1)}
      >
        {index + 1}
      </li>
    );
  }

  useEffect(() => {
    items && handlePageChange(1);
  }, [items]);

  useEffect(() => {
    onPageSizeChange(pageSize);
  }, []);
  return (
    <>
      <section className="pagination">
        <div className="pageSice">
          <label htmlFor="pageSize">Registros por página:</label>
          <select
            id="pageSize"
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            value={pageSize}
          >
            <option value={8}>8</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
        <ul className="pagPagination">{listItems}</ul>
        <div className="buttonPagination">
          <a
            className="btnPagination"
            onClick={() => handlePageChange(firstPage)}
            disabled={firstPage}
          >
            <ImPrevious2 />
          </a>
          <a
            className="btnPagination"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <TbPlayerTrackPrevFilled />
          </a>
          <a
            className="btnPagination"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <TbPlayerTrackNextFilled />
          </a>
          <a
            className="btnPagination"
            onClick={() => handlePageChange(totalPages)}
            disabled={totalPages}
          >
            <ImNext2 />
          </a>
          <span>
            Página {currentPage} de {totalPages}
          </span>
        </div>
      </section>
    </>
  );
};

export default Pagination;

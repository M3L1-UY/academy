import { useEffect, useRef } from "react";
import openModal from "../../componets/modal/OpenModal";
import Pagination from "../../componets/services/Pagination ";
import Curso from "./Curso";
import VerCurso from "./VerCurso";
import Buscador from "../../componets/Buscador";
import { useAppContext } from "../../hooks/appContext";
import Swal from "sweetalert2";
import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { FaTrashAlt } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { IoMdAdd } from "react-icons/io";
import { FaRegEye } from "react-icons/fa";
import AccessProfil from "../../componets/services/AccessProfil";
import { useNavigate } from "react-router-dom";

export default function ListCurso({ title, accion }) {
  AccessProfil(accion === "gestionar" ? "isTeacher" : "isAdmin");

  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  const url = `${hostServer}/api/courses`;
  const { HandleClose } = useAppContext();
  const [selectedItems, setSelectedItems] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPage, setItemsPage] = useState(8);
  const [progress, setProgress] = useState(false);
  let { data, isLoading, getData, deleteData } = useFetch(`${url}`);
  const bgChange = true;
  const modalNivel = 1;
  const filters = [
    { id: 1, nombre: "codigo", descrip: "Código" },
    { id: 2, nombre: "nombre", descrip: "Nombre" },
  ];

  const handleAddCursos = () => {
    const tittle = "Adición de Cursos";
    openModal(
      <Curso curso={""} edit={false} riviewList={updateList} />,
      HandleClose,
      "medio",
      tittle,
      modalNivel,
      bgChange
    );
  };

  const handleEdit = (curso) => {
    const tittle = "Edición de Cursos";
    console.log(curso);
    openModal(
      <Curso curso={curso} edit={true} riviewList={updateList} />,
      HandleClose ,
      "medio",
      tittle,
      modalNivel,
      bgChange
    );
  };

  const handleVer = (curso) => {
    const tittle = "Consulta de Cursos";
    openModal(
      <VerCurso curso={curso} />,
      HandleClose ,
      "medio",
      tittle,
      modalNivel,
      bgChange
    );
  };


  const updateList = async () => {
    await getCursos();
  };

  const handleDel = (id) => {
    const url = `${hostServer}/api/course`;

    const delId = id;
    Swal.fire({
      title: "Está Seguro?",
      text: "Desea eliminar este registro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteData(url, delId);
          if (response.status === 200) {
            const deletedCourse = response.data;
            // Elimina la imagen asociada al curso si existe
            if (deletedCourse.urlImagen) {
              await deleteFile(deletedCourse.codigo);
            }
            await Swal.fire({
              title: "Eliminado!",
              text: "El curso fue eliminado.",
              icon: "success",
            });
            await getCursos();
          } else {
            throw new Error(response.data.message);
          }
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: error.message || "Hubo un error al eliminar el curso.",
            icon: "error",
          });
        }
      }
    });
  };

  const nextPage = (pagItems, pageCurrent) => {
    setItemsPage(pagItems);
    setPage(pageCurrent);
  };

  const handlePageChange = (newSelectedItems) => {
    setSelectedItems(newSelectedItems);
  };

  const getCursos = async () => {
    const url = `${hostServer}/api/courses`;
    await getData(url);
  };

  useEffect(() => {
    if (data?.message || data?.message != undefined) {
      Swal.fire(data?.message);
    }
  }, [data]);

  useEffect(() => {
    getCursos();
  }, []);

  return (
    <>
      {isLoading ? (
        <h3 className="mt-5">Cargando...</h3>
      ) : (
        selectedItems && (
          <>
            <div className="container">
            <div className="tittle">{title}</div>
              <div className="tittle-search">
                <div className="search">
                  <Buscador
                    filters={filters}
                    registros={data?.data?.data}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
              <div className="tablaListado">
              <button className="addBtn" onClick={handleAddCursos}>
                  <IoMdAdd />
                </button>
                <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead>
                  <tr className="table-dark">
                    <th scope="col">Código</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Costo</th>
                    <th scope="col" colSpan={2}>
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    selectedItems.map((curso) => {
                      if (accion !== "ver") {
                        return (
                          <tr key={curso._id}>
                            <td>{curso.codigo}</td>
                            <td>{`${curso.nombre}`} </td>
                            <td>{curso.costo}</td>
                            <td>
                              <TbEdit
                                className=".btnShow"
                                style={{ fontSize: "25px" }}
                                onClick={() => handleEdit(curso)}
                              />
                            </td>
                            <td>
                              <FaTrashAlt
                                style={{ fontSize: "25px" }}
                                onClick={() => handleDel(curso._id)}
                              />
                            </td>
                          </tr>
                        );
                      } else {
                        return (
                          <tr key={curso._id}>
                            <td>{curso.codigo}</td>
                            <td>{`${curso.nombre}`} </td>
                            <td>{`${curso.costo}`} </td>
                            <td>
                              <FaRegEye
                                className=".btnShow"
                                style={{ fontSize: "25px" }}
                                onClick={() => handleVer(curso)}
                              />
                            </td>
                          </tr>
                        );
                      }
                    })
                  }
                </tbody>
              </table>
              </div>
              </div>
              {data?.data?.data && (
                <Pagination
                  items={data?.data?.data}
                  page={page}
                  pagItems={itemsPage}
                  nextPage={nextPage}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </>
        )
      )}
    </>
  );
}

import { useEffect, useRef } from "react";
import openModal from "../../componets/modal/OpenModal";
import Pagination from "../../componets/services/Pagination ";
import Matricula from "./Matricula";
import Buscador from "../../componets/Buscador";
import AccessProfil from "../../componets/services/AccessProfil";
import Swal from "sweetalert2";
import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { FaTrashAlt } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { IoMdAdd } from "react-icons/io";
import { useAppContext } from "../../hooks/appContext";
import { useUsersContext } from "../../hooks/UsersContext";


export default function ListMatricula({ title }) {
  AccessProfil("isTeacher");
  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  const { HandleClose } = useAppContext();

  const url = `${hostServer}/api/matriculas`;
  const [selectedItems, setSelectedItems] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPage, setItemsPage] = useState(8);
  let { data, isLoading, getData, deleteData } = useFetch(`${url}`);
  const bgChange = true;
  const modalNivel = 1;
  const filters = [
    { id: 1, nombre: "cursoNombre", descrip: "Curso" },
    { id: 2, nombre: "teacherNombre", descrip: "Profesor" },
    { id: 3, nombre: "studentNombre", descrip: "Estudiante" },
    { id: 4, nombre: "turno", descrip: "Turno" },
  ];
  const { usersContext } = useUsersContext();


  function handleAddMatriculas() {
    const tittle = "Adición de Matrícula";
    openModal(
      <Matricula matricula={""} edit={false} riviewList={updateList} />,
      HandleClose,
      "small",
      tittle,
      modalNivel,
      bgChange
    );
  }

  function handleEdit(matricula) {
    const tittle = "Edición de Matrícula";
    openModal(
      <Matricula matricula={matricula} edit={true} riviewList={updateList} userContext={usersContext}/>,
      HandleClose,
      "small",
      tittle,
      modalNivel,
      bgChange
    );
  }

  const updateList = async () => {
    await getMatriculas();
  };

  const handleDel = async (id) => {
    const url = `${hostServer}/api/matricula`;

    const delId = id;
    Swal.fire({
      title: "Está Seguro?",
      text: "Desea eliminar esta inscripción?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!",
    }).then((result) => {
      if (result.isConfirmed) {
        const borrar = async () => {
          const resp = await deleteData(url, delId);
          getMatriculas();
          await Swal.fire({
            title: "Eliminado!",
            text: "La inscripción fue eliminada.",
            icon: "success",
          });
        };
        borrar();
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

  const getMatriculas = async () => {
    const url = `${hostServer}/api/matriculas`;
    const result = await getData(url);
  };

  useEffect(() => {
    if (data?.message || data?.message != undefined) {
      Swal.fire(data?.message);
    }
  }, [data]);

  useEffect(() => {
    getMatriculas();
  }, []);

  return (
    <>
      {isLoading ? (
        <h3 className="mt-5">Cargando...</h3>
      ) : (
        selectedItems && (
          <>
            <div className=" container">
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
             {usersContext?.role === "isAdmin" &&
              <button className="addBtn" onClick={handleAddMatriculas}>
                  <IoMdAdd />
                </button>}
                <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead>
                  <tr className="table-dark">
                    {/* <th scope="col">#</th> */}
                    <th scope="col">Curso</th>
                    <th scope="col">Profesor</th>
                    <th scope="col">Alumno</th>
                    <th scope="col">Turno</th>
                    {usersContext?.role === "isAdmin" && (
                    <th scope="col" colSpan={2}>
                      Acción
                    </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {data?.status === 500 ? (
                    <tr>
                      <td scope="col" colSpan={7}>
                        <h3 className="textCenter">
                          No hay información para esta Entidad.
                        </h3>
                      </td>
                    </tr>
                  ) : (
                    selectedItems.map((matricula) => {
                      return (
                        <tr key={matricula._id}>
                          {/* <td>{matricula.id}</td> */}
                          <td>{matricula.cursoNombre}</td>
                          <td>{`${matricula.teacherNombre}`} </td>
                          <td>{`${matricula.studentNombre}`} </td>
                          <td>{`${matricula.turno}`} </td>
                          {usersContext?.role === "isAdmin" && (<>
                          <td>
                            <TbEdit
                              className=".btnShow"
                              style={{ fontSize: "25px" }}
                              onClick={() => handleEdit(matricula, usersContext)}
                            />
                          </td>
                          <td>
                            <FaTrashAlt
                              style={{ fontSize: "25px" }}
                              onClick={() => handleDel(matricula._id)}
                            />
                          </td></>)}
                        </tr>
                      );
                    })
                  )}
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

import { useEffect } from "react";
import openModal from "../../componets/modal/OpenModal";
import Pagination from "../../componets/services/Pagination ";
import Teacher from "./Teacher";
import Buscador from "../../componets/Buscador";
import { useAppContext } from "../../hooks/appContext";
import Swal from "sweetalert2";
import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { FaTrashAlt } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { IoMdAdd } from "react-icons/io";
import AccessProfil from "../../componets/services/AccessProfil";
// import "./teacher.css";

export default function ListTeacher({ title }) {
  AccessProfil();
  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  const url = `${hostServer}/api/teachers`;
  const { HandleClose } = useAppContext();
  const [selectProfs, setSelectedProfs] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPage, setItemsPage] = useState(8);
  let { data, isLoading, getData, deleteData } = useFetch(`${url}`);
  const filters = [
    { id: 1, nombre: "dni", descrip: "Documento" },
    { id: 2, nombre: "apellido", descrip: "Apellido" },
    { id: 3, nombre: "email", descrip: "Email" },
    { id: 4, nombre: "celular", descrip: "Celular" },
  ];

  function handleAddTeachers() {
    const modalNivel = 1;
    const tittle = "Adición de Profesores";
    openModal(
      <Teacher teacher={""} edit={false} riviewList={updateList} />,
      HandleClose,
      "medio",
      tittle,
      modalNivel,
      true
    );
  }

  function handleEdit(teacher) {
    const modalNivel = 1;
    const tittle = "Edición de Profesores";
    openModal(
      <Teacher teacher={teacher} edit={true} riviewList={updateList} />,
      HandleClose,
      "medio",
      tittle,
      modalNivel,
      true
    );
  }

  const updateList = async () => {
    await getTeachers();
  };

  const handleDel = async (id) => {
    const url = `${hostServer}/api/teacher`;
    const delId = id;
    Swal.fire({
      title: "Está Seguro?",
      text: "Desea eliminar este registro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!",
    }).then((result) => {
      if (result.isConfirmed) {
        const borrar = async () => {
          const resp = await deleteData(url, delId);
          getTeachers();
          await Swal.fire({
            title: "Eliminado!",
            text: "El profesor fue eliminado.",
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

  const getTeachers = async () => {
    const url = `${hostServer}/api/teachers`;
    await getData(url);
  };

  useEffect(() => {
    if (data?.message || data?.message != undefined) {
      Swal.fire(data?.message);
    }
    //  else {
    //   const items = data?.data.data.filters((item) => {
    //     item.condicion = "activo";
    //   });
    //   setSelectedProfs(items);
    // }
  }, [data]);

  useEffect(() => {
    getTeachers();
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
              <button className="addBtn" onClick={handleAddTeachers}>
                    <IoMdAdd />
                  </button>
                  <div className="table-responsive">    
              <table className="table table-striped table-bordered">
                <thead>
                  <tr className="table-dark">
                    {/* <th scope="col">#</th> */}
                    <th scope="col">Documento</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Correo Electrónico</th>
                    <th scope="col">Celular</th>
                    <th scope="col" colSpan={2}>
                      Acción
                    </th>
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
                    selectedItems.map((teacher) => {
                      return (
                        <tr key={teacher._id}>
                          {/* <td>{teacher.id}</td> */}
                          <td>{teacher.dni}</td>
                          <td>{`${teacher.nombre} ${teacher.apellido}`} </td>
                          <td>{teacher.email}</td>
                          <td>{teacher.celular}</td>
                          <td>
                            <TbEdit
                              className=".btnShow"
                              style={{ fontSize: "25px" }}
                              onClick={() => handleEdit(teacher)}
                            />
                          </td>
                          <td>
                            <FaTrashAlt
                              style={{ fontSize: "25px" }}
                              onClick={() => handleDel(teacher._id)}
                            />
                          </td>
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

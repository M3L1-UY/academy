import { useState, useEffect, useRef } from "react";
import openModal from "../../componets/modal/OpenModal";
import Buscador from "../../componets/Buscador";
import Pagination from "../../componets/services/Pagination ";
import AccessProfil from "../../componets/services/AccessProfil";
import { useFetch } from "../../hooks/useFetch";
import User from "./User";
import { useUsersContext } from "../../hooks/UsersContext";
import { useAppContext } from "../../hooks/appContext";
import Swal from "sweetalert2";
import { FaTrashAlt } from "react-icons/fa";
import { TbEdit } from "react-icons/tb";
import { IoMdAdd } from "react-icons/io";

export default function ListUser({ title }) {
  // const { setUsersContext } = useUsersContext();
  AccessProfil();
  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  const api = `${hostServer}/api/users`;
  const { HandleClose } = useAppContext();
  const ref = useRef(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPage, setItemsPage] = useState(8);
  let { data, isLoading, getProtectedData, deleteData } = useFetch(`${api}`);

  const filters = [
    { id: 1, nombre: "Dni", descrip: "Documento" },
    { id: 2, nombre: "nombre", descrip: "Nombre" },
    { id: 3, nombre: "email", descrip: "Email" },
  ];

  function handleAddUsers() {
    const modalNivel = 1;
    const tittle = "Adición de Usuarios";
    openModal(
      <User user={""} edit={false} riviewList={updateList} />,
      HandleClose,
      "medio",
      tittle,
      modalNivel, 
      true
    );
  }

  function handleEdit(user) {
    const modalNivel = 1;
    const tittle = "Edición de Usuarios";
    openModal(
      <User user={user} edit={true} riviewList={updateList} />,
      HandleClose,
      "medio",
      tittle,
      modalNivel,
      true
    );
  }

  const updateList = async () => {
    await getUsers();
  };

  const handleDel = async (id) => {
    const url = `${hostServer}/api/user`;
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
          getUsers();
          await Swal.fire({
            title: "Eliminado!",
            text: "El usuario fue eliminado.",
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

  const getUsers = async () => {
     await getProtectedData(api);
  };

  const translateRole = (role) => {
    switch (role) {
      case "isTeacher":
        return "Profesor";
      case "isAdmin":
        return "Administrador";
      case "isStudent":
        return "Estudiante";
      default:
        return "Desconocido";
    }
  };

  const getRoleClass = (role) => {
    switch (role) {
      case "isTeacher":
        return "text-info role-style"; // Azul
      case "isAdmin":
        return "text-danger role-style"; // Rojo
      case "isStudent":
        return "text-success role-style"; // Verde
      default:
        return "";
    }
  };

  useEffect(() => {
    if (data?.message || data?.message != undefined) {
      Swal.fire(data?.message);
    }
  }, [data]);

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      {isLoading ? (
        <h3 className="mt-5 text-center">Cargando...</h3>
      ) : (
        // ) : error ? (
        //   <h3>Error de comunicación con el Servidor...</h3>
        selectedItems && (
          <div className="container">
            {/* <h1 className="my-3 text-2xl font-bold"></h1> */}
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
            <button className="addBtn" onClick={handleAddUsers}>
                <IoMdAdd />
              </button>
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead>
                  <tr className="table-dark">
                    <th scope="col">Documento</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Correo Electrónico</th>
                    <th scope="col">Rol</th>
                    <th scope="col" colSpan={3}>
                      Acción
                    </th>
                  </tr>
                </thead>
                {data?.status === 500 ? (
                  <tbody>
                    <tr>
                      <td scope="col" colSpan={7}>
                        <h3 className="textCenter">
                          No hay información para esta Entidad.
                        </h3>
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    {selectedItems.map((user) => {
                      return (
                        <tr key={user._id}>
                          <td>{user.dni}</td>
                          <td>{`${user.nombre} ${user.apellido}`} </td>
                          <td>{user.email}</td>
                          <td className={getRoleClass(user.role)}>
                              {translateRole(user.role)}
                            </td>
                          <td>
                            <TbEdit
                              className=".btnShow"
                              style={{
                                fontSize: "25px",
                              }}
                              onClick={() => handleEdit(user)}
                            />
                          </td>
                          <td>
                            <FaTrashAlt
                              style={{
                                fontSize: "25px",
                              }}
                              onClick={() => handleDel(user._id)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                )}
              </table>
            </div>
            </div>
            {data?.data?.data && (
              <Pagination
                items={data.data.data}
                page={page}
                pagItems={itemsPage}
                nextPage={nextPage}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        )
      )}
    </>
  );
}

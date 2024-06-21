import { useEffect, useState } from "react";
import Pagination from "../../componets/services/Pagination ";
import Buscador from "../../componets/Buscador";
import { useAppContext } from "../../hooks/appContext";
import Swal from "sweetalert2";
import { useFetch } from "../../hooks/useFetch";
import { FaTrashAlt, FaCheckCircle, FaRegCircle } from "react-icons/fa";
import AccessProfil from "../../componets/services/AccessProfil";
import { TbEdit } from "react-icons/tb";
import { IoMdAdd } from "react-icons/io";
import { useForm } from "../../hooks/useForm";

export default function ListContacts({ title, accion }) {
  AccessProfil("isAdmin");
  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  const { HandleClose } = useAppContext();
  const url = `${hostServer}/api/contacts`;
  const [selectedItems, setSelectedItems] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPage, setItemsPage] = useState(8);
  const { data, isLoading, getData, updateData, deleteData } = useFetch(url);
  const bgChange = true;
  const modalNivel = 1;
  const filters = [
    { id: 1, nombre: "email", descrip: "Email" },
    { id: 2, nombre: "nombre", descrip: "Nombre" },
  ];

  let { convertDateFormat } =  useForm();

  const handleEdit = async (id) => {
    const url = `${hostServer}/api/contact`;
    Swal.fire({
      title: "¿Está seguro?",
      text: "¿Desea modificar el estado?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, confirmar!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const modificar = async () => {
            const resp = await updateData(url, id, null);
            await getContacts();
            await    Swal.fire({
              title: "Realizado!",
              text: "El estado fue modificado.",
              icon: "success",
            });
          };
          modificar();
          
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: error.message || "Hubo un error al modificar el contacto.",
            icon: "error",
          });
        }
      }
    });
  }

  const updateList = async () => {
    await getContacts();
  };
  const handleDel = async (id) => {
    AccessProfil();
    const url = `${hostServer}/api/contact`;
    const delId = id;
    Swal.fire({
      title: "¿Está seguro?",
      text: "¿Desea eliminar este registro?",
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
            Swal.fire({
              title: "Eliminado!",
              text: "El contacto fue eliminado.",
              icon: "success",
            });
            await getContacts();
          } else {
            throw new Error(response.data.message);
          }
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: error.message || "Hubo un error al eliminar el contacto.",
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

  useEffect(() => {
    if (data?.message || data?.message !== undefined) {
      Swal.fire(data?.message);
    }
  }, [data]);

  const getContacts = async () => {
    try {
      const url = `${hostServer}/api/contacts`;
      const result = await getData(url);
      console.log(result)
           } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    getContacts(); 
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
                <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead>
                  <tr className="table-dark">
                    <th scope="col">Fecha</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Correo Electrónico</th>
                    <th scope="col">Comentario</th>
                    <th scope="col">Estado</th>
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
                    selectedItems.map((contact) => (
                      <tr key={contact._id}>
                        <td>{convertDateFormat(contact.createdAt)}</td>
                        <td>{contact.nombre}</td>
                        <td>{contact.email}</td>
                        <td>{contact.comentario}</td>
                        <td>
                              {contact.done ? (
                                <FaCheckCircle style={{ color: "green", fontSize: "20px" }} />
                              ) : (
                                <FaRegCircle style={{ color: "red", fontSize: "20px" }} />
                              )}
                            </td>
                        <td>
                          <TbEdit
                            className="btnShow"
                            style={{ fontSize: "25px" }}
                            onClick={() => handleEdit(contact._id)}
                          />
                        </td>
                        <td>
                          <FaTrashAlt
                            style={{ fontSize: "25px" }}
                            onClick={() => handleDel(contact._id)}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
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
          </>
        )
      )}
    </>
  );
}

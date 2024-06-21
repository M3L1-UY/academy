import { useState, useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useForm } from "../../hooks/useForm";
import StarRating from "../Hone/StarRating";
import Swal from "sweetalert2";
import { useAppContext } from "../../hooks/appContext";
import validationSchema from "../../componets/services/validationSchema";
import "../../home.css";


export default function VerCurso({ curso , accion}) {
  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  const { HandleNivelClose } = useAppContext();
  const api = `${hostServer}/api/course`;
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState(false);
  const initialForm = {
    id: curso ? curso.id : "",
    codigo: curso ? curso.codigo : "",
    nombre: curso ? curso.nombre : "",
    descripcion: curso ? curso.descripcion : "",
    costo: curso ? curso.costo : "",
    condicion: curso ? curso.condicion : "",
    duracion: curso ? curso.duracion : "",
    clasificacion: curso ? curso.clasificacion : "",
  };
  const [imageCourse, setImageCourse] = useState(null);
  const [urlImageCourse, setUrlImageCourse] = useState(
    curso ? curso.urlImagen : null
  );
  const [profesores, setProfesores] = useState([
    {
      id: 1,
      profesor: curso.profesores ? curso?.profesores[0]?.profesor : "",
      costoHora: curso.profesores ? curso?.profesores[0]?.costoHora : "",
    },
    {
      id: 2,
      profesor: curso.profesores ? curso?.profesores[1]?.profesor : "",
      costoHora: curso.profesores ? curso?.profesores[1]?.costoHora : "",
    },
    {
      id: 3,
      profesor: curso.profesores ? curso?.profesores[2]?.profesor : "",
      costoHora: curso.profesores ? curso?.profesores[2]?.costoHora : "",
    },
    {
      id: 4,
      profesor: curso.profesores ? curso?.profesores[3]?.profesor : "",
      costoHora: curso.profesores ? curso?.profesores[3]?.costoHora : "",
    },
  ]);

  let { formData, onInputChange, validateForm, errorsInput, clearForm } =
    useForm(initialForm, validationSchema);

  const { id, codigo, nombre, descripcion, costo, condicion, duracion, clasificacion } = formData;

  let {
    data,
    isLoading = false,
    getData,
    createData,
    updateData,
  } = useFetch(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numError = validateForm();
    formData = { ...formData, profesores };
    handleInputChange();
    if (!numError) {
      let url = `${api}`;
      if (!edit) {
        await createData(url, formData);
      } else {
        await updateData(url, curso.id, formData);
      }
    } else {
      Swal.fire({
        position: "top",
        icon: "info",
        title: "Debes corregir la información para poder registrarla",
        showConfirmButton: false,
        timer: 5000,
      });
    }
  };

  useEffect(() => {
    if (data?.message) {
      data?.message &&
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: data?.message,
          showConfirmButton: false,
          timer: 3500,
        });
    } else {
      if (data?.status === 200 || data?.status === 201) {
        data?.data.message &&
          Swal.fire({
            position: "top",
            icon: "success",
            title: data?.data?.message,
            showConfirmButton: false,
            timer: 3500,
          });
      } else {
        data?.data.message &&
          Swal.fire({
            position: "top",
            icon: "warning",
            title: data?.data?.message,
            showConfirmButton: false,
            timer: 3500,
          });
      }
      if (data?.status === 200) {
        HandleNivelClose();
        riviewList();
      }
      if (data?.status === 201) {
        clearForm();
        riviewList();
      }
    }
  }, [data]);

  const getTeachers = async () => {
    const url = `${hostServer}/api/teachers`;
    const response = await fetch(url);
    const responseData = await response.json();
    if (async () => await responseData.data) {
      setTeachers(responseData.data);
    }
  };

  useEffect(() => {
    getTeachers();
  }, []);

  const handleInputChange = (id, field, value) => {
    setProfesores((prevProfesores) => {
      const nombreExistente = prevProfesores.find(
        (profesor) => profesor.profesor === value
      );
      const costoHoraAnteriorVacio =
        prevProfesores[id - 2] && !prevProfesores[id - 2].costoHora;

      if (nombreExistente || costoHoraAnteriorVacio) {
        if (costoHoraAnteriorVacio) {
          Swal.fire({
            position: "top",
            icon: "warning",
            title: "Debe indicar el costo hora del profesor anterior",
            showConfirmButton: false,
            timer: 4000,
          });
        }
        if (nombreExistente) {
          Swal.fire({
            position: "top",
            icon: "warning",
            title: "El profesor seleccionado ya fué incluído",
            showConfirmButton: false,
            timer: 4000,
          });
        }
        return prevProfesores;
      }

      return prevProfesores.map((profesor) => {
        if (profesor.id === id) {
          return { ...profesor, [field]: value };
        }
        return profesor;
      });
    });
  };

  return (
    <>
      {
        error ? (
          errorMessage()
        ) : (
          <div className="container py-3 px-5">
            <form onSubmit={handleSubmit}>
              <section className="courseVerSection row mt-3 mb-5">
                <div className="col-md-12  mx-auto">
                  <h2 className="text-primary mb-4">{nombre}</h2>
                  <h3 className="text-secondary text-center">Código: {codigo}</h3>
                </div>

                {urlImageCourse ? (
                <div className="imageContainerDiv row mb-5">
                  <img
                    src={urlImageCourse}
                    alt="file"
                    className="upLoadImg"
                  />
                </div>
                  ): ( <div className="mt-4"></div>)}

                <div className="d-flex flex-row justify-content-evenly col-md-12 mx-auto ">
                      <div className="d-flex flex-column align-items-center mb-3">
                        <h5 className="text-dark mb-0 ">Costo</h5>
                        <p className="lead text-success mb-0">${costo} USD</p>
                      </div>
                      <div className="d-flex flex-column align-items-center mb-3">
                        <h5 className="text-dark mb-0">Estado</h5>
                        <p className="lead text-info mb-0">{condicion}</p>
                      </div>
                      <div className="d-flex flex-column align-items-center mb-3">
                        <h5 className="text-dark mb-0">Duración</h5>
                        <p className="lead text mb-0">{duracion} meses</p>
                      </div>
                      </div>
                     
 <div className="d-flex flex-row justify-content-center">
                        <div className="text-info lead p-2 bg-dark rounded mb-3">
                          <StarRating rating={clasificacion} />
                        </div>
                      </div>

                <div className="d-flex justify-content-center align-items-center">
                  
                <div className="p-3 text-center bg-dark rounded text-light ">
                  <div className="form-group col-md-12 ">
                    <label className="title-camp mb-2">
                      Descripción detallada del curso:
                    </label>
                    <div className="course-description text-dark">
                      {descripcion}
                    </div>
                  </div>
                  </div>
                  </div>
                {profesores && 
                <div className="d-flex justify-content-center align-items-center mt-2">
                  <h5 className="text-dark me-2 mb-0">Profesores:</h5>
                  {profesores.map((profesor) => (
                    <div key={profesor.id}>
                      <p className="lead text-dark mb-0">{profesor.profesor}</p>
                    </div>
                  ))}
                </div>
                }
              </section>
            </form>
          </div>
        )
      }
    </>
  );
}

import { useState, useEffect, useRef } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useForm } from "../../hooks/useForm";

import Swal from "sweetalert2";
import { useAppContext } from "../../hooks/appContext";
import validationSchema from "../../componets/services/validationSchema";
import "../../home.css";

export default function VerCurso({ curso }) {
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

  const { id, codigo, nombre, descripcion, costo, condicion } = formData;

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
      // const profesorVacio =
      //   prevProfesores[id - 1] && !prevProfesores[id - 1].profesor;

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
        // isLoading ? (
        // <h3>Cargando...</h3>
        // ) :
        error ? (
          errorMessage()
        ) : (
          <div className="container py-3 px-5">
            <form onSubmit={handleSubmit}>
              <section className="courseVerSection">
                <aside className="px-2">
                  <div className="row  mb-2">
                    <div className="form-group col-md-12">
                      <label className="title-camp">El curso denominado </label>
                      <br />
                      <label className="detail-camp">{nombre} </label>
                    </div>
                  </div>
                  <div className="row  mb-2">
                    <div className="form-group col-md-12">
                      <label className="title-camp">
                        Identificado con el Código{" "}
                      </label>
                      <br />
                      <label className="detail-camp"> {codigo} </label>
                    </div>
                  </div>

                  <div className="row  mb-2">
                    <div className="form-group col-md-12">
                      <label className="title-camp">Tiene un costo de </label>
                      <br />
                      <label className="detail-camp">{costo}</label>
                      <label className="detail-camp"> dolares</label>
                    </div>
                  </div>

                  <div className="row  mb-2">
                    <div className="form-group col-md-12">
                      <label className="title-camp">
                        Para este momento tiene un Estátus
                      </label>
                      <br />
                      <label className="detail-camp">{condicion}</label>
                    </div>
                  </div>
                  <div className="row  mb-2">
                    <label className="title-camp">
                      Los Profesores asignados al curso son;{" "}
                    </label>
                    <br />
                    <br />
                    {profesores.map((profesor) => (
                      <div
                        key={profesor.id}
                        className="form-group col-md-6 mb-3"
                      >
                        <label className="title-camp">
                          Profesor {profesor.id}
                        </label>
                        <br />
                        <label
                          htmlFor={`nombre-${profesor.id}`}
                          className="detail-camp"
                        >
                          {profesor.profesor}
                        </label>
                        <br />

                        <label className="title-camp">
                          El costo hora de su servicio es
                        </label>
                        <br />
                        <label
                          htmlFor={`costoHora-${profesor.id}`}
                          className="detail-camp"
                        >
                          {profesor.costoHora}
                        </label>
                        <label className="detail-camp"> dolares</label>
                      </div>
                    ))}
                  </div>
                </aside>
                <aside>
                  <div className="form-group col-md-12">
                    <div className="form-group col-md-12">
                      <label className="title-camp">
                        La descripción detallada de las herremienta que
                        aprenderas en el curso son;
                      </label>
                      <textarea
                        rows={20}
                        type="text"
                        className="form-control"
                        name="descripcion"
                        placeholder="Indique los detalles del curso"
                        value={descripcion}
                        readOnly
                      />
                    </div>
                  </div>
                </aside>
              </section>
              <div className="mt-2 flex items-center">
                <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
                  {imageCourse ? (
                    <img
                      src={URL.createObjectURL(imageCourse)}
                      alt="file"
                      className="upLoadImg"
                    />
                  ) : (
                    <img
                      src={`${hostServer}${urlImageCourse}`}
                      alt="file"
                      className="upLoadImg"
                    />
                  )}
                </span>
              </div>
            </form>
          </div>
        )
      }
    </>
  );
}/*
<form onSubmit={handleSubmit}>
            <section className="courseVerSection row">
              <aside className="col-md-6 px-2">
                <div className="mb-4">
                  <h2 className="text-primary">{nombre}</h2>
                  <h4 className="text-secondary">Código: {codigo}</h4>
                </div>
                <div className="mb-3">
                  <h5 className="text-dark">Costo:</h5>
                  <p className="lead text-success">${costo} USD</p>
                </div>
                <div className="mb-3">
                  <h5 className="text-dark">Estado:</h5>
                  <p className="lead text-info">{condicion}</p>
                </div>
                <div className="mb-4">
                  <h5 className="text-dark">Profesores:</h5>
                  {profesores.map((profesor) => (
                    <div key={profesor.id} className="mb-3">
                      <h6 className="text-dark">Profesor {profesor.id}:</h6>
                      <p className="text-muted">{profesor.profesor}</p>
                      <p className="text-muted">Costo por hora: ${profesor.costoHora} USD</p>
                    </div>
                  ))}
                </div>
              </aside>
              <aside className="col-md-6">
                <div className="mb-4">
                  <h5 className="text-dark">Descripción del Curso:</h5>
                  <textarea
                    rows={10}
                    className="form-control"
                    name="descripcion"
                    placeholder="Indique los detalles del curso"
                    value={descripcion}
                    readOnly
                  />
                </div>
                <div className="mb-4 text-center">
                  <h5 className="text-dark">Imagen del Curso:</h5>
                  {imageCourse ? (
                    <img
                      src={URL.createObjectURL(imageCourse)}
                      alt="file"
                      className="img-fluid rounded"
                    />
                  ) : (
                    <img
                      src={`${hostServer}${urlImageCourse}`}
                      alt="file"
                      className="img-fluid rounded"
                    />
                  )}
                </div>
              </aside>
            </section>
          </form>*/
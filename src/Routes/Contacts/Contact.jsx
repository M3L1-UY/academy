import { useState, useEffect, useRef } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useForm } from "../../hooks/useForm";
import Swal from "sweetalert2";
import { useAppContext } from "../../hooks/appContext";
import ValidateErrors from "../../componets/services/ValidateErrors";
import {validationContactSchema} from "../../componets/services/validationSchema";

export default function Contact({ contact, edit, riviewList }) {
  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { HandleNivelClose } = useAppContext();
  const url = `${hostServer}/api/contact`;
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(false);
  const [contacts, setContacts] = useState([]);
  const initialForm = {
    id: contact ? contact._id : "",
    nombre: contact ? contact.nombre : "",
    email: contact ? contact.email : "",
    celular: contact ? contact.celular : "",
    ciudad: contact ? contact.ciudad : "",
    curso: contact ? contact.curso : "",
    comentario: contact ? contact.comentario : "",
    condicion: contact ? contact.condicion : "",
  };

  const { formData, onInputChange, validateForm, errorsInput, clearForm } =
    useForm(initialForm, validationContactSchema);
    
  const { id, nombre, email, celular, comentario, ciudad, curso, condicion } =
    formData;

  let {
    data,
    isLoading = false,
    getData,
    createData,
    updateData,
  } = useFetch(null);

  const handleSubmit = async (e) => {
    console.log(formData)
    e.preventDefault();
    const numError = validateForm();

    setIsSubmitted(true);

    if (!numError) {
      if (!edit) {
        await createData(url, formData);
      } else {
        await updateData(url, contact._id, formData);
      }
    } else {

      console.log()
      Swal.fire({
        position: "top",
        icon: "info",
        title: "Debes corregir la información para poder enviar su mensaje",
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
        // riviewList();
      }
      if (data?.status === 201) {
        clearForm();
        // riviewList();
      }
      setIsSubmitted(false);
    }
  }, [data]);

  const getCourses = async () => {
    const url = `${hostServer}/api/courses`;

    // let url = "http://localhost:5000/api/";
    let response = await fetch(url);
    let responseCurso = await response.json();
    if (responseCurso) {
      if (async () => await responseCurso?.data) {
        setCourses(responseCurso?.data);
      }
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <>
      {error ? (
        errorMessage()
      ) : (
        <>
          <div className="container">
            <form onSubmit={handleSubmit} className="form-initial-div col-md-10 mx-auto">
            <h3 className="form-titulo">Contacto</h3>
            <div className="form-content container p-5">
  
              <div className="row">
                <div className="form-group col-md-6 mt-2">
                  <label htmlFor="nombre">Nombre *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    placeholder="Ingrese su nombre"
                    value={nombre}
                    onChange={onInputChange}
                  />
                  {isSubmitted && errorsInput.nombre && (
                    <ValidateErrors errors={errorsInput.nombre} />
                  )}{" "}
                </div>
                <div className="form-group col-md-6 mt-2">
                  <label htmlFor="email">Correo *</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Ingrese su correo electrónico"
                    value={email}
                    onChange={onInputChange}
                  />
                 {isSubmitted && errorsInput.email && (
                    <ValidateErrors errors={errorsInput.email} />
                  )}
                </div>
              </div>
              <div className="row">
                <div className="form-group col-md-6 mt-2">
                  <label htmlFor="celular">Celular *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="celular"
                    placeholder="Ingrese su número de contacto"
                    value={celular}
                    onChange={onInputChange}
                  />
                 {isSubmitted && errorsInput.celular && (
                    <ValidateErrors errors={errorsInput.celular} />
                  )}{" "}
                </div>
                <div className="form-group col-md-6 mt-2">
                  <label htmlFor="ciudad">Ciudad</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ingrese su ciudad"
                    name="ciudad"
                    value={ciudad}
                    onChange={onInputChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="form-group col-md-6 mx-auto mt-4">
                  <label htmlFor="curso">Cursos Disponibles *</label>
                  <select
                    name="curso"
                    className="form-control"
                    value={curso}
                    onChange={onInputChange}
                  >
                    <option>Seleccione un curso</option>
                    {courses.map((item) => (
                      <option
                        key={item._id}
                        value={item.nombre}
                      >{`${item.nombre}`}</option>
                    ))}
                  </select>
                  {isSubmitted && errorsInput.curso && (
                    <ValidateErrors errors={errorsInput.curso} />
                  )}
                </div>
              </div>

              <div className="row mt-2">
              <div className="form-group col-md-12">
                <label htmlFor="comentario">Comentario *</label>
                <textarea
                  // type="textarea"
                  className="form-control"
                  rows={5}
                  name="comentario"
                  placeholder="Escriba su mensaje"
                  value={comentario}
                  onChange={onInputChange}
                />
                 {isSubmitted && errorsInput.comentario && (
                    <ValidateErrors errors={errorsInput.comentario} />
                  )}
                </div>
              </div>

              <div className="btn-submit mt-4 mb-1">
                {edit ? (
                  <button type="submit" className="form-button "disabled={isSubmitted}>
                    {isSubmitted ? "Actualizando..." : "Actualizar"}
                  </button>
                ) : (
                  <button type="submit" className="form-button" disabled={isSubmitted}>
                    {isSubmitted ? "Enviando..." : "Enviar"}
                  </button>
                )}
              </div>
              </div>   
            </form>
          </div>
        </>
      )}
    </>
  );
}

import { useState, useEffect, useRef } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useForm } from "../../hooks/useForm";
import { useAppContext } from "../../hooks/appContext";
import Swal from "sweetalert2";
import ValidateErrors from "../../componets/services/ValidateErrors";
import validationSchema from "../../componets/services/validationSchema";
import AccessProfil from "../../componets/services/AccessProfil";

export default function Teacher({ teacher, edit, riviewList }) {
  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  const api = `${hostServer}/api/teacher`;
  const { HandleClose } = useAppContext();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const initialForm = {
    id: teacher ? teacher._id : "",
    dni: teacher ? teacher.dni : "",
    nombre: teacher ? teacher.nombre : "",
    apellido: teacher ? teacher.apellido : "",
    email: teacher ? teacher.email : "",
    password: teacher ? teacher.pasword : "",
    confirmPassword: "",
    adress: teacher ? teacher.adress : "",
    fechaNacimiento: teacher ? teacher.fechaNacimiento : new Date("2023/12/31"),
    city: teacher ? teacher.city : "",
    celular: teacher ? teacher.celular : "",
    condicion: teacher ? teacher.condicion : "",
  };

  const { formData, onInputChange, validateForm, errorsInput, clearForm } =
    useForm(initialForm, validationSchema);

  const {
    id,
    dni,
    nombre,
    apellido,
    email,
    password,
    confirmPassword,
    celular,
    fechaNacimiento,
    adress,
    city,
    condicion,
  } = formData;

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
    let response;

    setIsSubmitted(true);

    if (!formData.dni || !formData.nombre || !formData.apellido || !formData.email || !formData.password || !formData.confirmPassword || !formData.condicion) {
      Swal.fire({
        position: "top",
        icon: "info",
        title: "Debes completar todos los campos requeridos (*)",
        showConfirmButton: false,
        timer: 5000,
      });
      return;
    }


    if (!numError) {
      try{
        let url = `${api}`;

        if (!edit) {
          response = await createData(url, formData);
        } else {
          response =  await updateData(url, teacher._id, formData);
        }
      } catch (error) {
        console.error("Error:", error);
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
      if (response.status === 400) {
        Swal.fire({
          position: "top",
          icon: "error",
          title: response.data.message,
          showConfirmButton: false,
          timer: 3500,
        });
      } else {
        Swal.fire({
          position: "top",
          icon: "success",
          title: response.data.message,
          showConfirmButton: false,
          timer: 3500,
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
        HandleClose();
        setIsSubmitted(false);
        riviewList();
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
        HandleClose();
        setIsSubmitted(false);
        riviewList();
      }
      if (data?.status === 201) {
        HandleClose();
        clearForm();
        setIsSubmitted(false);
        riviewList();
      }
    }
  }, [data]);

  return (
    <>
      {
        // isLoading ? (
        // <h3>Cargando...</h3>
        // ) :
          <div className="container pt-3 px-5 pb-3 mb-3  col-md-10 mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="row  mx-auto">
                <div className="form-group col-md-6 mt-2 mb-3 mx-auto">
                  <label htmlFor="dni">Documento de Identidad *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="dni"
                    placeholder="Ingrese su documento"
                    value={dni}
                    onChange={onInputChange}
                    disabled={edit}
                  />
                   {isSubmitted && errorsInput.dni && (
                    <ValidateErrors errors={errorsInput.dni} />
                  )}
                </div>
              </div>
              <div className="row">
                <div className="form-group col-md-6 mt-2">
                  <label htmlFor="nombre">Nombres *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    placeholder="Ingrese sus nombres"
                    value={nombre}
                    onChange={onInputChange}
                  />
                   {isSubmitted && errorsInput.nombre && (
                    <ValidateErrors errors={errorsInput.nombre} />
                  )}{" "}
                </div>
                <div className="form-group col-md-6 mt-2">
                  <label htmlFor="inputName">Apellidos *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="apellido"
                    placeholder="Ingrese sus apellidos"
                    value={apellido}
                    onChange={onInputChange}
                  />
                   {isSubmitted && errorsInput.apellido && (
                    <ValidateErrors errors={errorsInput.apellido} />
                  )}
                </div>
              </div>
              <div className="row">
                <div className="form-group col-md-6 mt-2">
                  <label htmlFor="email">Correo Electrónico *</label>
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
                <div className="form-group col-md-6 mt-2">
                  <label htmlFor="celular">Celular</label>
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
                {/* <div className="form-group col-md-6">
                  <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    className="form-control"
                    name="fechaNacimiento"
                    step="1"
                    value={fechaNacimiento}
                    min="2013-01-01"
                    max="fechaNacimiento"
                    onChange={onInputChange}
                  />
                </div> */}
              </div>
              <div className="row">
                <div className="form-group col-md-6 mt-2">
                  <label htmlFor="password">Contraseña *</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={onInputChange}
                  />
                  {isSubmitted && errorsInput.password && (
                    <ValidateErrors errors={errorsInput.password} />
                  )}
                </div>
                <div className="form-group col-md-6 mt-2">
                  <label htmlFor="confirmPassword">
                    Confirmación de Contraseña *
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    placeholder="Ingrese su contraseña"
                    value={confirmPassword}
                    onChange={onInputChange}
                  />
                  {isSubmitted && errorsInput.confirmPassword && (
                    <ValidateErrors errors={errorsInput.confirmPassword} />
                  )}
                </div>
              </div>
              <div className="form-group mt-2">
                <label htmlFor="adress">Dirección</label>
                <input
                  type="text"
                  className="form-control"
                  name="adress"
                  placeholder="Ingrese su dirección principal"
                  value={adress}
                  onChange={onInputChange}
                />
              </div>

              <div className="row">
                <div className="form-group col-md-6 mt-2">
                  <label htmlFor="city">Ciudad</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ingrese su ciudad"
                    name="city"
                    value={city}
                    onChange={onInputChange}
                  />
                </div>
                <div className="form-group col-md-3 mt-2  mx-auto">
                  <label htmlFor="condicion">Estado *</label>
                  <select
                    name="condicion"
                    className="form-control"
                    value={condicion}
                    onChange={onInputChange}
                  >
                    <option>Elija opción</option>
                  <option>Activo</option>
                  <option>No Activo</option>
                  </select>
                  {isSubmitted && errorsInput.condicion && (
                    <ValidateErrors errors={errorsInput.condicion} />
                  )}
                </div>
              </div>
              <div className="btn-submit mt-5 mb-3">
              {edit ? (
                  <button type="submit" className="form-button "disabled={isSubmitted}>
                    {isSubmitted ? "Actualizando..." : "Actualizar"}
                  </button>
                ) : (
                  <button type="submit" className="form-button" disabled={isSubmitted}>
                    {isSubmitted ? "Espere..." : "Agregar"}
                  </button>
                )}
              </div>
            </form>
          </div>
        
      }
    </>
  );
}

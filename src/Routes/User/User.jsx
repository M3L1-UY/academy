import { useState, useEffect, useRef } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useForm } from "../../hooks/useForm";
import { useAppContext } from "../../hooks/appContext";
import { useUsersContext} from "../../hooks/UsersContext"
import Swal from "sweetalert2";
import ValidateErrors from "../../componets/services/ValidateErrors";
import validationSchema from "../../componets/services/validationSchema";
import AccessProfil from "../../componets/services/AccessProfil";

export default function User({ user, edit, riviewList }) {
  // AccessProfil("isAdmin");
 // const {usersContext} = useUsersContext(); //////////// disabled = {usersContext.role = }
  const { HandleClose } = useAppContext();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  const api = `${hostServer}/api/user`;
  const [error, setError] = useState(false);

  const roles = [
    { id: 1, role: "isStudent", descrip: "Estudiante" },
    { id: 2, role: "isTeacher", descrip: "Profesor" },
    { id: 3, role: "isAdmin", descrip: "Administrador" },
  ];

  const estatus = [
    { id: 1, descrip: "Activo" },
    { id: 2, descrip: "No Activo" },
  ];

  const initialForm = {
    _id: user ? user._id : null,
    dni: user ? user.dni : "",
    nombre: user ? user.nombre : "",
    apellido: user ? user.apellido : "",
    email: user ? user.email : "",
    password: "",
    confirmPassword:  "",
    celular: user ? user.celular : "",
    ciudad: user ? user.ciudad : "",
    address: user ? user.address : "",
    role: user ? user.role : "",
    condicion: user ? user.condicion : "",
   // token: user.usersContext.token
  };

  const { formData, onInputChange, validateForm, errorsInput, clearForm } =
    useForm(initialForm, validationSchema);

  const {
    _id,
    dni,
    nombre,
    apellido,
    email,
    password,
    confirmPassword,
    address,
    celular,
    ciudad,
    condicion,
    role,
   // token
  } = formData;

  let { data, isLoading, getData, createData, updateData } = useFetch(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numError = validateForm();
    let response;
    setIsSubmitted(true);

    if (!formData.dni || !formData.nombre || !formData.apellido || !formData.email || !formData.password || !formData.confirmPassword || !formData.address ||!formData.condicion|| !formData.role) {
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
        response = await updateData(url, user._id, formData);
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
    if (response?.status === 400) {
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
        // <h3>Cargado..</h3>
        // ):
        error ? (
          errorMessage()
        ) : (
          <div className="container p-5">
            <form>
              <div className="row">
                <div className="form-group col-md-6 mx-auto">
                <label htmlFor="dni">Documento de Identidad *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="dni"
                    placeholder="Ingrese su documento"
                    value={dni}
                    disabled={edit}
                    onChange={onInputChange}
                  />
                  {isSubmitted && errorsInput.dni && (
                    <ValidateErrors errors={errorsInput.dni} />
                  )}
                </div>
              </div>
              <div className="row">
                <div className="form-group col-md-6">
                  <label htmlFor="nombre">Nombres</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    placeholder="Ingrese sus nombres"
                    value={nombre}
                    onChange={onInputChange}
                  />
                  {isSubmitted &&errorsInput.nombre && (
                    <ValidateErrors errors={errorsInput.nombre} />
                  )}
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="inputName">Apellidos</label>
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
              <div className="row mt-3">
                <div className="form-group col-md-6">
                  <label htmlFor="email">Correo Electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Ingrese su correo electrónico"
                    value={email}
                    onChange={onInputChange}
                  />
        {isSubmitted &&errorsInput.email && (
                    <ValidateErrors errors={errorsInput.email} />
                  )}
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="role">Rol</label>
                  <select
                    className="form-control"
                    name="role"
                    value={role}
                    onChange={onInputChange}
                  >
                    <option>Seleccione el rol...</option>
                    {roles.map((item) => {
                      return (
                        <option key={item.id} value={item.role}>
                          {item.descrip}
                        </option>
                      );
                    })}
                     
                  
                  </select>
                  {isSubmitted && errorsInput.role && (
                    <ValidateErrors errors={errorsInput.role} />
                  )}
                </div>
              </div>
              <div className="row mt-3">
                <div className="form-group col-md-6">
                  <label htmlFor="password">Contraseña</label>
                  <input
                    type="password"
                    autoComplete="on"
                    className="form-control"
                    name="password"
                    placeholder="Indique su contraseña"
                    value={password}
                    onChange={onInputChange}
                  />
                  {isSubmitted && errorsInput.password && (
                    <ValidateErrors errors={errorsInput.password} />
                  )}
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="confirmPassword">
                    Confirmación de Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    autoComplete="on"
                    name="confirmPassword"
                    placeholder="Repita su contraseña"
                    value={confirmPassword}
                    onChange={onInputChange}
                  />
                 {isSubmitted && errorsInput.confirmPassword && (
                    <ValidateErrors errors={errorsInput.confirmPassword} />
                  )}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="address">Dirección</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  placeholder="Indique su dirección principal"
                  value={address}
                  onChange={onInputChange}
                />
                  {isSubmitted && errorsInput.address && (
                    <ValidateErrors errors={errorsInput.address} />
                  )}
              </div>
              <div className="row mt-3">
                <div className="form-group col-md-4">
                  <label htmlFor="ciudad">Ciudad</label>
                  <input
                    type="text"
                    className="form-control"
                    name="ciudad"
                    value={ciudad}
                    onChange={onInputChange}
                  />
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="condicion">Estado *</label>
                  <select
                    name="condicion"
                    className="form-control"
                    value={condicion}
                    onChange={onInputChange}
                  >
                    <option>Selecione una opción...</option>
                    {estatus.map((item) => {
                      return (
                        <option key={item.id} value={item.descrip}>
                          {item.descrip}
                        </option>
                      );
                    })}
                  </select>
                  {isSubmitted && errorsInput.condicion && (
                    <ValidateErrors errors={errorsInput.condicion} />
                  )}
                </div>
                <div className="form-group col-md-4">
                  <label htmlFor="celular">Celular</label>
                  <input
                    type="text"
                    className="form-control"
                    name="celular"
                    value={celular}
                    placeholder="Ingrese su número de contacto"
                    onChange={onInputChange}
                  />
                  {isSubmitted && errorsInput.celular && (
                    <ValidateErrors errors={errorsInput.celular} />
                  )}
                </div>
              </div>
              <div className="btn-submit mt-4">
                {edit ? (
                  <button
                    onClick={handleSubmit}
                    className="form-button"
                  >
                    Actualizar
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    type="submit"
                    className="form-button"
                  >
                    Agregar
                  </button>
                )}
              </div>
            </form>
          </div>
        )
      }
    </>
  );
}

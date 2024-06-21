import { useState, useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useForm } from "../../hooks/useForm";
import Swal from "sweetalert2";
import { useAppContext } from "../../hooks/appContext";
import ValidateErrors from "../../componets/services/ValidateErrors";
import validationSchema from "../../componets/services/validationSchema";

export default function Student({ title }) {
  const { HandleNivelClose } = useAppContext();
  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  
  const api = `${hostServer}/api/student`;
  const initialForm = {
    dni: "",
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    adress: "",
    fechaNacimiento: new Date("2023/12/31"),
    city: "",
    celular: "",
    condicion: "",
  };

  const [isSubmitted,setIsSubmitted ] = useState(false);
  const { formData, onInputChange, validateForm, errorsInput, clearForm, fillForm } = useForm(initialForm, validationSchema);

  const { data, createData } = useFetch(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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

    const numError = validateForm();
    if (!numError) {
      let response;
      try {
        response = await createData(api, formData);
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

          clearForm();
          setIsSubmitted(false);
        }
      } catch (error) {
        Swal.fire({
          position: "top",
          icon: "error",
          title: "Hubo un error al intentar registrar el estudiante",
          showConfirmButton: false,
          timer: 5000,
        });
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
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: data.message,
        showConfirmButton: false,
        timer: 3500,
      });
      if (data?.status === 201) {
        clearForm();
        setIsSubmitted(false);
        HandleNivelClose();
      }
    }
  }, [data]);

  return (
    <div className="container">
      <div className="form-initial-div col-md-10 mx-auto">
        <h2 className="form-titulo">{title}</h2>
        <div className="container p-5">
          <form onSubmit={handleSubmit}>
            <div className="row mx-auto">
              <div className="form-group col-md-6 mx-auto  mb-3">
                <label htmlFor="dni">Documento de identidad *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ingrese su documento"
                  name="dni"
                  value={formData.dni}
                  onChange={onInputChange}
                />
                {isSubmitted && errorsInput.dni && <ValidateErrors errors={errorsInput.dni} />}
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
                  value={formData.nombre}
                  onChange={onInputChange}
                />
                {isSubmitted && errorsInput.nombre && <ValidateErrors errors={errorsInput.nombre} />}
              </div>
              <div className="form-group col-md-6 mt-2">
                <label htmlFor="inputName">Apellidos *</label>
                <input
                  type="text"
                  className="form-control"
                  name="apellido"
                  placeholder="Ingrese sus apellidos"
                  value={formData.apellido}
                  onChange={onInputChange}
                />
                {isSubmitted && errorsInput.apellido && <ValidateErrors errors={errorsInput.apellido} />}
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
                  value={formData.email}
                  onChange={onInputChange}
                />
                {isSubmitted && errorsInput.email && <ValidateErrors errors={errorsInput.email} />}
              </div>
              <div className="form-group col-md-6 mt-2">
                <label htmlFor="celular">Celular</label>
                <input
                  type="text"
                  className="form-control"
                  name="celular"
                  placeholder="Ingrese su número de contacto"
                  value={formData.celular}
                  onChange={onInputChange}
                />
                {isSubmitted && errorsInput.celular && <ValidateErrors errors={errorsInput.celular} />}
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-6 mt-2">
                <label htmlFor="password">Contraseña *</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Ingrese su contraseña"
                  value={formData.password}
                  onChange={onInputChange}
                />
                {isSubmitted && errorsInput.password && <ValidateErrors errors={errorsInput.password} />}
              </div>
              <div className="form-group col-md-6 mt-2">
                <label htmlFor="confirmPassword">Confirmación de Contraseña *</label>
                <input
                  type="password"
                  className="form-control"
                  name="confirmPassword"
                  placeholder="Ingrese su contraseña"
                  value={formData.confirmPassword}
                  onChange={onInputChange}
                />
                {isSubmitted && errorsInput.confirmPassword && <ValidateErrors errors={errorsInput.confirmPassword} />}
              </div>
            </div>
            <div className="form-group mt-2">
              <label htmlFor="adress">Dirección</label>
              <input
                type="text"
                className="form-control"
                name="adress"
                placeholder="Ingrese su dirección principal"
                value={formData.adress}
                onChange={onInputChange}
              />
              {isSubmitted && errorsInput.adress && <ValidateErrors errors={errorsInput.adress} />}
            </div>
            <div className="row">
              <div className="form-group col-md-6 mt-2">
                <label htmlFor="city">Ciudad</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ingrese su ciudad"
                  name="city"
                  value={formData.city}
                  onChange={onInputChange}
                />
                {isSubmitted && errorsInput.city && <ValidateErrors errors={errorsInput.city} />}
              </div>
              <div className="form-group col-md-3 mt-2 mx-auto">
                <label htmlFor="condicion">Estado *</label>
                <select
                  name="condicion"
                  className="form-control"
                  value={formData.condicion}
                  onChange={onInputChange}
                >
                  <option>Elija opción</option>
                  <option>Activo</option>
                  <option>No Activo</option>
                </select>
                {isSubmitted && errorsInput.condicion && <ValidateErrors errors={errorsInput.condicion} />}
              </div>
            </div>
            <div className="btn-submit mt-4">
              <button type="submit" className="form-button">
                Registrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

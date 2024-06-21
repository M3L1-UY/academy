import { useState, useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useForm } from "../../hooks/useForm";
import Swal from "sweetalert2";
import { useAppContext } from "../../hooks/appContext";
import ValidateErrors from "../../componets/services/ValidateErrors";
import validationSchema from "../../componets/services/validationSchema";
import { useNavigate } from "react-router-dom";

export default function Perfil({ title }) {
  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  const api = `${hostServer}/api/student`;
  const [error, setError] = useState(false);
  const [edit, setEdit] = useState(false); 
  const [student, setStudent] = useState({});
  const navigate = useNavigate();
  
  let initialForm = {
    _id: student ? student._id : null,
    dni: student ? student.dni : "",
    nombre: student ? student.nombre : "",
    apellido: student ? student.apellido : "",
    email: student ? student.email : "",
    adress: student ? student.adress : "",
    fechaNacimiento: student ? student.fechaNacimiento : new Date("2023/12/31"),
    city: student ? student.city : "",
    celular: student ? student.celular : "",
    condicion: student ? student.condicion : "",
  };

  const { formData, onInputChange, validateForm, errorsInput, clearForm, fillForm } = useForm(initialForm, validationSchema);

  let { _id, dni, nombre, apellido, email, celular, fechaNacimiento, adress, city, condicion } = formData;

  let { data, isLoading = false, getData, createData, updateData } = useFetch(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const numError = validateForm();
    if (numError === 0) {
      if (!dni || dni.trim() === "") { 
        Swal.fire({
          position: "top",
          icon: "error",
          title: "Debe ingresar el documento de identidad",
          showConfirmButton: false,
          timer: 5000,
        });
      } else {
        let url = `${api}`;
        let response;
        if (edit) {
          if (_id) {
            response = await updateData(url, _id, formData);
            if (response) {
              Swal.fire({
                position: "top",
                icon: "success",
                title: response.data.message,
                showConfirmButton: false,
                timer: 3500,
              });
              navigate("/");
            }
          } else {
            Swal.fire({
              position: "top",
              icon: "error",
              title: "ID de estudiante no encontrado",
              showConfirmButton: false,
              timer: 5000,
            });
            return; 
          } 
        }
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
  
  const getStudent = async (event) => {
    let url = `${hostServer}/api/studentdni/${event.target.value}`;
    const responseData = await getData(url);
    if (responseData && responseData.data.data) {
      setStudent(responseData.data.data);
      setEdit(true); 
      fillForm(responseData.data.data);
    } else {
      setEdit(false);
      Swal.fire({
        position: "top",
        icon: "warning",
        title: "Estudiante no encontrado",
        showConfirmButton: false,
        timer: 3500,
      });
    }
  };

  useEffect(() => {
    if (data?.message) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: data?.message,
        showConfirmButton: false,
        timer: 3500,
      });
    } else if (data?.status === 200 || data?.status === 201) {
      setStudent(data?.data.data);
      setEdit(true);
    } else {
      if (data?.data.message) {
        Swal.fire({
          position: "top",
          icon: "warning",
          title: data?.data?.message,
          showConfirmButton: false,
          timer: 3500,
        });
      }
      if (data?.status === 201) {
        clearForm();
      }
    }
  }, [data]);

  useEffect(() => {
    fillForm(student);
  }, [student]);

  return (
    <>
      {
        error ? (
          errorMessage()
        ) : (
          <>
            <div className="container">
              <div className="form-initial-div col-md-10 mx-auto">
                <h2 className="form-titulo">{title}</h2>
                <div className="container p-5">
                  <form onSubmit={handleSubmit}>
                    <div className="row mx-auto">
                      <div className="form-group col-md-6 mb-3 mx-auto">
                        <label htmlFor="dni">Documento de identidad</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Ingrese su documento"
                          name="dni"
                          value={dni}
                          onBlur={getStudent}
                          disabled={edit && dni} 
                        />
                        {errorsInput.dni && (
                          <ValidateErrors errors={errorsInput.dni} />
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group col-md-6 mt-2">
                        <label htmlFor="nombre">Nombres </label>
                        <input
                          type="text"
                          className="form-control"
                          name="nombre"
                          placeholder="Ingrese sus nombres"
                          value={nombre}
                          onChange={onInputChange}
                        />
                        {errorsInput.nombre && (
                          <ValidateErrors errors={errorsInput.nombre} />
                        )}
                      </div>
                      <div className="form-group col-md-6 mt-2">
                        <label htmlFor="inputName">Apellidos </label>
                        <input
                          type="text"
                          className="form-control"
                          name="apellido"
                          placeholder="Ingrese sus apellidos"
                          value={apellido}
                          onChange={onInputChange}
                        />
                        {errorsInput.apellido && (
                          <ValidateErrors errors={errorsInput.apellido} />
                        )}
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group col-md-6 mt-2">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          placeholder="Ingrese su correo electrónico"
                          value={email}
                          onChange={onInputChange}
                        />
                        {errorsInput.email && (
                          <ValidateErrors errors={errorsInput.email} />
                        )}
                      </div>
                      <div className="form-group col-md-6 mt-2">
                        <label htmlFor="celular">Celular </label>
                        <input
                          type="text"
                          className="form-control"
                          name="celular"
                          placeholder="Ingrese su número de contacto"
                          value={celular}
                          onChange={onInputChange}
                        />
                        {errorsInput.celular && (
                          <ValidateErrors errors={errorsInput.celular} />
                        )}
                      </div>
                    </div>
                    <div className="form-group mt-2">
                      <label htmlFor="adress">Dirección</label>
                      <input
                        type="text"
                        className="form-control"
                        name="adress"
                        placeholder="Indique su dirección principal"
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
                      <div className="form-group col-md-3 mx-auto mt-2">
                        <label htmlFor="condicion">Estatus</label>
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
                      </div>
                    </div>
                    <div className="btn-submit mt-4">
                      <button type="submit" className="form-button">
                        Actualizar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )
      }
    </>
  );
}

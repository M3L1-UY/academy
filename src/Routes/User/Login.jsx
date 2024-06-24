import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Swal from "sweetalert2";
import validationSchema from "../../componets/services/validationSchema";
import ValidateErrors from "../../componets/services/ValidateErrors";
import { useUsersContext } from "../../hooks/UsersContext";
import { useFetch } from "../../hooks/useFetch";
import { useForm } from "../../hooks/useForm";
import Cookies from "js-cookie"; 

const Login = () => {
  
  const navigate = useNavigate();
  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  const api = `${hostServer}/api/user/login`;
  const { setUsersContext } = useUsersContext();
  const [visible, setVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialForm = {
    email: "",
    password: "",
  };

  const { formData, onInputChange, validateForm, errorsInput } = useForm(initialForm, validationSchema);
  const { email, password } = formData;
  const { data, error, createData } = useFetch(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const numError = validateForm();

    if (!numError) {
      setIsSubmitting(true);
      await createData(api, formData);
      setIsSubmitting(false);
    } else {
      Swal.fire({
        position: "top",
        icon: "info",
        title: "Verifica las credenciales de acceso",
        showConfirmButton: false,
        timer: 5000,
      });
    }
  };

  useEffect(() => {
    if (data?.status === 200) {
      setUsersContext(data.data.data);
      Cookies.set("user", JSON.stringify(data.data.data), { expires: 7 }); 
      navigate("/");
    } else if (data?.status === 400) {
      Swal.fire({
        position: "top",
        icon: "error",
        title: data?.message || "Error al iniciar sesión",
        showConfirmButton: false,
        timer: 3500,
      });
    }
  }, [data, setUsersContext, navigate]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        position: "top",
        icon: "error",
        title: error.message || "Error al realizar la solicitud",
        showConfirmButton: false,
        timer: 3500,
      });
    }
  }, [error]);

  return (
    <div className="container mt-4 w-full h-full">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <p className="form-titulo justify-content-center">Iniciar sesión</p>
          <div className="container p-5 card shadow w-100">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="">
                  <label htmlFor="email" className="text-center">Correo electrónico</label>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={onInputChange}
                    className="form-control"
                  />
                  {errorsInput.email && <ValidateErrors errors={errorsInput.email} />}
                </div>
                <div className="mb-3 mt-3">
                  <label htmlFor="password">Contraseña</label>
                  <div className="input-group">
                    <input
                      type={visible ? "text" : "password"}
                      name="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={onInputChange}
                      className="form-control"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setVisible(!visible)}
                    >
                      {visible ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
                    </button>
                  </div>
                </div>

                <div className="text-center mt-5 mb-0">
                  <button type="submit" className="form-button" disabled={isSubmitting}>
                    {isSubmitting ? "Enviando..." : "Enviar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

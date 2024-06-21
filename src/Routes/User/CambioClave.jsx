import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useUsersContext } from "../../hooks/UsersContext";
import { useNavigate } from "react-router-dom";

function CambioClave() {
  const { usersContext } = useUsersContext();
  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  const url = `${hostServer}/api/user/cambio`;
  const [email, setEmail] = useState(usersContext.email);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState(usersContext.token);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "La contraseña debe tener al menos 6 caracteres";
    }
    if (!hasUpperCase) {
      return "La contraseña debe tener al menos una letra mayúscula";
    }
    if (!hasLowerCase) {
      return "La contraseña debe tener al menos una letra minúscula";
    }
    if (!hasDigit) {
      return "La contraseña debe tener al menos un dígito";
    }
    if (!hasSymbol) {
      return "La contraseña debe tener al menos un símbolo";
    }
    return undefined;
  };

  const passwordChangeHandler = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      Swal.fire({
        position: "top",
        icon: "info",
        title: "Debes completar todos los campos",
        showConfirmButton: false,
        timer: 5000,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        position: "top",
        icon: "info",
        title: "Las contraseñas no coinciden",
        showConfirmButton: false,
        timer: 5000,
      });
      return;
    }

    if (email !== usersContext.email) {
      Swal.fire({
        position: "top",
        icon: "info",
        title: "Solo puedes modificar tu propia contraseña",
        showConfirmButton: false,
        timer: 5000,
      });
      return;
    }

    const passwordValidationMessage = validatePassword(newPassword);
    if (passwordValidationMessage) {
      Swal.fire({
        position: "top",
        icon: "info",
        title: passwordValidationMessage,
        showConfirmButton: false,
        timer: 5000,
      });
      return;
    }

    try {
      const options = {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          email,
          oldPassword,
          newPassword,
          confirmPassword,
        }),
      };
      const response = await fetch(url, options);
      const data = await response.json();
      if (parseInt(data?.status) === 200) {
        Swal.fire({
          position: "top",
          icon: "success",
          title: data?.message,
          showConfirmButton: false,
          timer: 3500,
        });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        navigate("/");
      } else {
        Swal.fire({
          position: "top",
          icon: "error",
          title: data?.message,
          showConfirmButton: false,
          timer: 3500,
        });
      }
    } catch (error) {
      Swal.fire({
        position: "top",
        icon: "error",
        title: "Error al cambiar la contraseña",
        showConfirmButton: false,
        timer: 3500,
      });
    }
  };

  return (
    <div className="container mt-4 w-full h-full ">
      <div className="row justify-content-center ">
        <div className="col-lg-6">
          <p className="form-titulo justify-content-center">
            Cambio de Contraseña
          </p>
          <div className="container px-5 py-4 card shadow w-100">
            <div className="card-body">
              <form
                aria-required
                onSubmit={passwordChangeHandler}
                className="flex flex-col items-center"
              >
                <div className="mb-2">
                  <label htmlFor="email">Correo electrónico</label>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    readOnly
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor="oldPassword">Contraseña Actual</label>
                  <div className="input-group">
                    <input
                      type={visible ? "text" : "password"}
                      name="oldPassword"
                      autoComplete="current-password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="form-control"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setVisible(!visible)}
                    >
                      {visible ? (
                        <AiOutlineEye size={20} />
                      ) : (
                        <AiOutlineEyeInvisible size={20} />
                      )}
                    </button>
                  </div>
                </div>
                <div className="mb-2">
                  <label htmlFor="newPassword">Nueva Contraseña</label>
                  <div className="input-group">
                    <input
                      type={visible ? "text" : "password"}
                      className="form-control"
                      name="newPassword"
                      required
                      autoComplete="on"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setVisible(!visible)}
                    >
                      {visible ? (
                        <AiOutlineEye size={20} />
                      ) : (
                        <AiOutlineEyeInvisible size={20} />
                      )}
                    </button>
                  </div>
                </div>
                <div className="mb-2">
                  <label htmlFor="confirmPassword">Repita nueva contraseña</label>
                  <div className="input-group">
                    <input
                      type={visible ? "text" : "password"}
                      className="form-control"
                      required
                      autoComplete="on"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setVisible(!visible)}
                    >
                      {visible ? (
                        <AiOutlineEye size={20} />
                      ) : (
                        <AiOutlineEyeInvisible size={20} />
                      )}
                    </button>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <input
                    className="form-button"
                    required
                    value="Guardar"
                    type="submit"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CambioClave;

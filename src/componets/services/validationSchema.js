const validationSchema = {
  dni: [
    (value) => (value.trim() === "" ? "El número de documento es requerido" : undefined),
    (value) => (value.trim() !== "" && value.length < 8 ? "El documento debe tener al menos 8 caracteres" : undefined),
    (value) => (value.trim() !== "" && value.match("^[0-9]+$") === null ? "Solo se admiten números" : undefined),
  ],
  nombre: [
    (value) => (value.trim() === "" ? "El nombre es requerido" : undefined),
    (value) => (value.trim() !== "" && value.length < 3 ? "El nombre debe tener al menos 3 caracteres" : undefined),
  ],
  apellido: [
    (value) => (value.trim() === "" ? "El apellido es requerido" : undefined),
    (value) => (value.trim() !== "" && value.length < 3 ? "El apellido debe tener al menos 3 caracteres" : undefined),
  ],
  address: [
    (value) => (value.trim() === "" ? "La dirección es requerida" : undefined),
    (value) => (value.trim() !== "" && value.length < 3 ? "La dirección debe tener al menos 3 caracteres" : undefined),
  ],
  email: [
    (value) => (value.trim() === "" ? "El email es requerido" : undefined),
    (value) => (value.trim() !== "" && !/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) ? "El email no es válido" : undefined),
  ],
  confirmPassword: [
    (value) => (value === "" ? "La contraseña es requerida" : undefined),
  ],
  password: [
    (value) => (value === "" ? "La contraseña es requerida" : undefined),
    (value) => {
      const minLength = 6;
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasDigit = /\d/.test(value);
      const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      
      if (value.trim() !== "" && value.length < minLength) {
        return "La contraseña debe tener al menos 6 caracteres";
      }
      if (value.trim() !== "" && !hasUpperCase) {
        return "La contraseña debe tener al menos una letra mayúscula";
      }
      if (value.trim() !== "" && !hasLowerCase) {
        return "La contraseña debe tener al menos una letra minúscula";
      }
      if (value.trim() !== "" && !hasDigit) {
        return "La contraseña debe tener al menos un dígito";
      }
      if (value.trim() !== "" && !hasSymbol) {
        return "La contraseña debe tener al menos un símbolo";
      }

      return undefined;
    }
  ],
  descripcion: [
    (value) => (value.trim() === "" ? "La descripción ampliada del curso es requerida" : undefined),
  ],
  condicion: [
    (value) => (value.trim() === "" ? "El estado es requerido" : undefined),
  ],
  celular: [
    (value) => (value.trim().length < 9 && value.trim() !== "" ? "El número debe tener al menos 9 caracteres" : undefined),
  ],
  codigo: [
    (value) => (value.trim() === "" ? "El código es requerido" : undefined),
  ],
  costo: [
    (value) => (value?.toString().trim() === "" ? "El costo es requerido" : undefined),
    (value) => (value?.toString().trim() !== "" && value.toString().match("^[0-9]+$") === null ? "Solo se admiten números" : undefined),
    (value) => (value?.toString().trim() !== "" && Number(value) <= 0 ? "El costo debe ser un número positivo" : undefined),
  ],
  role: [
    (value) => {
      if (value.trim() === "") {
        return "El rol es requerido";
      }
      const validRoles = ["isStudent", "isTeacher", "isAdmin"];
      if (!validRoles.includes(value)) {
        return "Rol no válido";
      }
      return undefined;
    }
  ],
  duracion: [
    (value) => (value.trim() === "" ? "La duración es requerida" : undefined),
    (value) => (value.trim() !== "" && value.match("^[0-9]+$") === null ? "Solo se admiten números" : undefined),
    (value) => (value.trim() !== "" && Number(value) <= 0 ? "La duración debe ser un número positivo" : undefined),
    (value) => (value.trim() !== "" && Number(value) > 36 ? "La duración no debe superar los 36 meses" : undefined),
  ],
  clasificacion: [
    (value) => (value?.toString().trim() !== "" && value?.toString().match("^[0-9]+$") === null && value?.trim() !== "" ? "Solo se admiten números" : undefined),
    (value) => (value?.toString().trim() !== "" && (Number(value) < 0 || Number(value) > 5) && value.trim() !== "" ? "La clasificación debe estar entre 0 y 5" : undefined),
  ],
};

export const validationContactSchema = {
  nombre: [
    (value) => (value.trim() === "" ? "El nombre es requerido" : undefined),
    (value) => (value.trim() !== "" && value.length < 3 ? "El nombre debe tener al menos 3 caracteres" : undefined),
  ],
  email: [
    (value) => (value.trim() === "" ? "El email es requerido" : undefined),
    (value) => (value.trim() !== "" && !/^\S+@\S+\.\S+$/.test(value) ? "El email no es válido" : undefined),
  ],
  celular: [
    (value) => (value.trim() === "" ? "El celular es requerido" : undefined),
    (value) => (value.trim().length < 9 && value.trim() !== "" ? "El número debe tener al menos 9 caracteres" : undefined),
  ],
  curso: [
    (value) => (value.trim() === "" ? "El curso es requerido" : undefined),
  ],
  comentario: [
    (value) => (value.trim() === "" ? "El comentario es requerido" : undefined),
  ],
};

export const validationMatriculaSchema = {
  cursoId: [
    (value) => (value.trim() === "" ? "El curso es requerido" : undefined),
  ],
  teacherId: [
    (value) => (value.trim() === "" ? "El profesor es requerido" : undefined),
  ],
  studentId: [
    (value) => (value.trim() === "" ? "El estudiante es requerido" : undefined),
  ],
  turno: [
    (value) => (value.trim() === "" ? "El turno es requerido" : undefined),
  ],
  finicio: [
      (value) => (value.trim() === "" ? "La fecha de inicio es requerida": undefined),
      (value) =>(value.trim() !== "" && !isValidDate(value) ? "La fecha de inicio no es válida": undefined),
  ],
  ffin: [
    (value) => (value.trim() === "" ? "La fecha de finalización es requerida": undefined),
    (value) => (value.trim() !== "" && !isValidDate(value) ? "La fecha de finalización no es válida" : undefined),
  ],
};

export default validationSchema;

function isValidDate(date) {
  const timestamp = Date.parse(date);
  return !isNaN(timestamp);
}

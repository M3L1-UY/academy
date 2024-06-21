import { useState } from "react";

export const useForm = (initialForm, validationSchema) => {
  const [formData, setFormData] = useState(initialForm);
  const [errorsInput, setErrorsInput] = useState({});

  const onInputChange = (event) => {
    const { name, value, files } = event.target;
    const newValue = files ? files[0] : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });

    // Clear errors for the field when it changes
    setErrorsInput({
      ...errorsInput,
      [name]: [],
    });

    // Validate the specific field
    validateField(name, newValue);
  };

  const validateForm = () => {
    const newErrors = {};

    for (const key in validationSchema) {
      const validationFns = validationSchema[key];
      if (formData[key] !== undefined) {
        const value = formData[key];
        const fieldErrors = validationFns
          .map((fn) => fn(value))
          .filter((error) => error !== undefined);
        if (fieldErrors.length > 0) {
          newErrors[key] = fieldErrors;
        }
      }
    }

    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = newErrors.confirmPassword || [];
      newErrors.confirmPassword.push("Las contraseñas no coinciden");
    }

    setErrorsInput(newErrors);
    return Object.keys(newErrors).length;
  };

  const validateField = (name, value) => {
    if (validationSchema[name]) {
      const fieldErrors = validationSchema[name]
        .map((fn) => fn(value))
        .filter((error) => error !== undefined);

      setErrorsInput((prevErrors) => ({
        ...prevErrors,
        [name]: fieldErrors,
      }));
    }
  };

  const clearForm = () => {
    setFormData(initialForm);
    setErrorsInput({});
  };

  const fillForm = (data) => {
    setFormData(data);
  };


  const convertDateFormat = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
}
  return {
    formData,
    onInputChange,
    setFormData,
    validateForm,
    errorsInput,
    clearForm,
    fillForm,
    convertDateFormat,
  };
};

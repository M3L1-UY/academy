import { useState, useEffect, useRef } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useForm } from "../../hooks/useForm";
import { useAppContext } from "../../hooks/appContext";
import Swal from "sweetalert2";
import ValidateErrors from "../../componets/services/ValidateErrors";
import validationSchema from "../../componets/services/validationSchema";
import { useCoursesImageUpload } from "../../firebase/coursesImageUpload";

export default function Curso({ curso, edit, riviewList }) {
  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  const api = `${hostServer}/api/course`;

    const { uploadFile } = useCoursesImageUpload();

    const [teachers, setTeachers] = useState([]);
    const [error, setError] = useState(false);
    const { HandleClose } = useAppContext();
    const initialForm = {
    id: curso ? curso._id : "",
    codigo: curso ? curso.codigo : "",
    nombre: curso ? curso.nombre : "",
    descripcion: curso ? curso.descripcion : "",
    costo: curso ? curso.costo : "",
    condicion: curso ? curso.condicion : "",
    duracion: curso ? curso.duracion : "",
    clasificacion: curso ? curso.clasificacion : "",
    urlImagen: curso ? curso.urlImagen : "",
  };

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [imageCourse, setImageCourse] = useState(curso ? null : curso.urlImagen);
  const [urlImageCourse, setUrlImageCourse] = useState(curso ? curso.urlImagen : null);

  
  const [profesores, setProfesores] = useState([
    {
      id: 1,
      profesor: curso.profesores ? curso?.profesores[0]?.profesor : "",
      costoHora: curso.profesores ? curso?.profesores[0]?.costoHora : "",
      dni: curso.profesores ? curso?.profesores[0]?.dni : "",
    },
    {
      id: 2,
      profesor: curso.profesores ? curso?.profesores[1]?.profesor : "",
      costoHora: curso.profesores ? curso?.profesores[1]?.costoHora : "",
      dni: curso.profesores ? curso?.profesores[1]?.dni : "",
    },
    {
      id: 3,
      profesor: curso.profesores ? curso?.profesores[2]?.profesor : "",
      costoHora: curso.profesores ? curso?.profesores[2]?.costoHora : "",
      dni: curso.profesores ? curso?.profesores[2]?.dni : "",
    },
    {
      id: 4,
      profesor: curso.profesores ? curso?.profesores[3]?.profesor : "",
      costoHora: curso.profesores ? curso?.profesores[3]?.costoHora : "",
      dni: curso.profesores ? curso?.profesores[3]?.dni : "",
    },
  ]);

  const [imageLoaded, setImageLoaded] = useState(true);

  const handdleImg = (e) => {
    setImageCourse(e.target.files[0]);
  };

  useEffect(() => {
    if (edit && curso) {
      setImageLoaded(true)    
    }
  }, [edit, curso]);
  
  let { formData, onInputChange, validateForm, errorsInput, clearForm, setFormData } = useForm(initialForm, validationSchema);

  const {
    _id,
    codigo,
    nombre,
    descripcion,
    costo,
    condicion,
    duracion,
    clasificacion,
    urlImagen,
  } = formData;

  let {
    data,
    isLoading = false,
    getData,
    createData,
    updateData,
  } = useFetch(null);

  const handleImageError = () => {
    setImageLoaded(false);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const numError = validateForm();

    setIsSubmitted(true);

    if (!formData.codigo || !formData.nombre || !formData.descripcion || !formData.costo || !formData.condicion || !formData.duracion) {
      Swal.fire({
        position: "top",
        icon: "info",
        title: "Debes completar todos los campos requeridos (*)",
        showConfirmButton: false,
        timer: 5000,
      });
      return;
    }

    const profesoresIncompletos = profesores.some(
      (profesor) => (profesor.profesor && !profesor.costoHora) || (!profesor.profesor && profesor.costoHora)
    );
  
    if (profesoresIncompletos) {
      Swal.fire({
        position: "top",
        icon: "warning",
        title: "Si asigna un profesor, debe indicar su costo por hora, y viceversa.",
        showConfirmButton: false,
        timer: 5000,
      });
      return;
    }

    
    handleInputChange();
    if (!numError) {
      let urlServer = `${api}`;
      let response;
      console.log(curso);
      try {
        if (imageCourse) {
         
          const downloadURL =  await uploadFile(imageCourse, formData.codigo);
          formData.urlImagen = downloadURL         
          setUrlImageCourse(downloadURL); // Actualiza la URL de la imagen
        }

        formData.profesores = profesores;

        console.log(formData)
        if (!edit) {
          response = await createData(urlServer, formData);
        } else {
          response = await updateData(urlServer, curso._id, formData);
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

          clearForm();
          setIsSubmitted(false);
        }

      }
      catch(error)
      {
        Swal.fire({
          position: "top",
          icon: "error",
          title: "Hubo un error al intentar registrar el curso",
          showConfirmButton: false,
          timer: 5000,
        });

      /*  if (imageCourse) {
          await deleteFile(formData.codigo);
        }*/
      }
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
        riviewList();
      }
      if (data?.status === 201) {
        clearForm();
        HandleClose();
        setIsSubmitted(false);
        setProfesores([
          { id: 1, profesor: "", costoHora: "", dni: "" },
          { id: 2, profesor: "", costoHora: "", dni: "" },
          { id: 3, profesor: "", costoHora: "", dni: "" },
          { id: 4, profesor: "", costoHora: "", dni: "" },
        ]);
        riviewList();
      }
    }
  }, [data]);

  // useEffect(() => {
  //   setUrlImageCourse(urlImage.CourseImg);
  // }, [urlImage]);

  const getTeachers = async () => {
    const urlServer = `${hostServer}/api/teachers`;
    const response = await fetch(urlServer);
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
      const profesorVacio =
        prevProfesores[id - 1] && !prevProfesores[id - 1].profesor;
      if (
        (nombreExistente?.profesor && nombreExistente) ||
        costoHoraAnteriorVacio
      ) {
        if (costoHoraAnteriorVacio) {
          Swal.fire({
            position: "top",
            icon: "warning",
            title: "Debe indicar los datos del profesor anterior.",
            showConfirmButton: false,
            timer: 4000,
          });
        }
        if (prevProfesores && profesorVacio) {
          if (prevProfesores[id - 1].profesor) {
            Swal.fire({
              position: "top",
              icon: "warning",
              title: "Debe indicar el profesor de la casilla anterior",
              showConfirmButton: false,
              timer: 4000,
            });
          }
        }
        if (nombreExistente?.profesor && nombreExistente) {
          Swal.fire({
            position: "top",
            icon: "warning",
            title: "El profesor seleccionado ya fue incluido",
            showConfirmButton: false,
            timer: 4000,
          });
        }
        return prevProfesores;
      }
      const updatedProfesores = prevProfesores.map((profesor) =>
        profesor.id === id ? { ...profesor, [field]: value } : profesor
      );
      if (field === "profesor") {
        const selectedTeacher = teachers.find(
          (teacher) => `${teacher.nombre} ${teacher.apellido}` === value
        );
        if (selectedTeacher) {
          updatedProfesores[id - 1].dni = selectedTeacher.dni;
        }
      }
      return updatedProfesores;
    });
  };


  return (
    <>
      {
        error ? (
          errorMessage()
        ) : (
          <div className="container pt-5 px-5 pb-3 ">

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <section className="courseSection">
                <aside className="px-2">
                  <div className="row">
                    <div className="form-group col-md-12">
                      <label htmlFor="codigo">Código *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Ingrese el código"
                        name="codigo"
                        value={codigo}
                        onChange={onInputChange}
                        disabled={edit}
                      />
                      {isSubmitted && errorsInput.codigo && (
                        <ValidateErrors errors={errorsInput.codigo} />
                      )}
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="form-group col-md-12">
                      <label htmlFor="nombre">Nombre *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="nombre"
                        placeholder="Ingrese el nombre"
                        value={nombre}
                        onChange={onInputChange}
                      />
                      {isSubmitted && errorsInput.nombre && (
                        <ValidateErrors errors={errorsInput.nombre} />
                      )}{" "}
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="form-group col-md-12">
                      <label htmlFor="costo">Costo *</label>
                      <input
                        type="costo"
                        className="form-control"
                        name="costo"
                        placeholder="Ingrese el costo"
                        value={costo}
                        onChange={onInputChange}
                      />
                      {isSubmitted && errorsInput.costo && (
                        <ValidateErrors errors={errorsInput.costo} />
                      )}
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="form-group col-md-12">
                      <label htmlFor="condicion">Estado *</label>
                      <select
                        name="condicion"
                        className="form-control"
                        value={condicion}
                        onChange={onInputChange}
                      >
                        <option>Seleccione opción</option>
                        <option>Activo</option>
                        <option>No Activo</option>
                      </select>
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="form-group col-md-12">
                      <label htmlFor="duracion">Duración *</label>
                      <input
                        type="duracion"
                        className="form-control"
                        name="duracion"
                        placeholder="Ingrese duración en meses"
                        value={duracion}
                        onChange={onInputChange}
                      />
                      {isSubmitted && errorsInput.duracion && (
                        <ValidateErrors errors={errorsInput.duracion} />
                      )}
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="form-group col-md-12">
                      <label htmlFor="clasificacion">
                        Clasificación
                      </label>
                      <input
                        type="clasificacion"
                        className="form-control"
                        name="clasificacion"
                        placeholder="Ingrese clasificación del 0 al 5"
                        value={clasificacion}
                        onChange={onInputChange}
                      />
                      {isSubmitted && errorsInput.clasificacion && (
                        <ValidateErrors errors={errorsInput.clasificacion} />
                      )}
                    </div>
                  </div>
                  <div className="row mt-2">
                    <label
                      htmlFor="teacher"
                      className="teacherGrup mt-2 from-grup"
                    >
                      Asignación de Profesores{" "}
                    </label>
                    {profesores.map((profesor) => (
                      <div key={profesor.id} className="form-group col-md-6">
                        <label htmlFor={`nombre-${profesor.id}`} className="mt-2">
                          Profesor {profesor.id}
                        </label>
                        <select
                      name={`profesor${profesor._id}`}
                      className="form-control"
                      value={profesor.profesor}
                      onChange={(e) =>
                        handleInputChange(profesor.id, "profesor", e.target.value)
                      }
                    >
                      <option value="">Seleccione un profesor</option>
                      {teachers.map((item) => (
                        <option key={item._id} value={`${item.nombre} ${item.apellido}`}>
                          {`${item.nombre} ${item.apellido}`}
                        </option>
                      ))}
                    </select>

                        <label htmlFor={`costoHora-${profesor.id}`} className="mt-2">
                          Costo Hora
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id={`costoHora-${profesor.id}`}
                          value={profesor.costoHora}
                          onChange={(e) =>
                            handleInputChange(profesor.id, "costoHora", e.target.value)
                          }
                        />
                      </div>
                    ))}

                  </div>
                </aside>
                <aside>
                  <div className="form-group col-md-12">
                    <div className="form-group col-md-12">
                      <label htmlFor="inputName">Descripción *</label>
                      <textarea
                        rows={18}
                        type="text"
                        className="form-control"
                        name="descripcion"
                        placeholder="Indique los detalles del curso"
                        value={descripcion}
                        onChange={onInputChange}
                      />
                     {isSubmitted && errorsInput.descripcion && (
                        <ValidateErrors errors={errorsInput.descripcion} />
                      )}
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="file"
                      className="block text-sm font-medium text-gray-700"
                    ></label>
                    <div className="mt-2 flex items-center">
                      <label htmlFor="file-input" className="upload">
                        <span>Subir Foto</span>
                      </label>
    
                      <label htmlFor="file-input" className="uploadFile">
                        <input
                          type="file"
                          name="imageCourse"
                          id="imageCourse"
                          accept=".jpg,.jpeg,.png"
                          onChange={handdleImg}
                          className="inputUpLoad"
                        />{" "}
                        
                      </label>

                     <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
                      <div className="imageContainerDiv">
                     {imageCourse ? (
                          <img
                            src={URL.createObjectURL(imageCourse)}
                            alt="file"
                            className="upLoadImg"
                            onError={handleImageError}
                          />
                        ) : (!edit && !urlImageCourse || edit && !urlImageCourse  ? (
                          <></>
                        ) : (
                          <img
                            src={`${urlImageCourse}`}
                            alt="file"
                            className="upLoadImg"
                            onError={handleImageError}
                          />
                        ))}
                      </div>
                    </span>
                    </div>
                  </div>
                </aside>
              </section>

              <div className="btn-submit mb-3">
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
        )
      }
    </>
  );
}

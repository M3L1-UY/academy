import { useState, useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useForm } from "../../hooks/useForm";
import Swal from "sweetalert2";
import { useAppContext } from "../../hooks/appContext";
import ValidateErrors from "../../componets/services/ValidateErrors";
import {validationMatriculaSchema} from "../../componets/services/validationSchema";


export default function Matricula({ matricula, edit, riviewList, userContext }) {
  const { HandleClose } = useAppContext();
  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  const api = `${hostServer}/api/matricula`;
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(false);
  const [isSubmitted,setIsSubmitted ] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialForm = {
    id: matricula ? matricula._id : 0,
    cursoId: matricula ? matricula.cursoId : "",
    cursoNombre: matricula ? matricula.cursoNombre : "",
    teacherId: matricula ? matricula.teacherId : "",
    teacherNombre: matricula ? matricula.teacherNombre : "",
    studentId: matricula ? matricula.studentId : "",
    studentNombre: matricula ? matricula.studentNombre : "",
    turno: matricula ? matricula.turno : "",
    finicio: matricula ? matricula.finicio : "",
    ffin: matricula ? matricula.ffin : "",
  };

  let { formData, onInputChange, validateForm, errorsInput, clearForm, setFormData, convertDateFormat } =
    useForm(initialForm, validationMatriculaSchema);

  const { id, cursoId, cursoNombre, teacherId, teacherNombre, studentId, studentNombre, turno, finicio, ffin } = formData;

  let {
    data,
    createData,
    updateData,
  } = useFetch(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numError = validateForm();
    setIsSubmitted(true);
    setIsLoading(true)

    if (!formData.cursoId || !formData.teacherId || !formData.studentId || !formData.turno || !formData.finicio || !formData.ffin) {
      Swal.fire({
        position: "top",
        icon: "info",
        title: "Debes completar todos los datos solicitados",
        showConfirmButton: false,
        timer: 5000,
      });
      setIsLoading(false);
      return;
    }
    else if (formData.finicio  > formData.ffin) {
      Swal.fire({
        position: "top",
        icon: "info",
        title: "La fecha de inicio no puede ser mayor a la fecha de fin",
        showConfirmButton: false,
        timer: 5000,
      });
      setIsLoading(false);
      return;
    }
  else if(!numError) {
    try {
        let url = `${api}`;
      
        if (!edit) {
          await createData(url, formData);
          setIsLoading(false);
        } else {
          await updateData(url, matricula._id, formData);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error al enviar datos:", error);
      }
    } else {
      setIsLoading(false);
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

  const getCourses = async () => {
    try {
      let url = `${hostServer}/api/courses`;
      let response = await fetch(url);
      let responseCurso = await response.json();

      if (responseCurso.data) {
        setCourses(responseCurso.data);
        if (responseCurso.data.length > 0) {
          cargaTeacher(responseCurso.data[0].profesores);
        }
      }

      url = `${hostServer}/api/students`;
      response = await fetch(url);
      let responseData = await response.json();

      if (responseData.data) {
        setStudents(responseData.data);
      }
    } catch (error) {
      setError(true);
    }
  };

  const handleCourseChange = (event) => {
    const selectedCourse = courses.find(
      (item) => item._id === event.target.value
    );
    if (selectedCourse) {
      setFormData({
        ...formData,
        cursoId: selectedCourse._id,
        cursoNombre: selectedCourse.nombre,
      });
      cargaTeacher(selectedCourse.profesores);
    }
  };

  const handleTeacherChange = (event) => {
    const selectedTeacher = teachers.find(
      (item) => item._id === event.target.value
    );
    if (selectedTeacher) {
      setFormData({
        ...formData,
        teacherId: selectedTeacher._id,
        teacherNombre: selectedTeacher.profesor,
      });
    }
  };

  const handleStudentChange = (event) => {
    const selectedStudent = students.find(
      (item) => item._id === event.target.value
    );
    if (selectedStudent) {
      setFormData({
        ...formData,
        studentId: selectedStudent._id,
        studentNombre: `${selectedStudent.nombre} ${selectedStudent.apellido}`,
      });
    }
  };

  const cargaTeacher = (teachers) => {
    setTeachers(teachers);
  };

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <>
      {
        // isLoading ? (
        // <h3>Cargando...</h3>
        // ) :
        error ? (
          <div>Error al cargar los datos.</div>
        ) : (
          <div className="container pt-3 px-5 pb-3 mb-3 col-md-10 mx-auto">
            <form onSubmit={handleSubmit}>

                  <div className="row mt-2">
                    <div className="form-group col-md-12">
                      <label htmlFor="cursoId">Curso</label>
                      <select
                        name="cursoId"
                        className="form-control"
                        value={cursoId}
                        onChange={handleCourseChange}
                      >
                        <option>Seleccione una opción</option>
                        {courses.map((item) => (
                          <option
                            key={item._id}
                            value={item._id}
                          >{`${item.nombre}`}</option>
                        ))}
                      </select>
                      {isSubmitted && errorsInput.cursoId && (
                    <ValidateErrors errors={errorsInput.cursoId} />
                  )}
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="form-group col-md-12">
                      <label htmlFor="teacherId">Profesor</label>
                      <select
                        name="teacherId"
                        className="form-control"
                        value={teacherId}
                        onChange={handleTeacherChange}
                      >
                        <option>Seleccione profesor</option>
                        {teachers.map(
                          (item) => (
                            <option
                              key={item._id}
                              value={item._id}
                            >{`${item.profesor}`}</option>
                          )
                        )}
                      </select>
                      {isSubmitted && errorsInput.teacherId && (
                    <ValidateErrors errors={errorsInput.teacherId} />
                  )}
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="form-group col-md-12">
                      <label htmlFor="studentId">Alumno</label>
                      <select
                        name="studentId"
                        className="form-control"
                        value={studentId}
                        onChange={handleStudentChange}
                      >
                        <option>Seleccione alumno</option>
                        {students.map((item) => (
                          <option
                            key={item._id}
                            value={item._id}
                          >{`${item.nombre} ${item.apellido}`}</option>
                        ))}
                      </select>
                      {isSubmitted && errorsInput.studentId && (
                    <ValidateErrors errors={errorsInput.studentId} />
                  )}
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="form-group col-md-6">
                      <label htmlFor="turno">Turno</label>
                      <select
                        name="turno"
                        className="form-control"
                        value={turno}
                        onChange={onInputChange}
                      >
                        <option>Seleccione turno</option>
                        <option value="Matutino">Matutino</option>
                        <option value="Vespertino">Vespertino</option>
                        <option value="Nocturno">Nocturno</option>
                      </select>
                      {isSubmitted && errorsInput.turno && (
                    <ValidateErrors errors={errorsInput.turno} />
                  )}
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="finicio">Fecha de Inicio</label>
                      <input
                        type="date"
                        className="form-control"
                        id="finicio"
                        name="finicio"
                        placeholder="Indique la fecha de inicio"
                        value={convertDateFormat(finicio)}
                        onChange={onInputChange}
                      />
                       {isSubmitted && errorsInput.finicio && (
                    <ValidateErrors errors={errorsInput.finicio} />
                  )}
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="form-group col-md-6">
                      <label htmlFor="ffin">Fecha de Finalización</label>
                      <input
                        type="date"
                        className="form-control"
                        id="ffin"
                        name="ffin"
                        placeholder="Indique la fecha de finalización"
                        value={convertDateFormat(ffin)}
                        onChange={onInputChange}
                      />
                                        {isSubmitted && errorsInput.ffin && (
                    <ValidateErrors errors={errorsInput.ffin} />
                  )}
                    </div>
                    
                  </div>


              <div className="btn-submit mt-5">
              {edit ? (
                  <button type="submit" className="form-button "disabled={isLoading}>
                    {isLoading ? "Actualizando..." : "Actualizar"}
                  </button>
                ) : (
                  <button type="submit" className="form-button" disabled={isLoading}>
                    {isLoading ? "Espere..." : "Agregar"}
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

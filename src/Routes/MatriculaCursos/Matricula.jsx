import { useState, useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import { useForm } from "../../hooks/useForm";
import Swal from "sweetalert2";
import { useAppContext } from "../../hooks/appContext";
import ValidateErrors from "../../componets/services/ValidateErrors";
import validationSchema from "../../componets/services/validationSchema";

export default function Curso({ matricula, edit, riviewList }) {
  const { HandleNivelClose } = useAppContext();
  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;
  const api = `${hostServer}/api/matricula`;
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(false);

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
    useForm(initialForm, validationSchema);

  const { id, cursoId, cursoNombre, teacherId, teacherNombre, studentId, studentNombre, turno, finicio, ffin } = formData;

  let {
    data,
    isLoading = false,
    getData,
    createData,
    updateData,
  } = useFetch(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.cursoId || !formData.teacherId || !formData.studentId || !formData.turno || !formData.finicio || !formData.ffin) {
      Swal.fire({
        position: "top",
        icon: "info",
        title: "Debes completar todos los datos solicitados",
        showConfirmButton: false,
        timer: 5000,
      });
      return;
    }
    const numError = validateForm();

    if (!numError) {
    try {
        let url = `${api}`;
        if (!edit) {
          await createData(url, formData);
        } else {
          await updateData(url, matricula._id, formData);
        }
      } catch (error) {
        console.error("Error al enviar datos:", error);
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
       HandleNivelClose();
        riviewList();
      }
      if (data?.status === 201) {
        clearForm();
        HandleNivelClose();
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
          <div className="container my-5 px-5">
            <form onSubmit={handleSubmit}>
              <section>
                <aside>
                  <div className="row mt-5">
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
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="form-group col-md-12">
                      <label htmlFor="teacherId">Profesor Asignado al Curso</label>
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
                    </div>
                  </div>
                </aside>
              </section>

              <div className="btn-submit">
                {edit ? (
                  <button type="submit" className="btn btn-primary w-100">
                    Actualizar
                  </button>
                ) : (
                  <button type="submit" className="btn btn-success w-100">
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

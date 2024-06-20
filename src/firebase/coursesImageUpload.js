import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
  } from "firebase/storage";
  import { useState } from "react";
  import { storage } from "./config"; //

  export const useCoursesImageUpload = () => {
    const [filesStatus, setFilesStatus] = useState({});
  
    const uploadFile = async (file, id) => {
        const storageRef = ref(storage, `coursesImages/${id}`);
        const uploadTask = uploadBytesResumable(storageRef, file, {
          contentType: file.type,
        });
      
        try {
          // Esperar hasta que la tarea de carga esté completa
          await uploadTask;
      
          // Obtener la URL de descarga después de que la tarea esté completa
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log(downloadURL)
          // Actualizar el estado o devolver la URL de descarga
          return downloadURL;
        } catch (error) {
          console.error("Error al subir archivo:", error);
          throw error; // O manejar el error adecuadamente
        }
      };
      
    const deleteFile = async (id) => {
      const storageRef = ref(storage, `coursesImages/${id}`);
      try {
        await deleteObject(storageRef);
        setFilesStatus((prevState) => {
          const newState = { ...prevState };
          delete newState[id];
          return newState;
        });
      } catch (error) {
        console.error("Error eliminando archivo:", error);
      }
    };
  
    return { uploadFile, deleteFile, filesStatus };
  };
  
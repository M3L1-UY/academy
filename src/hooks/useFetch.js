import { useState, useEffect } from "react";
import { useUsersContext } from "./UsersContext";

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsloading] = useState(true);
  const { usersContext } = useUsersContext();
  const token = usersContext?.token;

  const fetchData = async (url, method = "GET", formData = null) => {
    setIsloading(true);

      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };

      if (token) {
        console.log("entre en userContext")
        headers["Authorization"] = `Bearer ${usersContext?.token}`;
      }
    try {
      let options = null;
      // if (!formData?.imageCourse) {
      options = {
        method: method,
        credentials: "include",
        headers,
        body: formData ? JSON.stringify(formData) : null,
      };

      const response = await fetch(url, options);
      // console.log("response....:", response);
      const responseData = await response.json();
      // console.log("responseData....:", responseData);
      const result = {
        status: response.status,
        data: await responseData,
      };
      setData(result);
      return result;
    } catch (error) {
      if (error.name !== "AbortError") {
        const data = {
          status: 500,
          message: "No se pudo establecer conexión con el servidor",
          exito: false,
          errorSystem: await error.message,
        };
        setData(data);
      }
    } finally {
      setIsloading(false);
    }
  };

  const getData = async (url) => {
    const resp = await fetchData(url);
    return resp;
  };

  const createData = async (url, formData) => {
    const resp = await fetchData(url, "POST", formData);
    return resp;
  };

  const updateData = async (url, dataId, formData) => {
    const resp = await fetchData(`${url}/${dataId}`, "PUT", formData);
    return resp;
  };

  const deleteData = async (url, dataId) => {
    const resp = await fetchData(`${url}/${dataId}`, "DELETE");
    return resp;
  };

  const envioCorreo = async (url, formData) => {
    const resp = await fetchData(url, "POST", formData);
    const salidaOk = {
      message: "Registro agregado con éxito",
    };
    const data = {
      status: 201,
      data: salidaOk,
      exito: true,
    };
    setData(data);
    return resp;
  };
  return {
    data,
    isLoading,
    getData,
    createData,
    updateData,
    deleteData,
    envioCorreo,
  };
};

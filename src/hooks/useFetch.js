import { useState } from "react";
import Cookies from "js-cookie";

export const useFetch = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async (url, method = "GET", formData = null) => {
    setIsLoading(true);
    let role;

    const storedUser = Cookies.get("user");
    let headers = {
      "Content-Type": "application/json",
    };

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        headers.Authorization = `Bearer ${parsedUser?.token}`;
        
      } catch (error) {
        console.error("Failed to parse user from cookie:", error);
      }
    }

    let options = {
      method: method,
      credentials: "include",
      headers: headers,
    };

    if (method !== "GET" && formData) {
      options.body = JSON.stringify(formData);
    }
    try {
      const response = await fetch(url, options);
      const responseData = await response.json();
      const result = {
        status: response.status,
        data: responseData,
      };
      setData(result);
      return result;
    } catch (error) {
      if (error.name !== "AbortError") {
        const data = {
          status: 500,
          message: "No se pudo establecer conexión con el servidor",
          success: false,
          errorSystem: error.message,
        };
        setData(data);
      }
    } finally {
      setIsLoading(false);
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

  const getProtectedData = async (url) => {
    const resp = await fetchData(url, "POST");
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

  const sendEmail = async (url, formData) => {
    const resp = await fetchData(url, "POST", formData);
    const successData = {
      status: 201,
      data: { message: "Registro agregado con éxito" },
      success: true,
    };
    setData(successData);
    return resp;
  };

  return {
    data,
    isLoading,
    getData,
    getProtectedData,
    createData,
    updateData,
    deleteData,
    sendEmail,
  };
};

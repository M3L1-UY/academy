import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie"; // Importar js-cookie

const UsersContext = createContext();

export const useUsersContext = () => {
  return useContext(UsersContext);
};

export const UsersProvider = ({ children }) => {
  const [usersContext, setUsersContext] = useState({});

  useEffect(() => {
    const storedUser = Cookies.get("user");
    if (storedUser) {
      setUsersContext(JSON.parse(storedUser));
      
    }
  }, []);

  return (
    <UsersContext.Provider value={{ usersContext, setUsersContext }}>
      {children}
    </UsersContext.Provider>
  );
};

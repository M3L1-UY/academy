import React, { createContext, useContext, useRef, useState } from "react";

const UsersContext = createContext();

export const useUsersContext = () => {
  return useContext(UsersContext);
};

export const UsersProvider = ({ children }) => {
  const [usersContext, setUsersContext] = useState([]);

  return (
    <UsersContext.Provider value={{ usersContext, setUsersContext }}>
      {children}
    </UsersContext.Provider>
  );
};

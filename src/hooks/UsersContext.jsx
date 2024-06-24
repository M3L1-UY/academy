

import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const UsersContext = createContext();


export const useUsersContext = () => {
  return useContext(UsersContext);
};

export const UsersProvider = ({ children }) => {
  const [usersContext, setUsersContext] = useState({});

  useEffect(() => {
    const storedUser = Cookies.get("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUsersContext(parsedUser);
        console.log("UsersContext initialized with:", parsedUser); // Debug log
      } catch (error) {
        console.error("Failed to parse user from cookie:", error);
      }
    } else {
      console.log("No user cookie found"); // Debug log
    }
  }, []);

  return (
    <UsersContext.Provider value={{ usersContext, setUsersContext }}>
      {children}
    </UsersContext.Provider>
  );
};

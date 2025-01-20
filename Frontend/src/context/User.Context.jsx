import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useMutation } from '@tanstack/react-query';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    // SIGNUP USER
    const signupUser = useMutation({
      mutationFn: async (data) => {
        const res = await axios.post('/api/v1/users/register', data);
        console.log(res);
        
        return res.data;
      },
      // onError:(data)=>{
      //   console.log(data)
      // }
    });
    

  return (
    <UserContext.Provider value={{signupUser}}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

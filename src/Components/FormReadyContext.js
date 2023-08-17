import React, { createContext, useContext, useState } from "react";

const FormReadyContext = createContext();

export function useIsFormReady() {
  return useContext(FormReadyContext);
}

export function FormReadyProvider({ children }) {
  const [isFormReady, setisFormReady] = useState(false);

  return (
    <FormReadyContext.Provider value={{ isFormReady, setisFormReady }}>
      {children}
    </FormReadyContext.Provider>
  );
}

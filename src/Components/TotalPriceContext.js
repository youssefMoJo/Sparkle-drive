import React, { createContext, useContext, useState } from "react";

const TotalPriceContext = createContext();

export function useTotalPrice() {
  return useContext(TotalPriceContext);
}

export function TotalPriceProvider({ children }) {
  const [totalPrice, setTotalPrice] = useState(0);

  return (
    <TotalPriceContext.Provider value={{ totalPrice, setTotalPrice }}>
      {children}
    </TotalPriceContext.Provider>
  );
}

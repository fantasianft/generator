import { createContext, useEffect, useState } from "react";

const initalState = {
  selectedLayers: [],
};

export const Context = createContext<any>(initalState);

const Store = ({ children }: any) => {
  const [state, setState] = useState<any>(initalState);

  useEffect(() => {
    // Console log whenever the state changes
    console.log(state);
  });

  return (
    <Context.Provider value={[state, setState]}>{children}</Context.Provider>
  );
};

export default Store;

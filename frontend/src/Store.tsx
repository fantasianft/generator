import { createContext, useState } from "react";

const initalState = {
  availableLayers: [],
  overrideLayers: [],
};

export const Context = createContext<any>(initalState);

const Store = ({ children }: any) => {
  const [state, setState] = useState<any>(initalState);

  return (
    <Context.Provider value={[state, setState]}>{children}</Context.Provider>
  );
};

export default Store;

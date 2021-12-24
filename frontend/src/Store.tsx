import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { getSelectedLayers } from "./components/DropdownList";

const initalState = {
  availableLayers: {},
  overrideLayers: {},
};

export const Context = createContext<any>(initalState);

const Store = ({ children }: any) => {
  const [state, setState] = useState<any>(initalState);

  return (
    <Context.Provider value={[state, setState]}>{children}</Context.Provider>
  );
};

export default Store;

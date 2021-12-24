import axios from "axios";
import { createContext, useEffect, useState } from "react";

const initalState = {
  selectedLayers: {
    Background: "Random",
    Body: "Random",
    Clothes: "Random",
    "Clothing Accessories": "Random",
    Eyebrows: "Random",
    Eyes: "Random",
    Face: "Random",
    Hairstyle: "Random",
    "Head Accessories Back": "Random",
    "Head Accessories Front": "Random",
    Mouth: "Random",
    "Neck Accessories": "Random",
    Nose: "Random",
  },
};

export const Context = createContext<any>(initalState);

const Store = ({ children }: any) => {
  const [state, setState] = useState<any>(initalState);

  useEffect(() => {
    // Console log whenever the state changes
    console.log(state);
  });

  console.log(state);
  axios
    .post("http://localhost:3000/api/layers/create", state.selectedLayers)
    .then((res) => console.log(res));

  return (
    <Context.Provider value={[state, setState]}>{children}</Context.Provider>
  );
};

export default Store;

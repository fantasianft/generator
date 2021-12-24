import { Component, useContext, useEffect } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";
import { Context } from "../Store";

export const getSelectedLayers = (overrideLayers = {}) => {
  return axios.post("http://localhost:3000/api/layers/create", overrideLayers);
};

export const LayerDropdownsComponent = () => {
  const [state, setState] = useContext(Context);
  if (!Array.isArray(state.availableLayers)) {
    axios
      .get("http://localhost:3000/api/layers/all")
      .then((response) => {
        setState({ ...state, availableLayers: response.data });
      })
      .catch((error) => {
        alert(error);
      });
  }

  const handleChange = (event: any) => {
    console.log(state);
  };

  return (
    <div>
      {Array.isArray(state?.availableLayers) ? (
        Object.keys(state?.availableLayers).map(
          (value: string, index: number) => (
            <div key={index}>
              {state?.availableLayers[index].name}
              <Form.Select key={index} onChange={handleChange}>
                <option value="Random">Random</option>
                {state?.availableLayers[index]?.elements.map(
                  (file: any, index: number) => (
                    <option key={file.path} value={file.path}>
                      {file.name}
                    </option>
                  )
                )}
              </Form.Select>
            </div>
          )
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

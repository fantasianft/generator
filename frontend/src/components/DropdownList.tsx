import { useContext } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";
import { Context } from "../Store";

export const getSelectedLayers = (overrideLayers = {}) => {
  return axios.post("http://localhost:3000/api/layers/create", overrideLayers);
};

export const LayerDropdownsComponent = () => {
  const [state, setState] = useContext(Context);
  if (state.availableLayers.length === 0) {
    axios
      .get("http://localhost:3000/api/layers/all")
      .then((response) => {
        setState({ ...state, availableLayers: response.data });
      })
      .catch((error) => {
        alert(error);
      });
  }

  const handleChange = (event: any, layerIndex: number) => {
    let overrideLayer = state?.availableLayers[layerIndex];
    overrideLayer.overrideElement = overrideLayer.elements[event.target.value];

    state.overrideLayers = state.overrideLayers.filter(
      (item: any) => item.name !== overrideLayer.name
    );

    if (event.target.value !== "Random") {
      state.overrideLayers.push(overrideLayer);
    }

    console.log(state.overrideLayers);

    setState({ ...state });
  };

  return (
    <div>
      {Array.isArray(state?.availableLayers) ? (
        Object.keys(state?.availableLayers).map(
          (value: string, index: number) => (
            <div key={index}>
              {state?.availableLayers[index].name}
              <Form.Select key={index} onChange={(e) => handleChange(e, index)}>
                <option value="Random">Random</option>
                {state?.availableLayers[index]?.elements.map(
                  (file: any, index: number) => (
                    <option key={file.id} value={index}>
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

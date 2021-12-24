import { Component, useContext, useEffect } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";
import { Context } from "../Store";

interface ISelectComponent {
  index: number;
  options: any;
}

export const getSelectedLayers = (overrideLayers = {}) => {
  return axios.post("http://localhost:3000/api/layers/create", overrideLayers);
};

const SelectComponent = ({ index, options }: ISelectComponent) => {
  const [state, setState] = useContext(Context);

  const handleChange = (event: any) => {
    getSelectedLayers(state.overrideLayers).then((res) =>
      setState({ ...state, selectedLayers: res.data })
    );
  };

  return (
    <Form.Select key={index} onChange={handleChange}>
      <option value="Random">Random</option>
      {options.map((file: any, index: number) => (
        <option key={file.path} value={file.path}>
          {file.name}
        </option>
      ))}
    </Form.Select>
  );
};

export default class DropdownList extends Component<{}, any> {
  constructor(props: any) {
    super(props);
    this.state = { dropdowns: {} };
  }

  componentDidMount() {
    axios
      .get("http://localhost:3000/api/layers/all")
      .then((response) => {
        this.setState({ dropdowns: response.data });
      })
      .catch((error) => {
        alert(error);
      });
  }

  render() {
    return (
      <div>
        {Array.isArray(this.state.dropdowns) ? (
          Object.keys(this.state.dropdowns).map(
            (value: string, index: number) => (
              <div key={index}>
                {this.state.dropdowns[index].name}
                <SelectComponent
                  index={index}
                  options={this.state.dropdowns[index].elements}
                />
              </div>
            )
          )
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  }
}

import { Component, useContext, useEffect } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";
import { Context } from "../Store";

interface ISelectComponent {
  index: number;
  options: any;
}

const SelectComponent = ({ index, options }: ISelectComponent) => {
  const [state, setState] = useContext(Context);

  const handleChange = (event: any) => {
    // setState({ selectedLayers: [...state.selectedLayers, event.target.value] });
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
  static contextType = Context;

  constructor(props: any) {
    super(props);
    this.state = { dropdowns: {} };
  }

  componentDidMount() {
    axios
      .get("http://localhost:3000/api/layers/all")
      .then((response) => {
        this.setState({ dropdowns: response.data.layers });
      })
      .catch((error) => {
        alert(error);
      });
  }

  render() {
    return (
      <div>
        {this.state.dropdowns !== {} &&
        Object.keys(this.state.dropdowns).length > 0 ? (
          Object.keys(this.state.dropdowns).map(
            (name: string, index: number) => (
              <div key={index}>
                {name}
                <SelectComponent
                  index={index}
                  options={this.state.dropdowns[name]}
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

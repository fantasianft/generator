import React, { Component } from "react";
import axios from "axios";
import { Form } from "react-bootstrap";

export default class DropdownList extends Component<{}, any> {
  constructor(props: any) {
    super(props);
    this.state = { dropdowns: {} };
  }

  componentDidMount() {
    axios
      .get("http://localhost:3000/api/layers/all")
      .then((response) => {
        console.log(response);
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
              console.log(index),
              (
                <div key={index}>
                  {name}
                  <Form.Select key={index}>
                    <option value="Random">Random</option>
                    {this.state.dropdowns[name].map(
                      (file: any, index: number) => (
                        <option key={file.path} value={file.path}>
                          {file.name}
                        </option>
                      )
                    )}
                    {/* {this.state.dropdowns[name].forEach(
                    (file: any, index: number) => (
                      <p>{file.name}</p>
                    )
                  )} */}
                    {/* 
                  {this.state.dropdowns[name].map(
                    (name: string, index: number) => (
                      <option>{name}</option>
                    )
                  )} */}
                  </Form.Select>
                </div>
              )
            )
          )
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  }
}

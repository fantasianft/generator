import React, { Component } from "react";
import fs from "fs";

export default class DropdownList extends Component {
  componentDidMount() {
    fs.readdirSync("../../../").forEach((file: any) => {
      console.log(file);
    });
  }

  render() {
    return <div></div>;
  }
}

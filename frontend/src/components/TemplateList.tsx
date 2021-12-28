import React from "react";
import TemplateListItem from "./TemplateListItem";

export default class TemplateList extends React.Component<any, any> {
  render() {
    const results = this.props.data;

    let templates = results.map((item: any) => (
      <TemplateListItem
        url={item}
        property_type={this.props.property_type}
        zIndex={this.props.zIndex}
        addToCanvas={this.props.addtocanvas}
        key={item}
      />
    ));

    return <div className="row">{templates}</div>;
  }
}

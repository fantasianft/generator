import React, { Component } from "react";
import FabricCanvas from "./components/FabricCanvas";
import TemplateList from "./components/TemplateList";
import { Col, Tabs, Tab } from "react-bootstrap";
import "./App.css";
import { fabric } from "fabric";
import axios from "axios";

class App extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      activeProperty: null,
      layers: [],
    };
  }

  componentDidMount() {
    axios
      .get("http://localhost:3000/api/layers/all")
      .then((res) => this.setState({ layers: res.data }));
  }

  addToCanvas = (imgElement: any, property_type: any, z_Index: any) => {
    var imgInstance = new fabric.Image(imgElement, {
      width: 400,
      height: 400,
      // @ts-ignore
      the_type: property_type,
      zIndex: z_Index,
    });

    this.setState({ activeProperty: imgInstance });
  };

  render() {
    return (
      <div className="App">
        <div className="main">
          <div className="row">
            <Col md={6}>
              <Tabs defaultActiveKey={1} id="main_tabs">
                {Array.isArray(this.state.layers) ? (
                  Object.keys(this.state.layers).map(
                    (value: string, index: number) => (
                      <Tab
                        key={value}
                        eventKey={index + 1}
                        title={this.state.layers[index].name}
                      >
                        <TemplateList
                          data={this.state.layers[index].elements.map(
                            (element: any) =>
                              "http://localhost:3000/" + escape(element.path)
                          )}
                          property_type={this.state.layers[index].name}
                          zIndex={
                            this.state.layers[index].name === "Background"
                              ? -9999
                              : index
                          }
                          addtocanvas={this.addToCanvas}
                        />
                      </Tab>
                    )
                  )
                ) : (
                  <p>Loading...</p>
                )}
              </Tabs>
            </Col>

            <Col md={6}>
              <FabricCanvas activeProperty={this.state.activeProperty} />
            </Col>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

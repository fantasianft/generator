import { Component, useContext, useEffect } from "react";
import { Context } from "../Store";
import { getSelectedLayers } from "./DropdownList";
import Sketch from "react-p5";

export const Canvas = () => {
  const [state, setState] = useContext(Context);

  return <CanvasComponent state={state} />;
};

class CanvasComponent extends Component<any, any> {
  p5: any;
  images: any = [];
  preload = (p5: any) => {
    this.p5 = p5;
    console.log("preload");
    getSelectedLayers(this.props.state.overrideLayers).then((res: any) => {
      const layers = res.data;
      layers.forEach((layer: any) => {
        const imageUrl = `layers/${layer.name}/${layer.selectedElement.filename}`;
        this.images.push(p5.loadImage(encodeURIComponent(imageUrl)));
      });
    });
  };

  setup = (p5: any, parentRef: any) => {
    console.log("setup");

    p5.createCanvas(1000, 1000).parent(parentRef);
  };

  draw = (p5: any) => {
    this.images.forEach((imageLoaded: any) => p5.image(imageLoaded, 0, 0));
  };

  componentDidUpdate() {
    console.log("componentDidUpdate");
    this.p5?.preload();
  }

  render() {
    console.log("Render CanvasComponent");

    return (
      <Sketch preload={this.preload} setup={this.setup} draw={this.draw} />
    );
  }
}

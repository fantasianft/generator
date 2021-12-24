import { Component, useContext, useEffect } from "react";
import { Context } from "../Store";
import { getSelectedLayers } from "./DropdownList";
import Sketch from "react-p5";

export const Canvas = () => {
  const [state, setState] = useContext(Context);

  useEffect(() => {
    console.log("useEffect2");
  }, [state]);

  return <CanvasComponent layers={state.selectedLayers} />;
};

class CanvasComponent extends Component<any, any> {
  images: any = [];

  preload = (p5: any) => {
    getSelectedLayers(this.props.layers).then((res: any) => {
      const layers = res.data;
      layers.forEach((layer: any) => {
        const imageUrl = `layers/${layer.name}/${layer.selectedElement.filename}`;
        this.images.push(p5.loadImage(encodeURIComponent(imageUrl)));
      });
    });
  };

  setup = (p5: any, parentRef: any) => {
    p5.createCanvas(1000, 1000).parent(parentRef);
  };

  draw = (p5: any) => {
    this.images.forEach((imageLoaded: any) => p5.image(imageLoaded, 0, 0));
  };

  componentDidUpdate() {
    console.log("componentDidUpdate");
  }

  render() {
    console.log("Render CanvasComponent");

    return (
      <Sketch preload={this.preload} setup={this.setup} draw={this.draw} />
    );
  }
}

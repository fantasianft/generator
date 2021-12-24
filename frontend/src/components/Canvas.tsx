import axios from "axios";
import React, { Component, useContext, useEffect } from "react";
import * as THREE from "three";
import { Context } from "../Store";
import { getSelectedLayers } from "./DropdownList";
import Sketch from "react-p5";
import { Image, loadImage } from "canvas";

export const Canvas = () => {
  const [state, setState] = useContext(Context);

  useEffect(() => {
    console.log("useEffect2");
  }, [state]);

  return <CanvasComponent layers={state.selectedLayers} />;
};

class CanvasComponent extends Component<any, any> {
  // "/layers/Body/body%231.png"

  imageUrls = ["layers/Body/body%231.png", "layers/Face/face%231.png"];
  loadedImages = [];

  images: any = [];
  img: any;

  setup = (p5: any, parentRef: any) => {
    p5.createCanvas(1000, 1000).parent(parentRef);
    getSelectedLayers(this.props.layers).then((res: any) => {
      const layers = res.data;
      layers.forEach((layer: any) => {
        const imageUrl = `layers/${layer.name}/${layer.selectedElement.filename}`;
        p5.loadImage(encodeURIComponent(imageUrl), (img: any) => {
          p5.image(img, 0, 0);
        });
      });
      console.log(layers);
    });
  };

  draw = (p5: any) => {};

  componentDidUpdate() {
    console.log("componentDidUpdate");
  }

  render() {
    console.log("Render CanvasComponent");

    return <Sketch setup={this.setup} draw={this.draw} />;
  }
}

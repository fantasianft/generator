import React from "react";
import { fabric } from "fabric";
import { Button } from "react-bootstrap";

class FabricCanvas extends React.Component<any, any> {
  theCanvas: any;
  componentDidMount() {
    // Make a New Canvas
    this.theCanvas = new fabric.StaticCanvas("main-canvas", {
      preserveObjectStacking: true,
      height: 375,
      width: 375,
    });
  }

  componentWillReceiveProps = (newprops: { activeProperty: any }) => {
    // If Updated Item is not the same as the old one
    // 		=> Update the canvas with newer item
    if (newprops.activeProperty !== this.props.activeProperty) {
      this.updateCanvasforImage(
        this.props.activeProperty,
        newprops.activeProperty
      );
    }
  };

  updateCanvasforImage = (
    _prev: any,
    next: { the_type: string; zIndex: any }
  ) => {
    if (next) {
      let to_remove;
      // Find the same kind of element
      this.theCanvas.forEachObject((object: { the_type: string }) => {
        if (object.the_type === next.the_type) {
          to_remove = object;
        }
      });

      this.theCanvas.remove(to_remove);

      if (next.the_type === "Background") {
        this.theCanvas.setBackgroundImage(next);
        this.theCanvas.renderAll();
        return;
      }

      this.theCanvas.add(next);
      this.theCanvas.moveTo(next, next.zIndex);
    }
  };

  saveToCanvas = () => {
    let link = document.createElement("a");
    link.href = this.theCanvas.toDataURL({ format: "png" });
    link.download = "avatar.png";
    link.click();
  };

  render() {
    return (
      <div className="main-canvas-container">
        <canvas id="main-canvas"></canvas>

        <Button
          //   bsStyle="success"
          onClick={this.saveToCanvas}
          //   bsSize="large"
          //   block
        >
          Download Avatar
        </Button>
      </div>
    );
  }
}

export default FabricCanvas;

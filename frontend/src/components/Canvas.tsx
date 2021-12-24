import axios from "axios";
import React, { Component, useContext, useEffect } from "react";
import * as THREE from "three";
import { Context } from "../Store";
import { getSelectedLayers } from "./DropdownList";

export const Canvas = () => {
  const [state, setState] = useContext(Context);

  useEffect(() => {
    console.log("useEffect2");
  }, [state]);

  return <CanvasComponent layers={state.selectedLayers} />;
};

class CanvasComponent extends Component<any, any> {
  async componentDidMount() {
    // Create the scene and a camera to view it
    var scene = new THREE.Scene();

    /**
     * Camera
     **/

    // Specify the portion of the scene visiable at any time (in degrees)
    var fieldOfView = 75;

    // Specify the camera's aspect ratio
    var aspectRatio = window.innerWidth / window.innerHeight;

    // Specify the near and far clipping planes. Only objects
    // between those planes will be rendered in the scene
    // (these values help control the number of items rendered
    // at any given time)
    var nearPlane = 0.1;
    var farPlane = 1000;

    // Use the values specified above to create a camera
    var camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );

    // Finally, set the camera's position in the z-dimension
    camera.position.z = 5;

    /**
     * Renderer
     **/

    // Create the canvas with a renderer
    var renderer = new THREE.WebGLRenderer({ antialias: false });

    // Specify the size of the canvas
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Add the canvas to the DOM
    document.body.appendChild(renderer.domElement);

    /**
     * Image
     **/

    // Create a texture loader so we can load our image file
    var loader = new THREE.TextureLoader();

    // Load an image file into a custom material
    var material = new THREE.MeshLambertMaterial({
      map: loader.load("/layers/Body/body%231.png"),
    });

    // create a plane geometry for the image with a width of 10
    // and a height that preserves the image's aspect ratio
    var geometry = new THREE.PlaneGeometry(10, 10 * 0.75);

    // combine our image geometry and material into a mesh
    var mesh = new THREE.Mesh(geometry, material);

    // set the position of the image mesh in the x,y,z dimensions
    mesh.position.set(0, 0, 0);

    // add the image to the scene
    scene.add(mesh);

    /**
     * Lights
     **/

    // Add a point light with #fff color, .7 intensity, and 0 distance
    var light = new THREE.PointLight(0xffffff, 1, 0);

    // Specify the light's position
    light.position.set(1, 1, 100);

    // Add the light to the scene
    scene.add(light);

    /**
     * Render!
     **/

    // The main animation function that re-renders the scene each animation frame
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();
  }

  componentDidUpdate() {
    console.log("componentDidUpdate");
  }

  render() {
    console.log("Render CanvasComponent");

    return <div />;
  }
}

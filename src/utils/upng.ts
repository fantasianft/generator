import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import UPNG from "upng-js";

const WIDTH = 1024;
const HEIGHT = 1024;
const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext("2d");

const buffers = [];
const loadImages = async () => {
  for (let index = 1; index < 5; index++) {
    loadImage(`${process.cwd()}/upng/${index}.png`).then((image) => {
      ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
      buffers.push(
        ctx.getImageData(0, 0, image.naturalWidth, image.naturalHeight).data
          .buffer
      );
    });
  }
};

loadImages().then(() => {
  const png = UPNG.encode(buffers, WIDTH, HEIGHT, 0, [0]);
  fs.writeFileSync(`${process.cwd()}/upng/output.png`, Buffer.from(png));
});

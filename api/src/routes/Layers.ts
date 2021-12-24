import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import * as fs from "fs";
import junk from "junk";
// @ts-ignore
import { buildSetup, cleanName, startCreating } from "../../../dist/main";

const { OK } = StatusCodes;

interface LayerImages {
  [x: string]: {
    name: string;
    filename: string;
    path: string;
  }[];
}

/**
 * Get all layers.
 *
 * @param req
 * @param res
 * @returns
 */
export async function getAllLayers(req: Request, res: Response) {
  const layers: LayerImages = {};
  fs.readdirSync("../layers")
    .filter(junk.not)
    .forEach((layerFolder) => {
      const images = fs
        .readdirSync(`../layers/${layerFolder}`)
        .filter(junk.not)
        .map((i) => ({
          name: cleanName(i),
          filename: i,
          path: `${layerFolder}/${i}`,
        }));

      console.log(images);

      layers[layerFolder] = images;
    });

  return res.status(OK).json({ layers });
}

/**
 * Create from layers.
 *
 * @param req
 * @param res
 * @returns
 */
export async function createFromLayers(req: Request, res: Response) {
  buildSetup();
  startCreating(req.body);
  return res.status(OK).json(req.body);
}

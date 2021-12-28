import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import * as fs from "fs";
import {
  buildSetup,
  layersSetup,
  startCreating,
  createDna,
  constructLayerToDna,
  // @ts-ignore
} from "../../../dist/main";
// @ts-ignore
import { layerConfigurations } from "../../../dist/config";

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
  return res.status(OK).json(layersSetup(layerConfigurations[0].layersOrder, 'public/layers'));
}

/**
 * Create from layers.
 *
 * @param req
 * @param res
 * @returns
 */
export async function createFromLayers(req: Request, res: Response) {
  const layers = layersSetup(layerConfigurations[0].layersOrder);
  const overrideLayers = req.body ?? [];
  const newDna = createDna(layers, overrideLayers);
  const results = constructLayerToDna(newDna, layers);

  // await buildSetup();
  // await startCreating(req.body);
  return res.status(OK).json(results);
}

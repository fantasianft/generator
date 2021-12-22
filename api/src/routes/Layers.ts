import StatusCodes from "http-status-codes";
import { Request, Response } from "express";
import * as fs from "fs";

const { OK } = StatusCodes;

/**
 * Get all layers.
 *
 * @param req
 * @param res
 * @returns
 */
export async function getAllLayers(req: Request, res: Response) {
  const layers = fs.readdirSync("../layers");
  return res.status(OK).json({ layers });
}

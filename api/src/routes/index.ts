import { Router } from "express";
import { createFromLayers, getAllLayers } from "./Layers";

const layerRoute = Router();
layerRoute.get("/all", getAllLayers);
layerRoute.post("/create", createFromLayers);

const baseRouter = Router();
baseRouter.use("/layers", layerRoute);
export default baseRouter;

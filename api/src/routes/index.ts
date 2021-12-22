import { Router } from "express";
import { getAllLayers } from "./Layers";

const layerRoute = Router();
layerRoute.get("/all", getAllLayers);

const baseRouter = Router();
baseRouter.use("/layers", layerRoute);
export default baseRouter;

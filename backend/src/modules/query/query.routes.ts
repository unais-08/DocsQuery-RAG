import { Router } from "express";
import { query } from "./query.controller.js";
import { authenticate } from "../../middleware/authenticate.js";

const queryRouter = Router();

queryRouter.post(
    "/",
    authenticate,
    query
);

export { queryRouter };
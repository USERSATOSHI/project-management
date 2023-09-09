import { Router } from "express";
import authRouter from "./auth/index.js";
import projectsRouter from "./projects/index.js";
import teamRouter from "./teams/index.js";
import { verifyToken } from "../controller/auth/token.js";
import { getUsers, updateUser } from "../controller/user/index.js";
import userRouter from "./users/index.js";

const routes = Router();

routes.use("/auth", authRouter);
routes.use(verifyToken);
routes.use("/projects", projectsRouter);
routes.use("/teams", teamRouter);
routes.use("/users", userRouter);

export default routes;

import { Router } from "express";
import {
    createProject,
    deleteProject,
    getProject,
    getProjects,
    updateProject,
} from "../../controller/projects/index.js";

const projectsRouter = Router();

projectsRouter.get("/", async (req, res) => {
    // @ts-ignore
    const projects = await getProjects(req.user.hashedEmail);

    res.status(200).json({
        data: {
            projects: projects,
        },
    });
});

projectsRouter.get("/:hashedName", async (req, res) => {
    const { hashedName } = req.params;

    const project = await getProject(hashedName);

    res.status(200).json({
        data: {
            project,
        },
    });
});

projectsRouter.post("/create", async (req, res) => {
    const { name, team, description } = req.body;


    const project = await createProject({ name, team, description });

    res.status(200).json({
        data: {
            project,
        },
    });
});

projectsRouter.put("/:hashedName", async (req, res) => {
    const { hashedName } = req.params;
    const { name, team, description } = req.body;

    const project = await updateProject(hashedName, {
        name,
        team,
        description,
    });

    res.status(200).json({
        data: {
            project,
        },
    });
});

projectsRouter.delete("/:hashedName", async (req, res) => {
    const { hashedName } = req.params;

    await deleteProject(hashedName);

    res.status(200).json({
        data: {
            project: null,
        },
    });
});

export default projectsRouter;

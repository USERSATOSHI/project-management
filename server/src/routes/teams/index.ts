import { Router } from "express";
import { getAuthorFromHashedEmail } from "../../controller/user/index.js";
import { createTeam, deleteTeam, getTeam } from "../../controller/team/index.js";

const teamRouter = Router();

teamRouter.get("/", async (req, res) => {
    // @ts-ignore
    const { email } = req.user;

    const user = await getAuthorFromHashedEmail(email);
    if(!user) return res.status(400).json({ error: "Invalid credentials" });
    res.status(200).json({
        data: {
            teams: user.teams,
        },
    });
});

teamRouter.get("/:id", async (req, res) => {
    const { id } = req.params;

   const team = await getTeam(id);
    res.status(200).json({
        data: {
            teams: team,
        },
    });
});

teamRouter.post("/create", async (req, res) => {
    const { name,members } = req.body;

    const team = await createTeam({ name,members });

    res.status(200).json({
        data: {
            team,
        },
    });
});

teamRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const team = await deleteTeam(id);

    res.status(200).json({
        data: {
            team,
        },
    });
});

export default teamRouter;
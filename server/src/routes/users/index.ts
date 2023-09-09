import { Router } from "express";
import {
    getAuthorFromHashedEmail,
    getAuthorFromToken,
    getUser,
    getUsers,
    updateUser,
} from "../../controller/user/index.js";

const userRouter = Router();

userRouter.post("/update", async (req, res) => {
    const user = req.body;

    const updatedUser = await updateUser(user);

    res.status(204);
    res.send();
});

userRouter.get("/", async (req, res) => {
    const users = await getUsers();

    res.status(200).json({
        data: {
            users,
        },
    });
});

userRouter.get("/:id", async (req, res) => {
    const id = req.params.id;

    const user = await getUser(id);

    res.status(200).json({
        data: {
            user,
        },
    });
});

userRouter.get("/me", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    const auth = await getAuthorFromToken(token);

    res.status(200).json({
        data: {
            user: auth,
        },
    });
});

export default userRouter;

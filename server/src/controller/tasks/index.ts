import db from "../db/index.js";

const getTasks = async (projecthashName: string) => {
    const project = await db.get("projects", projecthashName);
    if (!project) return null;
    
    return project.value.tasks;
};


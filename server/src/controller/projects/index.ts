import { encrypt } from "../../misc/hash.js";
import { DBProject, Project, User } from "../../typings.js";
import { verifyToken } from "../auth/token.js";
import db from "../db/index.js";
import { getTeam } from "../team/index.js";
import { getAuthorFromHashedEmail } from "../user/index.js";

const getProjects = async (hashedEmail:string) => {
    

    const user = await getAuthorFromHashedEmail(hashedEmail);
    if (!user) return null;
    
    return user.projects as Project[];
}

const createProject = async (project: Partial<DBProject>) => {
    const hashedName = encrypt(project.name as string, process.env.securityKey as string);

    const teamData = await db.findOne('teams', (data) => {
        return data.value.name === project.team;
    });
    const proj = await db.set("projects", hashedName, {
        //@ts-ignore
        value: {
            name: project.name,
            team: teamData?.key,
            description: project.description,
            tasks: [],
        },
    });

    return {...proj?.value,id:hashedName} as Project;
}

const getProject = async (hashedName:string) => {
    const project = await db.get("projects", hashedName);
    
    if (!project) return null;

    // get all comments

    const teamData = await getTeam(project.value.team);
    project.value.team = teamData;

    for(let i = 0; i < project.value.tasks.length; i++) {
        const task = project.value.tasks[i];
        const res = [];
       for(const commentId of task.comments) {
            const comment = await db.get("comments", commentId);
            if(comment) {
                res.push(comment.value);
            }
       }

         project.value.tasks[i].comments = res;
    }


    return {...project.value,id:project.key} as Project;
}

const deleteProject = async (hashedName:string) => {
    await db.delete("projects", hashedName);
}

const updateProject = async (hashedName:string, project: Partial<DBProject>) => {
    const proj = await db.set("projects", hashedName, {
        //@ts-ignore
        value: {
            name: project.name,
            team: project.team,
            description: project.description,
            tasks: project.tasks,
        },
    });

    return proj?.value as DBProject;
}

export { getProjects, createProject, getProject, deleteProject, updateProject };
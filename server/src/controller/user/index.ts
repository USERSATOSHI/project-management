import { Author, DBUser, Project, Team, User } from "../../typings.js";
import db from "../db/index.js";
import { decrypt, encrypt } from "../../misc/hash.js";
import { KeyValueData } from "@akarui/aoi.db";
import jwt from "jsonwebtoken";

const createUser = async (user: User) => {
    const hashedPassword = encrypt(
        user.password,
        process.env.securityKey as string,
    );
    const hashedEmail = encrypt(user.email, process.env.securityKey as string);
    const data = await db.set("users", hashedEmail, {
        value: {
            username: user.username,
            password: hashedPassword,
            email: user.email,
            teams: [],
            projects: [],
        },
    });
    const copy = { ...data?.value } as Partial<Author>;
    delete copy.password;
    return copy as Author;
};

const getUser = async (hashedEmail: string) => {
    const user = await db.get("users", hashedEmail);
    if (!user) return null;
    const copy = { ...user.value } as DBUser & User;
    copy.email = decrypt(hashedEmail, process.env.securityKey as string);
    //@ts-ignore;
    delete copy.password;

    return copy as Omit<DBUser & User, "password">;
};

const getAuthor = async (email: string, password: string) => {
    const user = await db.findOne("users", (data) => {
        const decryptedEmail = decrypt(
            data.key,
            process.env.securityKey as string,
        );
        const decryptedPassword = decrypt(
            data.value.password,
            process.env.securityKey as string,
        );

        return decryptedEmail === email && decryptedPassword === password;
    });

    if (!user) return null;
    const copy = { ...user.value } as DBUser & User;
    copy.email = decrypt(user.key, process.env.securityKey as string);
    //@ts-ignore;
    delete copy.password;

    const teams = (await Promise.all(
        copy.teams.map(async (team) => {
            const teamData = await db.get("teams", team);
            if (!teamData) return null;
            return {
                ...teamData.value,
                id: teamData.key.split(".").join("_"),
            } as Team;
        }),
    )) as Team[];

    const projects = (await Promise.all(
        copy.projects.map(async (project) => {
            const projectData = await db.get("projects", project);
            if (!projectData) return null;
            return {
                ...projectData.value,
                id: projectData.key.split(".").join("_"),
            } as Project;
        }),
    )) as Project[];
    //@ts-ignore
    copy.teams = teams;
    //@ts-ignore
    copy.projects = projects;

    return copy as unknown as Omit<Author, "password">;
};

const getAuthorFromHashedEmail = async (hashedEmail: string) => {
    const user = await db.get("users", hashedEmail);
    if (!user) return null;
    const copy = { ...user.value } as DBUser & User;
    copy.email = decrypt(hashedEmail, process.env.securityKey as string);
    //@ts-ignore;
    delete copy.password;

    const teams = (await Promise.all(
        copy.teams.map(async (team) => {
            const teamData = await db.get("teams", team);
            if (!teamData) return null;
            return {
                ...teamData.value,
                id: teamData.key.split(".").join("_"),
            } as Team;
        }),
    )) as Team[];

    const projects = (await Promise.all(
        copy.projects.map(async (project) => {
            const projectData = await db.get("projects", project);
            if (!projectData) return null;
            return {
                ...projectData.value,
                id: projectData.key.split(".").join("_"),
            } as Project;
        }),
    )) as Project[];
    //@ts-ignore
    copy.teams = teams;
    //@ts-ignore
    copy.projects = projects;

    return copy as unknown as Omit<Author, "password">;
};

const updateUser = async (user: DBUser & User) => {
    let findUser = await db.findOne("users", (data) => {
        const decryptedEmail = decrypt(
            data.key,
            process.env.securityKey as string,
        );
        return decryptedEmail === user.email;
    });

    if (!findUser) return null;
    const value = { ...findUser.value, ...user };
    await db.set("users", findUser.key, {
        // @ts-ignore
        value,
    });
};

const getUsers = async () => {
    const users = (await db.findMany("users", () => true)) as KeyValueData[];
    return users?.map((user) => {
        return {
            email: decrypt(user.key, process.env.securityKey as string),
            username: user.value.username,
        } as User;
    });
};

const getAuthorFromToken = async (token: string) => {
    const email = (jwt.decode(token) as { copy: User }).copy.email as string;
    const user = await db.findOne("users", (data) => {
        const decryptedEmail = decrypt(
            data.key,
            process.env.securityKey as string,
        );
        return decryptedEmail === email;
    });
    if (!user) return null;
    const copy = { ...user.value } as DBUser & User;
    copy.email = decrypt(user.key, process.env.securityKey as string);
    //@ts-ignore
    delete copy.password;

    const teams = (await Promise.all(
        copy.teams.map(async (team) => {
            const teamData = await db.get("teams", team);
            if (!teamData) return null;
            return {
                ...teamData.value,
                id: teamData.key.split(".").join("_"),
            } as Team;
        }),
    )) as Team[];

    const projects = (await Promise.all(
        copy.projects.map(async (project) => {
            const projectData = await db.get("projects", project);
            if (!projectData) return null;
            return {
                ...projectData.value,
                id: projectData.key.split(".").join("_"),
            } as Project;
        }),
    )) as Project[];
    //@ts-ignore
    copy.teams = teams;
    //@ts-ignore
    copy.projects = projects;

    return copy as unknown as Omit<Author, "password">;
};

export {
    createUser,
    getUser,
    getAuthor,
    updateUser,
    getAuthorFromHashedEmail,
    getUsers,
    getAuthorFromToken
};

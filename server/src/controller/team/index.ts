import { decrypt, encrypt } from "../../misc/hash.js";
import { DBTeam, Team } from "../../typings.js";
import db from "../db/index.js";

const createTeam = async (team: DBTeam) => {
    const hashedName = encrypt(team.name, process.env.securityKey as string);
    const members = [];

    for(const member of team.members) {
        const user = await db.findOne("users", (data) => {
            const decryptedEmail = decrypt(
                data.key,
                process.env.securityKey as string,
            );
            return decryptedEmail === member;
        });
        if(user) {
            members.push(user.key);
        }
    }

    const teamd = await db.set("teams", hashedName, {
        //@ts-ignore
        value: {
            name: team.name,
            members: members,
        },
    });

    return {...teamd?.value, id: teamd?.key} as Team;
};

const getTeam = async (id: string) => {
    const team = await db.get("teams", id);
    if (!team) return null;
    const copy = { ...team.value } as DBTeam & Team;
    const members = (await Promise.all(
        copy.members.map(async (member) => {
            const memberData = await db.get("users", member);
            if (!memberData) return null;
            delete memberData.value.password;
            return memberData.value;
        }),
    )) as Team["members"];
    //@ts-ignore
    copy.members = members;

    return copy as Team;
};

const deleteTeam = async (id: string) => {
    await db.delete("teams", id);
};

const getTeams = async (userId: string) => {
    const teams = await db.findMany("teams", (data) => {
        return data.value.members.includes(userId);
    });
};
export { createTeam, getTeam, deleteTeam, getTeams };

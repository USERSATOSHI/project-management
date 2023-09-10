import {
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    Typography,
    ThemeProvider,
    createTheme,
} from "@mui/material";
import "./index.scss";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
export default function Team() {
    const darkTheme = createTheme({
        palette: {
            mode: "dark",
            background: {
                default: "rgb(16,32,64)",
            },
        },
    });
    const [name, setName] = useState("");
    const [members, setMembers] = useState([]);
    const location = useLocation();
    useEffect(() => {
        const teamId = location.pathname
            .split("/")
            .pop()
            ?.split("_")
            .join(".") as string;
        console.log("teamId", teamId);
        (async () => {
            const teamData = await fetch(
                `https://pmt-backend.usersatoshi.repl.co/teams/${teamId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token",
                        )}`,
                    },
                },
            ).then((res) => res.json());
            console.log("teamData", teamData);

            setMembers(teamData.data.teams.members);
            setName(teamData.data.teams.name);
        })();
    }, [location.pathname]);
    return (
        <ThemeProvider theme={darkTheme}>
            <div className="team">
                <Typography
                    variant="h4"
                    component="h4"
                    gutterBottom
                    sx={{
                        color: "white",
                    }}
                >
                    Team: {name}
                </Typography>
                <div className="list">
                    <List
                        sx={{
                            width: "100%",
                            minWidth: 300,
                            // backgroundColor: "background.default",
                            borderRadius: "8px",
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            gap: "16px",
                        }}
                    >
                        {members.map((member: any) => (
                            <Member
                                name={member.username}
                                email={member.email}
                                role="Member"
                            />
                        ))}
                    </List>
                </div>
            </div>
        </ThemeProvider>
    );
}

function Member({
    name,
    email,
    role,
}: {
    name: string;
    email: string;
    role: string;
}) {
    return (
        <ListItem
            alignItems="center"
            sx={{
                width: "max-content",
                minWidth: 150,
                backgroundColor: "background.default",
                borderRadius: "8px",
                padding: "32px",
            }}
        >
            <ListItemAvatar>
                <Avatar alt={name} />
            </ListItemAvatar>
            <div className="details">
                <h3>{name}</h3>
                <div className="sub">
                    <p>{email}</p>
                    <p>{role}</p>
                </div>
            </div>
        </ListItem>
    );
}

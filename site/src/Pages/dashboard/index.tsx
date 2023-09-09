import {
    Button,
    Link,
    Modal,
    Paper,
    TextField,
    darken,
    lighten,
    ThemeProvider,
    createTheme,
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Autocomplete,
} from "@mui/material";
import "./index.scss";
import randomColor from "../../util/randomColor";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import isDarkOrLightColor from "../../util/isDarkorLightColor";

import { useEffect, useState } from "react";
import { redirect } from "react-router-dom";
export default function DashBoard({
    setPage,
}: {
    setPage: (page: string) => void;
}) {
    setPage("dashboard");
    const [openCreateProjectModal, setOpenCreateProjectModal] = useState(false);
    const [openCreateTeamModal, setOpenCreateTeamModal] = useState(false);

    const handleCreateProjectModalClose = () => {
        setOpenCreateProjectModal(false);
    };

    const handleCreateProjectModalOpen = () => {
        setOpenCreateProjectModal(true);
    };

    const handleCreateTeamModalClose = () => {
        setOpenCreateTeamModal(false);
    };

    const handleCreateTeamModalOpen = () => {
        setOpenCreateTeamModal(true);
    };

    const [teams, setTeams] = useState<
        { name: string; members: string[]; id: string }[]
    >([]);

    const [projects, setProjects] = useState<
        { name: string; description: string; id: string }[]
    >([
        {
            name: "Project 1",
            description: "This is a project",
            id: "aeb1",
        },
        {
            name: "Project 2",
            description: "This is a project",
            id: "aeb1",
        },
        {
            name: "Project 3",
            description: "This is a project",
            id: "aeb1",
        },
        {
            name: "Project 4",
            description: "This is a project",
            id: "aeb1",
        },
        {
            name: "Project 5",
            description: "This is a project",
            id: "aeb1",
        },
    ]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log({ token });
        if (!token) {
            window.location.href = "/login";
        }

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (Object.keys(user).length === 0) {
            window.location.href = "/login";
        }

        console.log({ user });

        setProjects(user.projects);
        setTeams(user.teams);
    }, []);

    return (
        <>
            <div className="dashboard">
                <div className="box">
                    <div className="headings">
                        <div className="title">Projects</div>
                        <div className="actions">
                            <Button
                                variant="contained"
                                startIcon={<AddCircleOutlineOutlinedIcon />}
                                onClick={handleCreateProjectModalOpen}
                            >
                                Create Project
                            </Button>
                        </div>
                    </div>
                    <div className="list">
                        {projects.map((project) => (
                            <ProjectCard
                                name={project.name}
                                description={project.description}
                                id={project.id.replaceAll(".","_")}
                            />
                        ))}
                    </div>
                </div>
                <div className="box">
                    <div className="headings">
                        <div className="title">Teams</div>
                        <div className="actions">
                            <Button
                                variant="contained"
                                startIcon={<AddCircleOutlineOutlinedIcon />}
                                onClick={handleCreateTeamModalOpen}
                            >
                                Create Team
                            </Button>
                        </div>
                    </div>
                    <div className="list">
                        {teams.map((team) => {
                            console.log({ team });
                            return (
                                <TeamCard
                                    name={team.name}
                                    memberCount={team.members.length}
                                    id={team.id.replaceAll(".","_")}
                                    team={team}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
            <CreateProjectModal
                open={openCreateProjectModal}
                handleCreateProjectModalClose={handleCreateProjectModalClose}
                teams={teams.map((team) => team.name)}
                setProjects={setProjects}
            />

            <CreateTeamModal
                open={openCreateTeamModal}
                handleCreateTeamModalClose={handleCreateTeamModalClose}
                setTeams={setTeams}
            />
        </>
    );
}

function ProjectCard({
    name,
    description,
    id,
}: {
    name: string;
    description: string;
    id: string;
}) {
    const [color, setColor] = useState("#000");

    useEffect(() => {
        setColor(randomColor());
    }, []);
    return (
        <Link
            href={`/projects/${id}`}
            className="item"
            sx={{
                cursor: "pointer",
                backgroundColor: color,
                color:
                    isDarkOrLightColor(color) === "dark"
                        ? lighten(color, 0.7)
                        : darken(color, 0.7),
                textDecoration: "none",
            }}
        >
            <h3>{name}</h3>
            <p>{description}</p>
        </Link>
    );
}

function TeamCard({
    name,
    memberCount,
    id,
    team,
}: {
    name: string;
    memberCount: number;
    id: string;
    team: {
        name: string;
        members: string[];
        id: string;
    };
}) {
    const [color, setColor] = useState("#000");

    useEffect(() => {
        setColor(randomColor());
    }, []);
    return (
        <Link
            href={`/teams/${id}`}
            className="item"
            onClick={() => {}}
            sx={{
                cursor: "pointer",
                backgroundColor: color,
                color:
                    isDarkOrLightColor(color) === "dark"
                        ? lighten(color, 0.7)
                        : darken(color, 0.7),
                textDecoration: "none",
            }}
        >
            <h3>{name}</h3>
            <p>Members: {memberCount}</p>
        </Link>
    );
}

function CreateProjectModal({
    open,
    handleCreateProjectModalClose,
    teams,
    setProjects,
}: {
    open: boolean;
    handleCreateProjectModalClose: () => void;
    teams: string[];
    setProjects: (
        projects: { name: string; description: string; id: string }[],
    ) => void;
}) {
    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "50%",
        minWidth: "300px",
        height: "500px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: "2rem",
        gap: "16px",
        backgroundColor: "rgb(8,16,32)",
    } as const;

    const darkTheme = createTheme({
        palette: {
            mode: "dark",
        },
    });

    const [team, setTeam] = useState("");
    const [pn, setPn] = useState("");
    const [pd, setPd] = useState("");
    const handleChange = (event: SelectChangeEvent) => {
        setTeam(event.target.value as string);
    };

    const createProject = async () => {
        console.log({ pn, pd, team });

        const {data} = await fetch("http://localhost:3000/projects/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ name: pn, description: pd, team }),
        }).then((res) => res.json());

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        user.projects.push(data.project);
        localStorage.setItem("user", JSON.stringify(user));

        await fetch("http://localhost:3000/users/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                username: user.username,
                email: user.email,
                password: user.password,
                teams: user.teams.map((x: { id: string; }) => x.id),
                projects: user.projects.map(x => x.id),
            }),
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        setProjects((prev: unknown[]) => {
            return [...prev, data.project];
        });

        handleCreateProjectModalClose();
    };
    return (
        <ThemeProvider theme={darkTheme}>
            <Modal open={open} onClose={handleCreateProjectModalClose}>
                <Paper elevation={3} sx={style}>
                    <div
                        style={{
                            height: "100%",
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            gap: "64px",
                        }}
                    >
                        <TextField
                            label="Project Name"
                            sx={{
                                width: "100%",
                                color: "white",
                            }}
                            value={pn}
                            onChange={(e) => setPn(e.target.value)}
                        />
                        <TextField
                            label="Project Description"
                            sx={{
                                width: "100%",
                            }}
                            value={pd}
                            onChange={(e) => setPd(e.target.value)}
                        />
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">
                                Add Team
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={team}
                                label="Team"
                                onChange={handleChange}
                            >
                                {teams.map((team) => (
                                    <MenuItem value={team}>{team}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                            marginTop: "1rem",
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={createProject}
                        >
                            Create Project
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleCreateProjectModalClose}
                        >
                            Cancel
                        </Button>
                    </div>
                </Paper>
            </Modal>
        </ThemeProvider>
    );
}

function CreateTeamModal({
    open,
    handleCreateTeamModalClose,
    setTeams,
}: {
    open: boolean;
    handleCreateTeamModalClose: () => void;
    setTeams: (
        teams: { name: string; memberCount: number; id: string }[],
    ) => void;
}) {
    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "50%",
        minWidth: "300px",
        height: "500px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: "2rem",
        gap: "16px",
        backgroundColor: "rgb(8,16,32)",
    } as const;

    const darkTheme = createTheme({
        palette: {
            mode: "dark",
            background: {
                default: "rgb(8,16,32)",
            },
        },
    });

    const [invitedMembers, setInvitedMembers] = useState<string[]>([]);
    const [invitee, setInvitee] = useState("");
    const [teamName, setTeamName] = useState("");
    const addInvitee = (email: string) => {
        setInvitedMembers([...invitedMembers, email]);
    };

    const removeInvitee = (email: string) => {
        setInvitedMembers(invitedMembers.filter((member) => member !== email));
    };

    const createTeam = async () => {
        console.log({ teamName, invitedMembers });

        const { data } = await fetch("http://localhost:3000/teams/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ name: teamName, members: invitedMembers }),
        }).then((res) => res.json());

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        user.teams.push(data.team);
        localStorage.setItem("user", JSON.stringify(user));

        await fetch("http://localhost:3000/users/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
                username: user.username,
                email: user.email,
                password: user.password,
                teams: user.teams.map((x: { id: string; }) => x.id),
                projects: user.projects.map(x => x.id),
            }),
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        setTeams((prev: unknown[]) => {
            return [...prev, data.team];
        });

        handleCreateTeamModalClose();
    };

    const [allMembers, setAllMembers] = useState<
        { email: string; username: string }[]
    >([]);

    useEffect(() => {
        (async () => {
            const { data } = await fetch("http://localhost:3000/users", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }).then((res) => res.json());
            setAllMembers(data.users);
        })();
    }, []);
    return (
        <ThemeProvider theme={darkTheme}>
            <Modal open={open} onClose={handleCreateTeamModalClose}>
                <Paper elevation={3} sx={style}>
                    <div
                        style={{
                            height: "100%",
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            gap: "64px",
                        }}
                    >
                        <TextField
                            label="Team Name"
                            sx={{
                                width: "100%",
                                color: "white",
                            }}
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                        />
                        {/* add member field */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={allMembers.map((x) => x.email)}
                                sx={{
                                    width: "100%",
                                }}
                                onChange={(e, value) => {
                                    console.log(value);
                                    if (value) {
                                        addInvitee(value);
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Invite Member"
                                        sx={{
                                            width: "100%",
                                        }}
                                        value={invitee}
                                        onChange={(e) =>
                                            setInvitee(e.target.value)
                                        }
                                    />
                                )}
                            />
                            <Button
                                startIcon={<AddIcon />}
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexWrap: "nowrap",
                                    whiteSpace: "nowrap",
                                    padding: "0 16px",
                                }}
                                onClick={() => {
                                    addInvitee(invitee);
                                    setInvitee("");
                                }}
                            >
                                Add Member
                            </Button>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                                width: "100%",
                                height: 100,
                                overflowY: "auto",
                                borderRadius: "8px",
                            }}
                        >
                            {invitedMembers.map((x) => (
                                <Paper
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "8px",
                                        alignItems: "center",
                                        backgroundColor: "rgb(8,16,32)",
                                    }}
                                >
                                    <span
                                        style={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            marginLeft: "16px",
                                        }}
                                    >
                                        {x}
                                    </span>
                                    <Button onClick={() => removeInvitee(x)}>
                                        <DeleteIcon />
                                    </Button>
                                </Paper>
                            ))}
                        </Box>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                            marginTop: "1rem",
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={createTeam}
                        >
                            Create Team
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleCreateTeamModalClose}
                        >
                            Cancel
                        </Button>
                    </div>
                </Paper>
            </Modal>
        </ThemeProvider>
    );
}

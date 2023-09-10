/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
//@ts-nocheck
import {
    Autocomplete,
    Avatar,
    Button,
    Divider,
    Drawer,
    Paper,
    Select,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    ThemeProvider,
    Tooltip,
    createTheme,
} from "@mui/material";
import "./index.scss";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Task } from "./typings";
import getRelativeTime from "../../util/relativeTime";
import { useLocation } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const { children, value, index, style, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
            style={style}
        >
            {value === index && (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                        gap: "16px",
                        flexWrap: "wrap",
                    }}
                >
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

export function BasicTabs({
    rows,
    setOpenDrawer,
    setTaskSelected,
}: {
    rows: Task[];
    setOpenDrawer: (val: boolean) => void;
    setTaskSelected: (val: Task) => void;
}) {
    const [value, setValue] = React.useState(0);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                >
                    <Tab label="Table" {...a11yProps(0)} />
                    <Tab label="Board" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <br />
            <TabPanel value={value} index={0}>
                <Box
                    sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        overflowX: "auto",
                    }}
                >
                    <Table
                        sx={{
                            minWidth: 650,
                            backgroundColor: "rgb(11,22,44)",
                            "&:last-child td, &:last-child th": {
                                border: 0,
                            },
                        }}
                        aria-label="simple table"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell className="tableName">
                                    Project
                                </TableCell>
                                <TableCell className="tableName" align="center">
                                    Status
                                </TableCell>
                                <TableCell className="tableName" align="center">
                                    Assigned To
                                </TableCell>
                                <TableCell className="tableName" align="center">
                                    Due
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{
                                        "&:last-child td, &:last-child th": {
                                            border: 0,
                                        },
                                    }}
                                >
                                    <TableCell
                                        component="th"
                                        scope="row"
                                        onClick={() => {
                                            setOpenDrawer(true),
                                                setTaskSelected(row);
                                        }}
                                        sx={{
                                            cursor: "pointer",
                                        }}
                                    >
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="center">
                                        {row.status}
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Tooltip title={row.assignedTo} arrow>
                                            <Avatar sx={{ bgcolor: "red" }}>
                                                {row.assignedTo}
                                            </Avatar>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="center">
                                        {new Date(row.due).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </TabPanel>
            <TabPanel
                value={value}
                index={1}
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    flexWrap: "wrap",
                }}
            >
                <Paper elevation={3} className="paper">
                    <div className="headings">
                        <div className="title">TO DO</div>
                    </div>
                    <div className="list">
                        {rows
                            .filter((row) => row.status === "TODO")
                            .map((row) => (
                                <div
                                    className="card"
                                    onClick={() => {
                                        setOpenDrawer(true),
                                            setTaskSelected(row);
                                    }}
                                >
                                    <div className="card-title">{row.name}</div>
                                    <div className="avatar">
                                        <Tooltip title={row.assignedTo} arrow>
                                            <Avatar sx={{ bgcolor: "red" }}>
                                                {row.assignedTo}
                                            </Avatar>
                                        </Tooltip>
                                    </div>
                                </div>
                            ))}
                    </div>
                </Paper>
                <Paper elevation={3} className="paper">
                    <div className="headings">
                        <div className="title">PROGRESS</div>
                    </div>
                    <div className="list">
                        {rows
                            .filter((row) => row.status === "PROGRESS")
                            .map((row) => (
                                <div
                                    className="card"
                                    onClick={() => {
                                        setOpenDrawer(true),
                                            setTaskSelected(row);
                                    }}
                                >
                                    <div className="card-title">{row.name}</div>
                                    <div className="avatar">
                                        <Tooltip title={row.assignedTo} arrow>
                                            <Avatar sx={{ bgcolor: "red" }}>
                                                {row.assignedTo}
                                            </Avatar>
                                        </Tooltip>
                                    </div>
                                </div>
                            ))}
                    </div>
                </Paper>
                <Paper elevation={3} className="paper">
                    <div className="headings">
                        <div className="title">COMPLETED</div>
                    </div>
                    <div className="list">
                        {rows
                            .filter((row) => row.status === "COMPLETED")
                            .map((row) => (
                                <div
                                    className="card"
                                    onClick={() => {
                                        setOpenDrawer(true),
                                            setTaskSelected(row);
                                    }}
                                >
                                    <div className="card-title">{row.name}</div>
                                    <div className="avatar">
                                        <Tooltip title={row.assignedTo} arrow>
                                            <Avatar sx={{ bgcolor: "red" }}>
                                                {row.assignedTo}
                                            </Avatar>
                                        </Tooltip>
                                    </div>
                                </div>
                            ))}
                    </div>
                </Paper>
            </TabPanel>
        </Box>
    );
}

export default function Project() {
    const [rows, setRows] = React.useState<
        {
            name: string;
            status: "TODO" | "PROGRESS" | "COMPLETED";
            description: string;
            assignedTo: string;
            due: number;
            id: string;
        }[]
    >([
        {
            name: "Project 1",
            status: "TODO",
            assignedTo: "A",
            description: "This is a sample description",
            due: Date.now(),
            id: "a",
        },
        {
            name: "Project 2",
            status: "PROGRESS",
            assignedTo: "B",
            due: Date.now(),
            description: "This is a sample description",
            id: "b",
        },
        {
            name: "Project 3",
            status: "COMPLETED",
            assignedTo: "C",
            due: Date.now(),
            description: "This is a sample description",
            id: "c",
        },
    ]);

    const [project, setProject] = React.useState(null);

    const location = useLocation();
    React.useEffect(() => {
        const id = location.pathname
            .split("/")
            .pop()
            ?.split("_")
            .join(".") as string;
        (async () => {
            const { data } = await fetch(
                "https://pmt-backend.usersatoshi.repl.co/projects/" + id,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                            "Bearer " + localStorage.getItem("token") + "",
                    },
                },
            ).then((res) => res.json());
            const p = data.project;
            setProject(p);
            const tasks = p.tasks;
            console.log(data);
            setRows(tasks);
        })();
    }, [location.pathname]);

    const [taskSelected, setTaskSelected] = React.useState<Task | null>(null);

    const darkTheme = createTheme({
        palette: {
            mode: "dark",
            background: {
                default: "rgb(16,32,64)",
            },
        },
    });
    const [openDrawer, setOpenDrawer] = React.useState(false);
    const [openTaskModal, setOpenTaskModal] = React.useState(false);
    return (
        <ThemeProvider theme={darkTheme}>
            <div className="project">
                <BasicTabs
                    rows={rows}
                    setOpenDrawer={setOpenDrawer}
                    setTaskSelected={setTaskSelected}
                />
                <Button
                    variant="contained"
                    className="button"
                    onClick={() => setOpenTaskModal(true)}
                >
                    Add Task
                </Button>
            </div>
            <DrawerComponent
                taskSelected={taskSelected}
                openDrawer={openDrawer}
                setOpenDrawer={setOpenDrawer}
            />

            <CreateTaskModal
                open={openTaskModal}
                setOpen={setOpenTaskModal}
                team={project?.team}
                setRows={setRows}
            />
        </ThemeProvider>
    );
}

function CreateTaskModal({
    open,
    setOpen,
    team,
    setRows,
}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    team: any;
    setRows: React.Dispatch<
        React.SetStateAction<
            {
                name: string;
                status: "TODO" | "PROGRESS" | "COMPLETED";
                description: string;
                assignedTo: string;
                due: number;
                id: string;
            }[]
        >
    >;
}) {
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [due, setDue] = React.useState("");
    const [assignedTo, setAssignedTo] = React.useState("");
    const [status, setStatus] = React.useState("TODO");
    console.log(team);

    const handleclick = async () => {
        const data = {
            name,
            description,
            due,
            assignedTo,
            status,
        };
        console.log(data);

        setRows((prev) => [
            ...prev,
            {
                name,
                description,
                due,
                assignedTo,
                status,
                id: prev.length + 1 + "",
            },
        ]);
    };
    return (
        <Drawer
            anchor="right"
            open={open}
            sx={{
                width: window.innerWidth > 600 ? "50%" : "100%",
            }}
            PaperProps={{
                sx: {
                    width: window.innerWidth > 600 ? "50%" : "100%",
                    backgroundColor: "rgb(16,32,64)",
                },
            }}
            onClose={() => setOpen(false)}
            className="drawer"
        >
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    gap: "16px",
                    backgroundColor: "rgb(8,16,32)",
                }}
                className="drawer"
            >
                <Paper elevation={3} className="p">
                    <TextField
                        label="Name"
                        variant="outlined"
                        className="input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <TextField
                        label="Description"
                        variant="outlined"
                        className="input"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            value={due}
                            onChange={(e) =>
                                setDue(new Date(e?.toString()).getTime())
                            }
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>

                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={team?.members.map((x) => x.username)}
                        sx={{ width: 300 }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Assigned To"
                                variant="outlined"
                            />
                        )}
                        value={assignedTo}
                        onChange={(e, value) => setAssignedTo(value)}
                    />

                    <Select
                        native
                        value={status}
                        onChange={(e) => setStatus(e.target.value as string)}
                        inputProps={{
                            name: "status",
                            id: "outlined-age-native-simple",
                        }}
                    >
                        <option value={"TODO"}>TODO</option>
                        <option value={"PROGRESS"}>PROGRESS</option>
                        <option value={"COMPLETED"}>COMPLETED</option>
                    </Select>

                    <Button
                        variant="contained"
                        className="button"
                        onClick={handleclick}
                    >
                        Create Task
                    </Button>
                </Paper>
            </Box>
        </Drawer>
    );
}

function DrawerComponent({
    taskSelected,
    openDrawer,
    setOpenDrawer,
}: {
    taskSelected: Task | null;
    openDrawer: boolean;
    setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [comments, setComments] = React.useState<
        {
            text: string;
            time: Date;
            user: string;
        }[]
    >([
        {
            text: "This is a sample comment",
            time: new Date(),
            user: "A",
        },
        {
            text: "This is another sample comment",
            time: new Date(Date.now() + 10000),
            user: "B",
        },
    ]);
    return (
        <Drawer
            anchor="right"
            open={openDrawer}
            sx={{
                width: window.innerWidth > 600 ? "50%" : "100%",
            }}
            PaperProps={{
                sx: {
                    width: window.innerWidth > 600 ? "50%" : "100%",
                    backgroundColor: "rgb(16,32,64)",
                },
            }}
            onClose={() => setOpenDrawer(false)}
            className="drawer"
        >
            <Box
                sx={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    gap: "16px",
                    backgroundColor: "rgb(8,16,32)",
                }}
                className="drawer"
            >
                <Paper elevation={3} className="p">
                    <div className="headings">
                        <div className="title">{taskSelected?.name}</div>
                        <div
                            className="status"
                            style={{
                                backgroundColor:
                                    taskSelected?.status === "TODO"
                                        ? "red"
                                        : taskSelected?.status === "PROGRESS"
                                        ? "#FF9900"
                                        : "green",
                            }}
                        >
                            {taskSelected?.status}
                        </div>
                    </div>
                    <div className="description">
                        {taskSelected?.description}
                    </div>
                    <div className="due">
                        <b>Due:</b>{" "}
                        {new Date(taskSelected?.due).toLocaleString()}
                    </div>
                    <div className="assignedTo">
                        <b>Assigned To:</b>:{" "}
                        <Tooltip title={taskSelected?.assignedTo} arrow>
                            <Avatar sx={{ bgcolor: "red" }}>
                                {taskSelected?.assignedTo}
                            </Avatar>
                        </Tooltip>
                    </div>
                </Paper>
                <Divider
                    variant="fullWidth"
                    sx={{
                        background: "rgb(16,32,64)",
                        height: "2px",
                        width: "100%",
                    }}
                />
                {/* <Paper elevation={3} className="p">
                    <div className="headings">
                        <div className="title">Comments</div>
                    </div>
                    <div className="comments">
                        {comments.map((comment) => {
                            return (
                                <Comment
                                    text={comment.text}
                                    user={comment.user}
                                    time={comment.time}
                                />
                            );
                        })}
                    </div>
                </Paper> */}
            </Box>
        </Drawer>
    );
}

function Comment({
    text,
    time,
    user,
}: {
    text: string;
    time: Date;
    user: string;
}) {
    return (
        <div className="comment">
            <div className="headings">
                <div className="user">
                    <Avatar sx={{ bgcolor: "red" }}>{user}</Avatar>
                    <div className="title">{user}</div>
                </div>
                <div className="time">{getRelativeTime(time, new Date())}</div>
            </div>
            <div className="text">{text}</div>
        </div>
    );
}

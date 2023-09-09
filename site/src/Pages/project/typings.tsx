export type Task = {
    name: string;
    status: "TODO" | "PROGRESS" | "COMPLETED";
    assignedTo: string;
    description: string;
    due: Date;
};
import Status from "./Status.ts";
import Task from "./Task.ts";

type Column = {
    status: Status;
    tasks: Task[];
    totalPoints: number;
};


export default Column

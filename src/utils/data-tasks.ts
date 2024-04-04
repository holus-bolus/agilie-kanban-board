import Status from "../interfaces/Status.ts";
import {Priority} from "../interfaces/Priority.ts";
import Task from "../interfaces/Task.ts";


export const statuses: Status[] = ['Todo', 'In progress', 'Done'];
export const priorities: Priority[] = ['Low', 'Medium', 'High'];

let tasks: Task[] = [

];

export default tasks;

export function updateTasks(newTasks: Task[] | Task) {
    if (Array.isArray(newTasks)) {
        tasks.push(...newTasks);
    } else {
        tasks.push(newTasks);
    }
}


export function getTasks() {
    return tasks;
}

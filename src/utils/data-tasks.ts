import Status from "../interfaces/Status.ts";
import {Priority} from "../interfaces/Priority.ts";
import Task from "../interfaces/Task.ts";


export const statuses: Status[] = ['Todo', 'In progress', 'Done'];
export const priorities: Priority[] = ['Low', 'Medium', 'High'];

let tasks: Task[] = [
    {
        title: 'First task',
        id: '1',
        points: 5,
        priority: priorities[2],
        status: statuses[0],
    },
    {
        title: 'Fourth task',
        id: '3',
        points: 5,
        priority: priorities[2],
        status: statuses[0],
    },
    {
        title: 'Second task',
        id: '2',
        points: 8,
        priority: priorities[1],
        status: statuses[1],
    },
    {
        title: 'Third task',
        id: '3',
        points: 3,
        priority: priorities[0],
        status: statuses[2],
    },
];

export default tasks;

export function updateTasks(newTask: Task) {
    tasks.push(newTask);
}

export function getTasks() {
    return tasks;
}


import { Priority } from './Priority';

interface Task {
    title: string;
    id: string;
    points: number;
    priority: Priority;
    status: string;
}

export default Task;

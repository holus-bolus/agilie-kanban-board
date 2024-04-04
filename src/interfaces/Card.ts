import {Priority} from "./Priority.ts";

interface CardProps {
    title: string;
    id: string | number;
    points: number;
    className?: string;
    priority: Priority
    onPointChange: (taskId: string | number, newPoints: number) => void;
}

export default CardProps;

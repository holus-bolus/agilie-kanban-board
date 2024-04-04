import {Priority} from "./Priority.ts";

interface AddTaskFormProps {
    onSubmit: (newTask: { title: string; points: number; priority: Priority; status: string; }) => void;
}


export default AddTaskFormProps

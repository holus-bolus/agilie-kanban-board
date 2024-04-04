import Column from "./Columns.ts";

interface TaskColumnsProps {
    columns: Column[];
    onPointChange: (taskId: string | number, newPoints: number) => void;
    handleDragEnd: (result: any) => void;
    handleAddTask: (result: any) => void;
}
export default TaskColumnsProps

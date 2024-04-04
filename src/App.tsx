import { useState, useEffect } from 'react';
import Card from './components/Card/Card';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { statuses, getTasks, updateTasks } from './utils/data-tasks.ts';
import Column from "./interfaces/Columns.ts";
import AddTaskForm from "./components/AddTaskForm/AddTaskForm.tsx";
import { v4 as uuidv4 } from 'uuid';
import Task from "./interfaces/Task.ts";
import {Priority} from "./interfaces/Priority.ts";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function App() {
    const [columns, setColumns] = useState<Column[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    useEffect(() => {
        const initialColumns = statuses.map((status) => {
            const tasksInColumn = tasks.filter((task) => task.status === status);
            const totalPoints = tasksInColumn.reduce((acc, task) => acc + task.points, 0);
            return {
                status,
                tasks: tasksInColumn,
                totalPoints,
            };
        });
        setColumns(initialColumns);
    }, []);

    useEffect(() => {
        const updatedTasks = getTasks();
        setTasks(updatedTasks);
        const initialColumns = statuses.map((status) => {
            const tasksInColumn = updatedTasks.filter((task) => task.status === status);
            const totalPoints = tasksInColumn.reduce((acc, task) => acc + task.points, 0);
            return {
                status,
                tasks: tasksInColumn,
                totalPoints,
            };
        });
        setColumns(initialColumns);
    }, [tasks]);

    const handlePointChange = (taskId: string | number, newPoints: number) => {
        setColumns(prevColumns => {
            const updatedColumns = prevColumns.map((column) => {
                const updatedTasks = column.tasks.map((task) => {
                    if (task.id === taskId) {
                        return { ...task, points: newPoints };
                    }
                    return task;
                });
                const totalPoints = updatedTasks.reduce((acc, task) => acc + task.points, 0);
                return {
                    ...column,
                    tasks: updatedTasks,
                    totalPoints,
                };
            });
            return updatedColumns;
        });
    };

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleAddTask = (newTask: { title: string; points: number; priority: Priority; status: string; }) => {
        const taskWithId = {
            ...newTask,
            id: uuidv4()
        };
        updateTasks(taskWithId);

        const updatedColumns = statuses.map((status) => {
            const tasksInColumn = getTasks().filter((task) => task.status === status);
            const totalPoints = tasksInColumn.reduce((acc, task) => acc + task.points, 0);
            return {
                status,
                tasks: tasksInColumn,
                totalPoints,
            };
        });
        setColumns(updatedColumns);

        setShowModal(false);
    };

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;
        const { source, destination } = result;
        if (source.droppableId === destination.droppableId) {

            const column = columns.find(col => col.status === source.droppableId);
            if (column) {
                const updatedTasks = Array.from(column.tasks);
                const [removed] = updatedTasks.splice(source.index, 1);
                updatedTasks.splice(destination.index, 0, removed);
                const updatedColumns = columns.map(col => {
                    if (col.status === source.droppableId) {
                        return { ...col, tasks: updatedTasks };
                    }
                    return col;
                });
                setColumns(updatedColumns);
            }
        } else {

            const sourceColumn = columns.find(col => col.status === source.droppableId);
            const destinationColumn = columns.find(col => col.status === destination.droppableId);
            if (sourceColumn && destinationColumn) {
                const sourceTasks = Array.from(sourceColumn.tasks);
                const destinationTasks = Array.from(destinationColumn.tasks);
                const [movedTask] = sourceTasks.splice(source.index, 1);
                destinationTasks.splice(destination.index, 0, movedTask);
                const updatedSourceColumn = { ...sourceColumn, tasks: sourceTasks };
                const updatedDestinationColumn = { ...destinationColumn, tasks: destinationTasks };
                const updatedColumns = columns.map(col => {
                    if (col.status === source.droppableId) {
                        return updatedSourceColumn;
                    }
                    if (col.status === destination.droppableId) {
                        return updatedDestinationColumn;
                    }
                    return col;
                });
                setColumns(updatedColumns);
            }
        }
    };



    return (
        <Container>
            <Row>
                <DragDropContext onDragEnd={handleDragEnd}>
                    {columns.map((column) => (
                        <Col key={column.status}>
                            <h2>{column.status} tasks</h2>
                            <Droppable droppableId={column.status}>
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps}>
                                        {column.tasks.map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <Card
                                                            id={task.id}
                                                            title={task.title}
                                                            points={task.points}
                                                            priority={task.priority}
                                                            onPointChange={handlePointChange}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </Col>
                    ))}
                </DragDropContext>
            </Row>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddTaskForm onSubmit={handleAddTask} />
                </Modal.Body>
            </Modal>
            <Button onClick={handleShowModal}>Add Task</Button>
        </Container>
    );
}

export default App;

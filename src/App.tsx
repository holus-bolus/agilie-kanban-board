import { useState, useEffect } from 'react';
import Card from './components/Card/Card';
import { Container, Row, Col, Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { statuses, tasks } from './utils/data-tasks.ts';
import Column from "./interfaces/Columns.ts";
import AddTaskForm from "./components/AddTaskForm/AddTaskForm.tsx";
import { v4 as uuidv4 } from 'uuid';
import {Priority} from "./interfaces/Priority.ts";
function App() {
    const [columns, setColumns] = useState<Column[]>([]);
    const [showModal, setShowModal] = useState(false);

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

    const handlePointChange = (taskId: string | number, newPoints: number) => {
        setColumns(prevColumns => {
            const updatedColumns = prevColumns.map((column) => {
                const updatedTasks = column.tasks.map((task) => {
                    if (task.id === taskId) {
                        return {...task, points: newPoints};
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
        tasks.push(taskWithId);
        setShowModal(false);
    };



    return (
        <Container>
            <Row>
                {columns.map((column) => (
                    <Col key={column.status}>
                        <h2>{column.status} tasks</h2>
                        <div className="d-flex justify-content-between align-items-center bg-light p-3">
                            <span>Total Points: {column.totalPoints}</span>
                            <div>
                                {column.tasks.map((task) => (
                                    <Card
                                        id={task.id}
                                        title={task.title}
                                        key={task.id}
                                        points={task.points}
                                        priority={task.priority}
                                        onPointChange={handlePointChange}
                                    />
                                ))}
                            </div>
                        </div>
                    </Col>
                ))}
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

import React, {useState, useEffect} from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {statuses} from './utils/data-tasks.ts';
import Column from "./interfaces/Columns.ts";
import {v4 as uuidv4} from 'uuid';
import {Priority} from "./interfaces/Priority.ts";
import AddTaskModal from "./components/AddTaskModal/AddTaskModal.tsx";
import InputForm from "./components/InputForm/Inputform.tsx";
import TaskColumns from "./components/TaskColumns/TaskColumns.tsx";
import OwnerLinks from "./components/OwnerLinks/OwnerLinks.tsx";
import {DropResult} from "react-beautiful-dnd";


function App() {
    const [columns, setColumns] = useState<Column[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [repoUrl, setRepoUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const owner = repoUrl.split('/')[0];
    const [error, setError] = useState<string | null>(null);

    const handleDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
            return;
        }

        const startColumnIndex = columns.findIndex(column => column.status === source.droppableId);
        const finishColumnIndex = columns.findIndex(column => column.status === destination.droppableId);
        const updatedColumns = [...columns];

        if (startColumnIndex === finishColumnIndex) {
            const column = updatedColumns[startColumnIndex];
            const newTasks = Array.from(column.tasks);
            newTasks.splice(source.index, 1);
            const taskToMove = column.tasks.find(task => task.id === draggableId);
            if (taskToMove) {
                newTasks.splice(destination.index, 0, taskToMove);
                updatedColumns[startColumnIndex] = { ...column, tasks: newTasks };
            }
        } else {
            const startColumn = updatedColumns[startColumnIndex];
            const finishColumn = updatedColumns[finishColumnIndex];
            const startTasks = Array.from(startColumn.tasks);
            const finishTasks = Array.from(finishColumn.tasks);
            const [removed] = startTasks.splice(source.index, 1);
            finishTasks.splice(destination.index, 0, removed);
            updatedColumns[startColumnIndex] = { ...startColumn, tasks: startTasks };
            updatedColumns[finishColumnIndex] = { ...finishColumn, tasks: finishTasks };
        }

        setColumns(updatedColumns);
    };


    const handlePointChange = (taskId: string | number, newPoints: number) => {
        const updatedColumns = columns.map(column => {
            const updatedTasks = column.tasks.map(task => {
                if (task.id === taskId) {
                    return { ...task, points: newPoints };
                }
                return task;
            });
            return { ...column, tasks: updatedTasks };
        });
        setColumns(updatedColumns);
    };

    const updateTasksForRepo = (tasks: any[], repoUrl: string) => {
        const repoTasksKey = `${repoUrl}_tasks`;
        localStorage.setItem(repoTasksKey, JSON.stringify(tasks));
    };

    const getTasksForRepo = (repoUrl: string) => {
        if (!repoUrl) return [];
        const repoTasksKey = `${repoUrl}_tasks`;
        const tasksJson = localStorage.getItem(repoTasksKey);
        return tasksJson ? JSON.parse(tasksJson) : [];
    };

    const handleLoadColumns = async (url: string) => {
        if (!url) {
            setError('Repository URL is empty');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const locallyStoredTasks = getTasksForRepo(url);

            if (locallyStoredTasks.length > 0) {
                const updatedColumns = statuses.map((status) => {
                    const tasksInColumn = locallyStoredTasks.filter((task: { status: string; }) => task.status === status);
                    const totalPoints = tasksInColumn.reduce((acc: any, task: { points: any; }) => acc + task.points, 0);
                    return {
                        status,
                        tasks: tasksInColumn,
                        totalPoints,
                    };
                });

                setColumns(updatedColumns);
            } else {
                console.log('No locally stored tasks found for repository:', url);
                setColumns([]);
            }
        } catch (error: any) {
            console.error('Failed to load issues:', error);
            setError(error.message);
            setColumns([]);
        }

        setLoading(false);
    };

    const handleAddTask = (newTask: { title: string; points: number; priority: Priority; status: string; }) => {
        if (!repoUrl) {
            setError('Repository URL is empty');
            return;
        }

        const taskWithId = {
            ...newTask,
            id: uuidv4()
        };
        const updatedTasks = [...getTasksForRepo(repoUrl), taskWithId];
        updateTasksForRepo(updatedTasks, repoUrl);
        const updatedColumns = statuses.map((status) => {
            const tasksInColumn = updatedTasks.filter((task) => task.status === status);
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

    const handleRepoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRepoUrl(e.target.value);
        if (!e.target.value) {
            setColumns([]);
            // Clear tasks from localStorage when input is cleared
            localStorage.removeItem(`${repoUrl}_tasks`);
        }
    };

    useEffect(() => {
        const lastRepoUrl = localStorage.getItem('lastRepoUrl');
        if (lastRepoUrl) {
            handleLoadColumns(lastRepoUrl);
        }
    }, []);

    useEffect(() => {
        if (repoUrl) {
            localStorage.setItem('lastRepoUrl', repoUrl);
        }
    }, [repoUrl]);

    return (
        <Container>
            <Row>
                <Col>
                    <InputForm
                        repoUrl={repoUrl}
                        loading={loading}
                        handleRepoUrlChange={handleRepoUrlChange}
                        handleLoadIssues={() => handleLoadColumns(repoUrl)}
                    />
                </Col>
                <Col>
                    <OwnerLinks owner={owner} repoUrl={repoUrl}/>
                </Col>
            </Row>
            {error && <p>Error: {error}</p>}

            <Row>
                <Col>
                    <TaskColumns
                        columns={columns}
                        handleAddTask={handleAddTask}
                        handleDragEnd={handleDragEnd}
                        onPointChange={handlePointChange}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button onClick={() => setShowModal(true)}>Add Task</Button>
                </Col>
            </Row>
            <AddTaskModal
                showModal={showModal}
                handleCloseModal={() => setShowModal(false)}
                handleAddTask={handleAddTask}
            />
        </Container>
    );
}

export default App;


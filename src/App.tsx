import React, {useState, useEffect} from 'react';
import {Container, Row, Col, Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {statuses, getTasks} from './utils/data-tasks.ts';
import Column from "./interfaces/Columns.ts";
import {v4 as uuidv4} from 'uuid';
import {Priority} from "./interfaces/Priority.ts";
import AddTaskModal from "./components/AddTaskModal/AddTaskModal.tsx";
import InputForm from "./components/InputForm/Inputform.tsx";
import TaskColumns from "./components/TaskColumns/TaskColumns.tsx";
import OwnerLinks from "./components/OwnerLinks/OwnerLinks.tsx";

function App() {
    const [columns, setColumns] = useState<Column[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [repoUrl, setRepoUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const owner = repoUrl.split('/')[3];
    const [error, setError] = useState<string | null>(null);

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





    const handleLoadColumns = async () => {
        if (!repoUrl) {
            setError('Repository URL is empty');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://api.github.com/repos/${repoUrl}/issues`);
            if (!response.ok) {
                throw new Error('Failed to fetch issues');
            }
            const fetchedTasks = await response.json();
            updateTasksForRepo(fetchedTasks, repoUrl);
            const updatedColumns = statuses.map((status) => {
                const tasksInColumn = getTasksForRepo(repoUrl).filter((task: { status: string; }) => task.status === status);
                const totalPoints = tasksInColumn.reduce((acc: any, task: { points: any; }) => acc + task.points, 0);
                return {
                    status,
                    tasks: tasksInColumn,
                    totalPoints,
                };
            });
            setColumns(updatedColumns);
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
        const repoTasksKey = `${repoUrl}_tasks`;
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

        localStorage.setItem(repoTasksKey, JSON.stringify(updatedTasks));
    };

    const handleRepoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRepoUrl(e.target.value);
        setColumns([]);
    };

    useEffect(() => {
        const storedColumns = localStorage.getItem('columnPositions');
        if (storedColumns) {
            setColumns(JSON.parse(storedColumns));
        } else {
            const defaultColumns = statuses.map((status) => ({
                status,
                tasks: [],
                totalPoints: 0
            }));
            setColumns(defaultColumns);
        }
    }, []);

    useEffect(() => {
        const updatedTasks = getTasks();
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
    }, []);

    useEffect(() => {
        const storedColumns = localStorage.getItem('columnPositions');
        if (storedColumns) {
            setColumns(JSON.parse(storedColumns));
        } else {
            const defaultColumns = statuses.map((status) => ({
                status,
                tasks: [],
                totalPoints: 0
            }));
            setColumns(defaultColumns);
        }
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


    const handleDragEnd = (result: any) => {
        if (!result.destination) return;
        const {source, destination} = result;
        const updatedColumns = [...columns];

        if (source.droppableId === destination.droppableId) {

            const sourceColumnIndex = updatedColumns.findIndex(col => col.status === source.droppableId);
            const updatedTasks = Array.from(updatedColumns[sourceColumnIndex].tasks);
            const [removed] = updatedTasks.splice(source.index, 1);
            updatedTasks.splice(destination.index, 0, removed);
            updatedColumns[sourceColumnIndex].tasks = updatedTasks;
        } else {

            const sourceColumnIndex = updatedColumns.findIndex(col => col.status === source.droppableId);
            const destinationColumnIndex = updatedColumns.findIndex(col => col.status === destination.droppableId);
            const [movedTask] = updatedColumns[sourceColumnIndex].tasks.splice(source.index, 1);
            updatedColumns[destinationColumnIndex].tasks.splice(destination.index, 0, movedTask);
        }

        setColumns(updatedColumns);
        localStorage.setItem('columnPositions', JSON.stringify(updatedColumns));
    };

    return (
        <Container>
            <Row>
                <Col>
                    <InputForm
                        repoUrl={repoUrl}
                        loading={loading}
                        handleRepoUrlChange={handleRepoUrlChange}
                        handleLoadIssues={handleLoadColumns}
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
                        handlePointChange={handlePointChange}
                        handleDragEnd={handleDragEnd}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button onClick={handleShowModal}>Add Task</Button>
                </Col>
            </Row>
            <AddTaskModal
                showModal={showModal}
                handleCloseModal={handleCloseModal}
                handleAddTask={handleAddTask}
            />
        </Container>
    );

}

export default App;

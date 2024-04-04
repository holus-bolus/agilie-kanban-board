import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import AddTaskFormProps from "../../interfaces/AddTaskFormProps.ts";
import Task from "../../interfaces/Task.ts";
import { v4 as uuidv4 } from 'uuid';
import {Priority} from "../../interfaces/Priority.ts";
const AddTaskForm:React.FC<AddTaskFormProps>  = ({ onSubmit }) => {
    const [title, setTitle] = useState('');
    const [points, setPoints] = useState('');
    const [priority, setPriority] = useState<Priority>('Low');
    const [status, setStatus] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newTask: Task = {
            id: uuidv4(),
            title,
            points: parseInt(points),
            priority,
            status
        };
        onSubmit(newTask);
        setTitle('');
        setPoints('');
        setPriority('Low');
        setStatus('');
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="points">
                <Form.Label>Points</Form.Label>
                <Form.Control type="number" value={points} onChange={(e) => setPoints(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="priority">
                <Form.Label>Priority</Form.Label>
                <Form.Control as="select" value={priority} onChange={(e) => setPriority(e.target.value as Priority)} required>
                    <option value="">Select Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="status">
                <Form.Label>Status</Form.Label>
                <Form.Control as="select" value={status} onChange={(e) => setStatus(e.target.value)} required>
                    <option value="">Select Status</option>
                    <option value="Todo">Todo</option>
                    <option value="In progress">In Progress</option>
                    <option value="Done">Done</option>
                </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">Add Task</Button>
        </Form>
    );
};

export default AddTaskForm;

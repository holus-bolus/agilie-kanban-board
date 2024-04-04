import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import AddTaskFormProps from "../../interfaces/AddTaskFormProps.ts";
import Task from "../../interfaces/Task.ts";
import { v4 as uuidv4 } from 'uuid';
import { Priority } from "../../interfaces/Priority.ts";

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onSubmit }) => {
    const [title, setTitle] = useState('');
    const [points, setPoints] = useState('');
    const [priority, setPriority] = useState<Priority>('Low');
    const [status, setStatus] = useState('');
    const [formErrors, setFormErrors] = useState({
        title: '',
        points: '',
        priority: '',
        status: ''
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
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
        }
    };

    const validateForm = () => {
        let valid = true;
        const errors = {
            title: '',
            points: '',
            priority: '',
            status: ''
        };

        if (!title) {
            errors.title = 'Title is required';
            valid = false;
        }

        if (!points) {
            errors.points = 'Points is required';
            valid = false;
        } else if (isNaN(parseInt(points)) || parseInt(points) <= 0) {
            errors.points = 'Points must be a positive number';
            valid = false;
        }

        if (!priority) {
            errors.priority = 'Priority is required';
            valid = false;
        }

        if (!status) {
            errors.status = 'Status is required';
            valid = false;
        }

        setFormErrors(errors);
        return valid;
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <Form.Text className="text-danger">{formErrors.title}</Form.Text>
            </Form.Group>
            <Form.Group controlId="points">
                <Form.Label>Points</Form.Label>
                <Form.Control type="number" value={points} onChange={(e) => setPoints(e.target.value)} required />
                <Form.Text className="text-danger">{formErrors.points}</Form.Text>
            </Form.Group>
            <Form.Group controlId="priority">
                <Form.Label>Priority</Form.Label>
                <Form.Control as="select" value={priority} onChange={(e) => setPriority(e.target.value as Priority)} required>
                    <option value="">Select Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </Form.Control>
                <Form.Text className="text-danger">{formErrors.priority}</Form.Text>
            </Form.Group>
            <Form.Group controlId="status">
                <Form.Label>Status</Form.Label>
                <Form.Control as="select" value={status} onChange={(e) => setStatus(e.target.value)} required>
                    <option value="">Select Status</option>
                    <option value="Todo">Todo</option>
                    <option value="In progress">In Progress</option>
                    <option value="Done">Done</option>
                </Form.Control>
                <Form.Text className="text-danger">{formErrors.status}</Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">Add Task</Button>
        </Form>
    );
};

export default AddTaskForm;

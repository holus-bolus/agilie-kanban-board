
import React from 'react';
import { Modal } from 'react-bootstrap';
import AddTaskForm from "../AddTaskForm/AddTaskForm.tsx";
import {Priority} from "../../interfaces/Priority.ts";


interface AddTaskModalProps {
    showModal: boolean;
    handleCloseModal: () => void;
    handleAddTask: (newTask: { title: string; points: number; priority: Priority; status: string; }) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ showModal, handleCloseModal, handleAddTask }) => {
    return (
        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <AddTaskForm onSubmit={handleAddTask} />
            </Modal.Body>
        </Modal>
    );
};

export default AddTaskModal;

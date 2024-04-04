import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Card from "../Card/Card.tsx";
import { Row, Col } from 'react-bootstrap';
import TaskColumnsProps from "../../interfaces/TaskColumn.ts";



const TaskColumns: React.FC<TaskColumnsProps> = ({ columns, onPointChange, handleDragEnd }) => {
    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Row>
                {columns.map((column, columnIndex) => (
                    <Col key={column.status}>
                        <div>
                            <h2>{column.status} tasks</h2>
                            <Droppable droppableId={column.status} key={columnIndex}>
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
                                                            onPointChange={onPointChange}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    </Col>
                ))}
            </Row>
        </DragDropContext>
    );
};

export default TaskColumns;

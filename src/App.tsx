import Card from './components/Card/Card';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { statuses, tasks } from './utils/data-tasks.ts';

function App() {
    const columns = statuses.map((status) => {
        const tasksInColumn = tasks.filter((task) => task.status === status);
        return {
            status,
            tasks: tasksInColumn,
        };
    });

    return (
        <Container>
            <Row>
                {columns.map((column) => (
                    <Col key={column.status}>
                        <h2>{column.status} tasks</h2>
                        <div className="bg-light p-3">
                            {column.tasks.map((task) => (
                                <Card
                                    id={task.id}
                                    title={task.title}
                                    key={task.id}
                                    points={task.points}
                                />
                            ))}
                        </div>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default App;

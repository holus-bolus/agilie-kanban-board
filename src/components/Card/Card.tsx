import CardProps from '../../interfaces/Card';
import { Card as BootstrapCard, Button } from 'react-bootstrap';
import './Card.css';

const Card = ({ title, id, points, priority, onPointChange }: CardProps) => {
    const minPoints = 0;
    const maxPoints = 10;

    const handleIncrement = () => {
        if (points < maxPoints) {
            onPointChange(id, points + 1);
        }
    };

    const handleDecrement = () => {
        if (points > minPoints) {
            onPointChange(id, points - 1);
        }
    };

    return (
        <BootstrapCard className="my-3 p-3 card-hover">
            <div className="card-title">{title}</div>
            <div className="card-info">Priority: {priority}</div>
            <div className="card-info">ID: {id}</div>
            <div className="card-info">Points: {points}</div>
            <div className="button-container">
                <Button variant="primary" size="sm" onClick={handleIncrement}>+</Button>
                <Button variant="primary" size="sm" onClick={handleDecrement}>-</Button>
            </div>
        </BootstrapCard>
    );
};

export default Card;

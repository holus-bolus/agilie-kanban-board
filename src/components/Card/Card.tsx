
import CardProps from '../../interfaces/Card';
import { Card as BootstrapCard } from 'react-bootstrap';
import './Card.css';


const Card = ({ title, id, points, priority, onPointChange }: CardProps) => {
    const minPoints = 0;
    const maxPoints = 10; // Maximum allowed points

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
            <div>{title}</div>
            <div>Priority: {priority}</div>
            <div>{id}</div>
            <div>{points}</div>
            <button onClick={handleIncrement}>+</button>
            <button onClick={handleDecrement}>-</button>
        </BootstrapCard>
    );
};

export default Card;

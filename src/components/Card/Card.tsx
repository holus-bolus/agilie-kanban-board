import CardProps from '../../interfaces/Card';
import {Card as BootstrapCard} from 'react-bootstrap';
import './Card.css'

const Card = ({title, id, points, ...rest}: CardProps) => {
    return (
        <BootstrapCard {...rest} className="my-3 p-3 card-hover">
            <div>{title}</div>
            <div>{id}</div>
            <div>{points}</div>
        </BootstrapCard>
    );
};

export default Card;

import CardProps from "../../interfaces/Card.ts";

const Card = ({title, id, points}:CardProps) => {
    return (
        <div>
            <div>{title}</div>
            <div>{id}</div>
            <div>{points}</div>
        </div>);
};

export default Card;

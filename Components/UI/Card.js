
import classes from "./Card.module.css";

const Card = (props) => {
    return (
        <div className="w3-card w3-round w3-white w3-padding w3-center">
            {props.children}
        </div>
    );
}

export default Card;
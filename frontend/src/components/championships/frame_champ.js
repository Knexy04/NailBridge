import React from 'react';
import {Link} from "react-router-dom";

const Champ = (props) => {
    return(
        <div className="champ">
            <Link to={`/${props.year}`}>
                <article>{props.name}</article>
            </Link>
            <img src={`photos/${props.photo}`} alt={`${props.name}`} draggable="false" className="champpic"/>
        </div>
    )
}

export default Champ;
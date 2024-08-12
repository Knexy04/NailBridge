import React, {useState} from "react";

function Judges(props) {

    const judge = props.judge

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const isMobileView = window.innerWidth < 1440;


    return (
                <div
                    className="judge_count"
                    id={judge.name}
                >
                    <img className="judgepic" src={`photos/${judge.photo}`} draggable={"false"}/>
                    <div className="imagetext_judge">
                        <article>{judge.name}</article>
                        <ul>
                            {judge.text.map((obj) => (
                                <li>{obj}</li>
                            ))}
                        </ul>
                    </div>
                </div>
    )
                            
}
            

export default Judges;
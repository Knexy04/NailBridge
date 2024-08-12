import React from "react";
function List_person(props) {
    const person = props.persons
    return (
        <>
        {person.map((obj, index) => (
                <li className="person_info_judge">
                    <a onClick={props.onClick_function} href={`/judge/judge_review/${obj._id}`}>№ {obj.Nomination[0].number}{obj.Participant[0].category.charAt(0)}_{obj._id.slice(-4)}</a>
                </li>
            ))}
        </>
    )
  }
  
  export default List_person;
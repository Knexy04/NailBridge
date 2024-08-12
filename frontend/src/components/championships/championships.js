import React from 'react';
import Champ from './frame_champ'

const Championships = () => {
    const file = [
        {
            name: "Чемпионат 2016",
            photo: "a.jpg",
            year: "2016"
        },
        {
            name: "Чемпионат 2017",
            photo: "a.jpg",
            year: "2017"
        },
        {
            name: "Чемпионат 2018",
            photo: "a.jpg",
            year: "2018"
        },
        {
            name: "Чемпионат 2019",
            photo: "a.jpg",
            year: "2019"
        },
    ]
    return (    
        <div className='championships'>
            <title>Чемпионаты</title>

            <article>Прошлые чемпионаты</article>
            <div className="lastchamps">
                {file.map((obj) => (
                    <Champ name={obj.name} year={obj.year} photo={obj.photo}/>
                ))}
            </div>
        </div>
    )
}

export default Championships;
import {React, useEffect, useState} from 'react';
import Organisators from './organisators'
import {Link} from 'react-router-dom'
import CarouselJudge from './carousel_judge';
import axios from "../../axios"
import CheckAuth from "../errors/checkAuth";

const Content = () => {
    const [reglaments, setReglaments] = useState([]);
    const [championship, setChampionship] = useState([]);
    const [judges, setJudges] = useState([]);
    const [flag, setFlag] = useState(false)


    useEffect(() => {
        axios.get('/reglament')
            .then(response => {
                if (response.data.length===0){
                    setFlag(true)
                }
                setReglaments(response.data);
            })
            .catch(error => {
                console.error('Ошибка при получении JSON файла', error);
            });
        axios.get('/championship')
            .then(response => {
                if (response.data.length===0){
                    setFlag(true)
                }
                setChampionship(response.data);
            })
            .catch(error => {
                console.error('Ошибка при получении JSON файла', error);
            });
        axios.get('/judgesnow')
            .then(response => {
                if (response.data.length===0){
                    setFlag(true)
                }
                setJudges(response.data);
            })
            .catch(error => {
                console.error('Ошибка при получении JSON файла', error);
            });
    }, [])

    if ((judges.length === 0 || championship.length === 0 || reglaments.length === 0) && (flag === false)){
        return <CheckAuth/>
    }


    const orgs = [
        {
            id: "1",
            name: "SAVELYEVA ELENA",
            photo: "elena.jpg",
            text: ["Мастер международного класса с 2003 г", "Учредитель Международной ассоциации BEAUTY OLYMP", "Член состава директоров Международной Европейской ассоциации IJUA", "Сертифицированный судья", "Международный инструктор", "Разработчик авторских техник по дизайну и моделированию ногтей", "Тренер международной сборной по моделированию, дизайну ногтей и подготовки к nail-чемпионатам.", "Спикер форумов по ногтевому сервису"]
        },

        {
            id: "2",
            name: "LANTRATOVA INNA",
            photo: "inna.jpg",
            text: ["Судья международного судейского комитета входящей в десятку лучших тор судей России «JUDGETOP10» 2011- 2015 г.", "Тренер сборной команды KorNail — победителей Чемпионата Мира по моделированию ногтей 2012 г. (Дюссельдорф)", "Действительный судья Международной Школы Ногтевых Экспертов (International Nail Experts’ School (INES).", "Судья Международных Чемпионатов Кореи, Израиля, Италии,"]
        },
    ]
    return (
        <div className={"content"}>

            <title>NailBridge</title>
            <div className={"startpage"}>
                {championship.map(el => (
                    <div>
                        <article>{el.title}</article>
                        <h1>{el.description}</h1>
                    </div>
                ))}
            </div>
            <div className={"regist"}>
                <Link to="/registration" draggable={"false"} className={"reg"}>
                    <p>Участвовать</p>
                    <svg width="24" height="24" className="regsvg" fill="none" stroke="currentColor"
                         strokeLinecap="round"
                         strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"
                         xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="m11 16-4-4m0 0 4-4m-4 4h14m-5 4v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3v1"></path>
                    </svg>
                </Link>
            </div>
            <div className="reglament">
                {reglaments.map(reglament => (
                    <a href={`${reglament.link}`} draggable={false} className="regl"
                       rel="noreferrer" target="_blank">{reglament.name}</a>
                ))}
            </div>
            <div className="reglament">
                <Link to="judgeschool" draggable={"false"} className={'regl'}>Школа судей</Link>
                <Link to="#" draggable={"false"} className={'regl'}>Участие в марафоне</Link>
                <Link to="judgereg" draggable={"false"} className={'regl'}>Стать судьей</Link>
            </div>
            <article>Организаторы</article>
            <Organisators orgs={orgs} lenght={judges.length}/>

            {judges.length!==0?(
                <>
                    <article>Судьи</article>
                    <CarouselJudge judges={judges}/>
                </>

            ):(
                <div style={judges.length===0 ? {marginBottom: "80px"} : {}}></div>
            )}
        </div>
    )
}

export default Content;

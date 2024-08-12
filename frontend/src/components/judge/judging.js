import React, {useState, useEffect} from "react";
import ReturnName from "./ReturnName";
import Range1 from "./range_1";
import {useParams} from "react-router-dom";
import axios from "../../axios";
// eslint-disable-next-line
import {format} from "date-fns";
import CheckAuth from "../errors/checkAuth";


const Judge = (props) => {
    const {id} = useParams();
    const [activeTab, setActiveTab] = useState(0);
    const [activeStep, setActiveStep] = useState(0);
    const [isButtonAnimating, setIsButtonAnimating] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [textGrade, setTextGrade] = useState("");

    const [tabAnimation, setTabAnimation] = useState("fade-in");

    const [time, setTime] = useState([]);
    const [championship, setChampionship] = useState([])

    const [results, setResults] = useState(true);

    // eslint-disable-next-line
    const judId = props.idJudge._id


    const person = props.persons.find((item) => item._id === id);
    const name = person.Nomination[0].number + person.Participant[0].category.charAt(0) + "_" + id.slice(-4);
    const categories = person.Nomination[0].criteria;
    let PartNomData = person.linkWork;
    const [values, setValues] = useState({});
    useEffect(() => {
        const lol = {};
        categories.forEach((obj) => {
            lol[obj.title] = '5';
        });
        setValues(lol);
    }, [categories]);

    useEffect(() => {
        setValues({});
    }, [id]);

    useEffect(() => {
        setIsSubmitted(false); // Сбросить состояние isSubmitted при переходе на новую страницу
    }, [id]);

    useEffect(() => {
        axios.get('/championship')
            .then(response => {
                setChampionship(response.data);
            })
            .catch(error => {
                console.error('Ошибка при получении JSON файла', error);
            });
        axios.get('/timeServer')
            .then(response => {
                setTime(response.data);
            })
            .catch(error => {
                console.error('Ошибка при получении JSON файла', error);
            });
    
    }, []);

    const previousTab = () => {
        setTabAnimation("fade-out"); // Установите класс для анимации переключения табов
        setTimeout(() => {
            setActiveTab(activeTab - 1);
            setActiveStep(activeStep - 1);
            setTabAnimation("fade-in"); // Завершите анимацию после переключения
        }, 100); // Завершите анимацию через 300 миллисекунд
    };

    const nextTab = () => {
        setTabAnimation("fade-out"); // Установите класс для анимации переключения табов
        setTimeout(() => {
            setActiveTab(activeTab + 1);
            setActiveStep(activeStep + 1);
            setTabAnimation("fade-in"); // Завершите анимацию после переключения
        }, 100); // Завершите анимацию через 300 миллисекунд
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const fields = {
                work: person,
                // eslint-disable-next-line
                judgeId: judId,
                values: values,
                comment: textGrade,
            };
// eslint-disable-next-line
            const {data} = await axios.post('/grade', fields);
        } catch (err) {
            alert("Ошибка при оценивании");
        }

        setIsSubmitted(true);
    };

    useEffect(() => {
        if (person.judgeId.find((item) => item.id === judId)?.grades?.length !== 0) {
            setResults(false);
        }
    }, [person.judgeId, judId]);


    if (results === false) {
        return <div className="kkff">Вы уже оценили этого участника</div>;
    }
    if (isSubmitted) {
        return <div className="kkff">Успешно отправлено,переходите дальше!</div>;
    }

    const getVisibleCategories = () => {
        const start = activeStep * 3;
        const end = start + 3;
        return categories.slice(start, end);
    };

    const handleRangeChange = (id, value) => {
        setValues((prevValues) => ({...prevValues, [id]: value}));

    };

    const { format } = require('date-fns');

    const currentDate = time.time


    const startOnlineDate = championship?.[0]?.startOnlineJudgeDate
    const endOnlineDate = championship?.[0]?.endOnlineJudgeDate
    const startOfflineDate = championship?.[0]?.startOfflineJudgeDate
    const endOfflineDate = championship?.[0]?.endOfflineJudgeDate

    if (!startOnlineDate || !endOnlineDate || !startOfflineDate || !endOfflineDate) {
        return <CheckAuth/>;
    }

    const formatStartOnlineDate = format(new Date(startOnlineDate), 'dd.MM.yyyy, HH:mm');
    const formatEndOnlineDate = format(new Date(endOnlineDate), 'dd.MM.yyyy, HH:mm');
    const formatStartOfflineDate = format(new Date(startOfflineDate), 'dd.MM.yyyy, HH:mm');
    const formatEndOfflineDate = format(new Date(endOfflineDate), 'dd.MM.yyyy, HH:mm');

    if (((currentDate>startOnlineDate && currentDate<endOnlineDate) && person.Nomination[0].online === "true") || (currentDate>startOfflineDate && currentDate<endOfflineDate && person.Nomination[0].online === "false")){
        return (
            <div className="lklk">
                <div className="div_judge">
                    <div className="top_judge_pc">
                        <div>
                            <div className="mark">Оцените результат</div>
                            <ReturnName name={`№ ${name}`}/>
                            {PartNomData !== "" ? (
                                <div className="photo_model_judge_phone">
                                    <a href={PartNomData} rel="noreferrer" target="_blank"> Ссылка на работу </a>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                    <div className="form_judge">
                        <form method="post" id="1" onSubmit={handleSubmit}>
                            <div className="judge_model">
                                <div>
                                    <div className="top_judge_phone">
                                        <div className="mark">Оцените результат</div>
                                        <ReturnName name={`№${name}`}/>
                                        {PartNomData !== "" ? (
                                            <div className="photo_model_judge_phone">
                                                <a href={PartNomData} rel="noreferrer" target="_blank"> Ссылка на
                                                    работу </a>
                                            </div>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                    <div
                                        className={`range_block_all ${tabAnimation}`}
                                    >
                                        <input type="text" value={id} className="input_none"/>
                                        {getVisibleCategories().map((obj, index) => (
                                            <div key={index}>
                                                <Range1
                                                    statments={obj.criteriaStatement}
                                                    name={obj.title}
                                                    value={values[obj.title] || 5}
                                                    onChange={handleRangeChange}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    {activeTab === Math.ceil(categories.length / 3) - 1 && (
                                        <div className="comment_div">
                                            <textarea onChange={(e) => setTextGrade(e.target.value)}
                                                      placeholder="Напишите комментарий к работе"></textarea>
                                        </div>
                                    )}
                                    <div className="button_access">
                                        {activeTab > 0 && (
                                            <input
                                                type="button"
                                                onClick={() => {
                                                    setIsButtonAnimating(true);
                                                    setTimeout(() => {
                                                        setIsButtonAnimating(false);
                                                        previousTab();
                                                    }, 200); // Завершить анимацию через 300 миллисекунд
                                                }}
                                                value="Назад"
                                                id="pass"
                                                className={isButtonAnimating ? "fade-out" : "fade-in"}
                                            />
                                        )}
                                        {activeTab < Math.ceil(categories.length / 3) - 1 && (
                                            <input
                                                type="button"
                                                onClick={() => {
                                                    setIsButtonAnimating(true);
                                                    setTimeout(() => {
                                                        setIsButtonAnimating(false);
                                                        nextTab();
                                                    }, 200); // Завершить анимацию через 300 миллисекунд
                                                }}
                                                value="Далее"
                                                id="next"
                                                className={isButtonAnimating ? "fade-out" : "fade-in"}
                                            />
                                        )}
                                        {activeTab === Math.ceil(categories.length / 3) - 1 && (
                                            <input
                                                type="submit"
                                                value="Оценить"
                                                id="last"
                                                className={isButtonAnimating ? "fade-out" : "fade-in"}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
    else if (currentDate<startOnlineDate && person.Nomination[0].online === "true"){
            return(
                <div className="lklk">
                    <div className="div_judge">
                        
                                <div className="title_judge">
                                    {`Эту работу можно будет оценить с ${formatStartOnlineDate}`} 
                                </div>
                           
                    </div>
                </div>
            )
        }
        else if (currentDate>endOnlineDate && person.Nomination[0].online === "true"){
            return(
                <div className="lklk">
                    <div className="div_judge">
                        
                                <div className="title_judge">
                                    {`Эту работу можно было оценить до ${formatEndOnlineDate}`} 
                                </div>
                           
                    </div>
                </div>
            )
        }
        else if (currentDate<startOfflineDate && person.Nomination[0].online === "false"){
            return(
                <div className="lklk">
                    <div className="div_judge">
                        
                                <div className="title_judge">
                                    {`Эту работу можно будет оценить с ${formatStartOfflineDate}`} 
                                </div>
                           
                    </div>
                </div>
            )
        }
        else if (currentDate>endOfflineDate && person.Nomination[0].online === "false"){
            return(
                <div className="lklk">
                    <div className="div_judge">
                                <div className="title_judge">
                                    {`Эту работу можно было оценить до ${formatEndOfflineDate}`} 
                                </div>
                    </div>
                </div>
            )
        }
        else{
            return(
                <div className="lklk">
                    <div className="div_judge">
                                <div className="title_judge">
                                   Ошибка
                                </div>
                    </div>
                </div>
            )
        }
    
};

export default Judge;
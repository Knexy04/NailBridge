import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "../../axios";
import module from "./AdminPanel.module.css";
import CheckAuth from "../errors/checkAuth";
import {useSelector} from "react-redux";
import {selectIsAdmin} from "../../redux/slices/auth";

const ParticipantInfo = () => {
    const id = useParams();
    const [participant, setParticipant] = useState();
    const [works, setWorks] = useState([]);
    const navigate = useNavigate();
    const isAdmin = useSelector(selectIsAdmin);
    const [isLoading, setIsLoading] = useState(true);
    const [showForbidden, setShowForbidden] = useState(false);

    useEffect(() => {
        axios
            .get(`/member?id=${id.id}`)
            .then((response) => {
                setParticipant(response.data);
            })
            .catch((error) => {
                console.error("Ошибка при получении JSON файла", error);
            });
    }, [id.id]);
    useEffect(() => {
        axios
            .get(`/getWorksParticipant?id=${id.id}`)
            .then((response) => {
                setWorks(response.data);
            })
            .catch((error) => {
                console.error("Ошибка при получении JSON файла", error);
            });
    }, [id.id]);

    useEffect(() => {
        if (isAdmin !== undefined) {
            setIsLoading(false);
            if (!isAdmin) {
                navigate("/");
            }
        }
    }, [isAdmin, navigate])

    useEffect(() => {
        if (isLoading) {
            const timeoutId = setTimeout(() => {
                setShowForbidden(true);
            }, 5000);
            return () => clearTimeout(timeoutId);
        }
    }, [isLoading]);

    if (isLoading) {
        return showForbidden ? navigate("/") : <CheckAuth/>;
    }

    if (!participant) {
        return <CheckAuth/>
    }
    const nominations = works.map(item => {
        return {
            number: item.Nomination[0].number,
            name: item.Nomination[0].name
        };
    });

    // eslint-disable-next-line
    const uniqueNominations = Array.from(new Set(nominations.map(JSON.stringify))).map(JSON.parse);

    function gradeAll(works) {
        // eslint-disable-next-line
        const work = works;
        let sum = 0;
        for (let i = 0; i < works.length; i++) {
            if (works[i].judgeId && works[i].judgeId.length !== 0) {
                for (let j = 0; j < works[i].judgeId.length; j++) {
                    if (works[i].judgeId[j].grades && works[i].judgeId[j].grades.length !== 0) {
                        for (let z = 0; z < works[i].judgeId[j].grades.length; z++) {
                            sum += parseInt(works[i].judgeId[j].grades[z].grade)
                        }
                    }
                }
            }
        }
        return sum
    }

    function totalGradeAll(array) {
        const judges = array;
        let sum = 0;
        try {
            if (judges.length !== 0) {
                for (let j = 0; j < judges.length; j++) {
                    if (judges[j].grades && judges[j].grades.length !== 0) {
                        for (let i = 0; i < judges[j].grades.length; i++) {
                            sum += parseInt(judges[j].grades[i].grade);
                        }
                    }
                }
            }
            return sum;
        } catch (err) {
            return 0
        }
    }


    function countUniqueOnlineNominations(array) {
        const nominationsCount = array.reduce((count, obj) => {
            if (obj.Nomination[0].online === "true") {
                count[obj.Nomination[0].name] = (count[obj.Nomination[0].name] || 0) + 1;
            }
            return count;
        }, {});

        const uniqueOfflineNominations = Object.keys(nominationsCount).filter(
            (nomination) => nominationsCount[nomination] > 0
        );

        return uniqueOfflineNominations.length;
    }

    function calculateTotalPoints(json) {
        let totalPoints = 0;
        json.forEach((obj) => {
            if (obj.Nomination[0].online === "true" && obj.judgeId.length!==0) {
                obj.judgeId.forEach((judge) => {
                    judge?.grades?.forEach((gradee) => {
                        totalPoints += parseInt(gradee?.grade);
                    });
                });
            }
        });
        return totalPoints;
    }

    function callculateTotalPoints(json) {
        let totalPoints = 0;
        json.forEach((obj) => {
            if (obj.Nomination[0].online === "false" && obj.judgeId) {
                obj.judgeId.forEach((judge) => {
                    judge.grades.forEach((gradee) => {
                        totalPoints += parseInt(gradee.grade);
                    });
                });
            }
        });
        return totalPoints;
    }

    function countUniqueOfflineNominations(array) {
        const nominationsCount = array.reduce((count, obj) => {
            if (obj.Nomination[0].online === "false") {
                count[obj.Nomination[0].name] = (count[obj.Nomination[0].name] || 0) + 1;
            }
            return count;
        }, {});

        const uniqueOfflineNominations = Object.keys(nominationsCount).filter(
            (nomination) => nominationsCount[nomination] > 0
        );

        return uniqueOfflineNominations.length;
    }

    return (
        <div>
            <div className={module.user}>
                <div className={module.userblock}>
                    <div className={module.score}><strong
                        className={module.strong2}>
                        { participant[0]?.fullName}</strong>
                        {participant[0].benefit && participant[0].benefit.length !== 0 && participant[0].benefit[0]?.name === "Команда-постер" ? (
                            <>
                                <strong className={module.strong2}>{participant[0].role}</strong>
                            </>
                        ) : ""}
                    </div>
                    <div className={module.score}>Общий балл <strong
                        className={module.strong}>{`${gradeAll(works)}`}</strong></div>
                </div>
                <div className={module.userblock}>
                    <div className={module.borderBlock}>
                        <label>Группа</label>
                        <div className={module.infoblock}>{participant[0]?.team[0]?.teamName || "Нет группы"}</div>
                    </div>
                    <div className={module.borderBlock}>
                        <label>Тренеры</label>
                        <div className={module.infoblock}> {participant[0].team.length!==0 && participant[0].team[0].teamTrainer.length!==0  && participant[0].team[0].teamTrainer ? (
                            participant[0].team[0].teamTrainer.map((obj) => <div><strong className={module.strong2}>|</strong> {obj.fullName} <strong className={module.strong2}>|</strong></div>)
                        ) : (
                            "Нет тренера"
                        )}
                        </div>
                    </div>
                </div>
                <div className={module.userblock}>
                    <div className={module.borderBlock}>
                        <label>Льгота</label>
                        <div
                            className={module.infoblock}>{participant[0].benefit[0] ? (participant[0].benefit[0].name) : ("Без льготы")}</div>
                    </div>
                    <div className={module.borderBlock}>
                        <label>Подтверждение льготы</label>
                        <div className={module.infoblock}>
                            {participant[0].linkBenefitPhoto && participant[0].linkBenefitPhoto !== "" ? (
                                <a target="_blank" rel="noreferrer"
                                   // href={`http://localhost:4444${participant[0].linkBenefitPhoto}`}>Ссылка</a>) : "Льгота не требует фото"}
                                   href={`https://nailbridge.onrender.com${participant[0].linkBenefitPhoto}`}>Ссылка</a>) : "Льгота не требует фото"}
                        </div>
                    </div>
                </div>
            </div>
            <div className={"championships"}>
                    <table className={module.container}>
                        <thead>
                        <tr>
                            <th>Категория</th>
                            <th>Номер телефона</th>
                            <th>Электронная почта</th>
                            <th>Адрес ({participant[0]?.company})</th>
                            <th>Ссылка на профиль</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{participant[0]?.category}</td>
                            <td>{participant[0]?.phoneNumber}</td>
                            <td>{participant[0]?.email || "-"}</td>
                            <td>
                                {participant[0]?.country}, {participant[0]?.city},{" "}
                                {participant[0]?.address}
                            </td>
                            <td><a target="_blank" rel="noreferrer" href={participant[0]?.profileLink}>Ссылка</a></td>
                        </tr>
                        </tbody>
                    </table>
                    <table className={module.container}>
                        <thead>
                        <tr>
                            <th>
                                Количество работ
                            </th>
                            <th>
                                Количество онлайн номинаций
                            </th>
                            <th>
                                Сумма баллов за все онлайн работы
                            </th>
                            <th>
                                Количество оффлайн номинаций
                            </th>
                            <th>
                                Сумма баллов за все оффлайн работы
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>
                                {works.length}
                            </td>
                            <td>
                                {countUniqueOnlineNominations(works)}
                            </td>
                            <td>
                                {calculateTotalPoints(works)}
                            </td>
                            <td>
                                {countUniqueOfflineNominations(works)}
                            </td>
                            <td>
                                {callculateTotalPoints(works)}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                <table className={module.container}>
                    <thead>
                    <tr>
                        <th>Номер работы</th>
                        <th>Номер номинации</th>
                        <th>Название номинации</th>
                        <th>Онлайн/оффлайн</th>
                        <th>Балл</th>
                        <th>Ссылка на работу</th>
                    </tr>
                    </thead>
                    <tbody>
                    {works.map((obj) => (
                        <tr>
                            <td>№ {obj.Nomination?.[0]?.number}
                            {obj.Participant?.[0]?.category.charAt(0)}_{obj._id.slice(-4)}</td>
                            <td>{obj.Nomination?.[0]?.number}</td>
                            <td>{obj.Nomination?.[0]?.name}</td>
                            <td>
                                {obj.Nomination[0].online==="true" ? ("Онлайн") : ("Оффлайн")}
                            </td>
                            <td>{totalGradeAll(obj.judgeId) !== 0 ? totalGradeAll(obj.judgeId) : "не имеет баллов"}</td>
                            <td>{obj.linkWork && obj.linkWork!=="" ? obj.linkWork : "-"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ParticipantInfo;
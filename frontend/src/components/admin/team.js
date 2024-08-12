import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "../../axios";
import module from "./AdminPanel.module.css";
import CheckAuth from "../errors/checkAuth";
import {useSelector} from "react-redux";
import {selectIsAdmin} from "../../redux/slices/auth";

const TeamInfo = () => {
    const {id} = useParams();
    const [teamInfo, setTeamInfo] = useState([])
    const navigate = useNavigate();
    const isAdmin = useSelector(selectIsAdmin);
    const [isLoading, setIsLoading] = useState(true);
    const [showForbidden, setShowForbidden] = useState(false);

    useEffect(() => {
        axios
            .get(`/getTeamInfo?id=${id}`)
            .then((response) => {
                setTeamInfo(response.data);
            })
            .catch((error) => {
                console.error("Ошибка при получении JSON файла", error);
            });
    }, [id]);

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

    if (!teamInfo) {
        return <CheckAuth/>
    }

    // eslint-disable-next-line
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

// eslint-disable-next-line
    function calculateTotalPoints(json) {
        let totalPoints = 0;
        json.forEach((obj) => {
            if (obj.Nomination[0].online === "true" && obj.judgeId.length !== 0) {
                obj.judgeId.forEach((judge) => {
                    judge?.grades?.forEach((gradee) => {
                        totalPoints += parseInt(gradee?.grade);
                    });
                });
            }
        });
        return totalPoints;
    }

// eslint-disable-next-line
    function callculateTotalPoints(json) {
        let totalPoints = 0;
        if (Array.isArray(json) && json.length !== 0) {
            json.forEach((obj) => {
                if (obj.Nomination && obj.Nomination?.[0]?.online === "false" && obj.judgeId && obj.judgeId?.length !== 0) {
                    obj.judgeId.forEach((judge) => {
                        judge.grades?.forEach((gradee) => {
                            totalPoints += parseInt(gradee.grade);
                        });
                    });
                }
            });
        }
        return totalPoints;
    }

// eslint-disable-next-line
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

    const gradeAll = () => {
        let sum = 0;
        if (teamInfo) {
            for (let i = 0; i < teamInfo.length; i++) {
                if (teamInfo[i].judgeId && teamInfo[i].judgeId.length !== 0) {
                    for (let j = 0; j < teamInfo[i].judgeId.length; j++) {
                        if (teamInfo[i].judgeId[j].grades && teamInfo[i].judgeId[j].grades.length !== 0) {
                            for (let z = 0; z < teamInfo[i].judgeId[j].grades.length; z++) {
                                sum += parseInt(teamInfo[i].judgeId[j].grades[z].grade)
                            }
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

    return (
        <div>
            <div className={module.user}>
                <div className={module.userblock}>
                    <div className={module.score}><strong
                        className={module.strong2}>
                        {teamInfo?.[0]?.team?.[0]?.teamName}
                    </strong>
                    </div>
                    <div className={module.score}>Общий балл комманды <strong
                        className={module.strong}>{`${gradeAll()}`}</strong></div>
                </div>
                <div className={module.userblock}>
                    <div className={module.borderBlock}>
                        <label>Тренеры</label>
                        <div
                            className={module.infoblock}> {teamInfo[0]?.[0]?.team?.[0]?.length !== 0 && teamInfo[0]?.team?.[0]?.teamTrainer?.length !== 0 ? (
                            teamInfo[0]?.team?.[0]?.teamTrainer.map((obj) => <div><strong
                                className={module.strong2}>|</strong> {obj.fullName} <strong
                                className={module.strong2}>|</strong></div>)
                        ) : (
                            "Нет тренера"
                        )}
                        </div>
                    </div>
                    <div className={module.borderBlock}>
                        <label>Участники</label>
                        <div style={{display: "flex", flexDirection: "column", gap: "8px"}}
                             className={module.infoblock}> {teamInfo[0]?.Participant?.length !== 0 ? (
                            teamInfo[0]?.Participant?.map((obj) => <div>{obj.fullName} </div>)
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
                            className={module.infoblock}>{teamInfo?.[0]?.poster === true ? "Команда-постер" : ("Без льготы")}</div>
                    </div>
                    <div className={module.borderBlock}>
                        <label>Подтверждение льготы</label>
                        <div className={module.infoblock}>
                            {teamInfo?.[0]?.Participant?.[0]?.linkBenefitPhoto && teamInfo?.[0]?.Participant?.[0]?.linkBenefitPhoto !== "" ? (
                                <a target="_blank" rel="noreferrer"
                                    // href={`http://localhost:4444${participant[0].linkBenefitPhoto}`}>Ссылка</a>) : "Льгота не требует фото"}
                                   href={`https://nailbridge.onrender.com${teamInfo?.[0]?.Participant?.[0]?.linkBenefitPhoto}`}>Ссылка</a>) : "Льгота не требует фото"}
                        </div>
                    </div>
                </div>
            </div>

            <div className={"championship"} style={{padding: "50px"}}>
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
                            {teamInfo.length}
                        </td>
                        <td>
                            {countUniqueOnlineNominations(teamInfo)}
                        </td>
                        <td>
                            {calculateTotalPoints(teamInfo)}
                        </td>
                        <td>
                            {countUniqueOfflineNominations(teamInfo)}
                        </td>
                        <td>
                            {callculateTotalPoints(teamInfo)}
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
                    {teamInfo.map((obj) => (
                        <tr>
                            <td>№ {obj.Nomination?.[0]?.number}
                                {obj.Participant?.[0]?.category.charAt(0)}_{obj._id.slice(-4)}</td>
                            <td>{obj.Nomination?.[0]?.number}</td>
                            <td>{obj.Nomination?.[0]?.name}</td>
                            <td>
                                {obj.Nomination[0].online === "true" ? ("Онлайн") : ("Оффлайн")}
                            </td>
                            <td>{totalGradeAll(obj.judgeId) !== 0 ? totalGradeAll(obj.judgeId) : "не имеет баллов"}</td>
                            <td>{obj.linkWork && obj.linkWork !== "" ? obj.linkWork : "-"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default TeamInfo;
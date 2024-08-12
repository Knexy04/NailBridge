import axios from "../../axios";
import React, {useEffect, useState} from "react";
import module from "./AdminPanel.module.css";
import {Link} from "react-router-dom";

const TableGrades = () => {
    const [tablesData, setTablesData] = useState([]);

    useEffect(() => {
        axios
            .get("/members")
            .then((response) => {
                setTablesData(response.data);
            })
            .catch((error) => {
                console.error("Ошибка при получении JSON файла", error);
            });
    }, []);

    const transformedData = {};

    tablesData.forEach((table) => {
        const nominationName = table.Nomination?.[0]?.number + " - " + table.Nomination?.[0]?.name;
        const categoryName = table.Participant?.[0]?.category;

        if (nominationName && categoryName) {
            if (!transformedData[nominationName]) {
                transformedData[nominationName] = {};
            }

            if (!transformedData[nominationName][categoryName]) {
                transformedData[nominationName][categoryName] = [];
            }

            transformedData[nominationName][categoryName].push(table);
        }
    });

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


    const sortedData = {};

    Object.keys(transformedData).forEach((final) => {
        sortedData[final] = {};

        Object.keys(transformedData[final]).forEach((category) => {
            sortedData[final][category] = transformedData[final][category].sort((a, b) => {
                const totalGradeA = totalGradeAll(a.judgeId || []);
                const totalGradeB = totalGradeAll(b.judgeId || []);
                return totalGradeB - totalGradeA;
            });
        });
    });
    // eslint-disable-next-line
    const [results, setResults] = useState([])

    const send = () => {
        axios.post('/results')
            .then((response) => {
                setResults(response.data)
                console.log(response.data)
                alert("Результаты сохранены")
            })
            .catch(() => {
                alert('Ошибка!')
            })
    }


    const getPlace = (index) => {
        if (index === 0) {
            return "1 место";
        } else if (index === 1) {
            return "2 место";
        } else if (index === 2) {
            return "3 место";
        } else {
            return index + 1 + " место";
        }
    };

    return (
        <div className="championships">
            <title>Участники</title>
            {tablesData.length!==0 ? (
                <>
                {Object.keys(sortedData).map((final, index) => (
                        <>
                            <article>{final}</article>
                            {Object.keys(sortedData[final]).map((category) => (
                                <div>
                                    <label>Категория: {category}</label>
                                    <table className={module.container}>
                                        <thead>
                                        <tr>
                                            <th>Номер</th>
                                            <th>ФИО</th>
                                            <th>Команда</th>
                                            <th>Имя тренера</th>
                                            <th>Оценки судей</th>
                                            <th>Место</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {sortedData[final][category].map((obj, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        № {obj.Nomination?.[0]?.number}
                                                        {obj.Participant?.[0]?.category.charAt(0)}_{obj._id.slice(-4)}
                                                    </td>
                                                    <td>
                                                        <table className={module.container}>
                                                            {obj.Participant?.map((part, index) => (
                                                                <tr key={index}>
                                                                    <td><Link style={{
                                                                        fontSize: "18px",
                                                                        textDecoration: "none",
                                                                        color: "blue",
                                                                    }} to={`/participant/${part._id}`}>{part.fullName}</Link>
                                                                    </td>
                                                                    <td>{part.role !== "" ? <> {part.role}</> : ""}</td>
                                                                </tr>
                                                            ))}
                                                        </table>
                                                    </td>
                                                    <td>{obj.team.length!==0 && obj.team[0].teamName!=="" && obj.team[0].teamName ?  <Link style={{
                                                        fontSize: "18px",
                                                        textDecoration: "none",
                                                        color: "blue",
                                                    }} to={`/team/${obj.team[0]._id}`}>{obj.team[0].teamName}</Link> : "-"}</td>
                                                    <td className={"gf"}>
                                                        {obj.team && obj.team.length!==0 && obj.team.length !== 0 && obj.team[0].teamTrainer && obj.team[0].teamTrainer.length !== 0 ? (
                                                            obj.team?.[0]?.teamTrainer.map((trainer) => (
                                                                <div style={{marginBottom: "8px"}}>
                                                                    {trainer ?
                                                                        <div>
                                                                            <Link style={{
                                                                                fontSize: "18px",
                                                                                textDecoration: "none",
                                                                                color: "blue",
                                                                            }} to={`/trainer/${trainer._id}`}>{trainer.fullName}</Link>
                                                                        </div>
                                                                        :
                                                                        <div style={{textAlign: "center"}}>-</div>
                                                                    }
                                                                </div>
                                                            ))
                                                        ) : (
                                                            "-"
                                                        )}
                                                    </td>
                                                    <td>
                                                        <table className={module.container}>
                                                            <thead>
                                                            <tr>
                                                                <th>Судья</th>
                                                                <th>Оценка</th>
                                                                <th>Комментарий</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {obj.judgeId && obj.judgeId.length !== 0 ? (
                                                                obj.judgeId.map((judge, index) => (
                                                                    <tr key={index}>
                                                                        <td>{obj.Judges?.[index]?.fullName}</td>
                                                                        <td>
                                                                            {judge.grades && judge.grades.length !== 0 ? (
                                                                                judge.grades.map((grade, gradeIndex) => (
                                                                                    <tr key={gradeIndex}>
                                                                                        <td>{grade.title}</td>
                                                                                        <td>{grade.grade}</td>
                                                                                    </tr>
                                                                                ))
                                                                            ) : (
                                                                                <tr>
                                                                                    <td>-</td>
                                                                                    <td>-</td>
                                                                                </tr>
                                                                            )}
                                                                        </td>
                                                                        <td>{judge.comment !== "" && judge.comment ? judge.comment : "-"}</td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td>-</td>
                                                                    <td>-</td>
                                                                    <td>-</td>
                                                                </tr>
                                                            )}
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                    <td>{totalGradeAll(obj.judgeId) !== 0 ? getPlace(index) : "не имеет баллов"}</td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </>
                    ))}
                    <button type="submit" className={module.submit} onClick={send}
                            style={{
                                display: "flex", justifyContent: "center", width: "25%"
                    }}>Подтвердить</button>
                </>
            ) : (
                <>
                    <article>Участников нет</article>
                </>
            )}
        </div>
    );
};

export default TableGrades;
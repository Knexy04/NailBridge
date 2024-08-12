import module from './AdminPanel.module.css';
import React, { useEffect, useState } from 'react';
import axios from '../../axios';

const NominationAdd = () => {
    const [nominations, setNominations] = useState([]);
    const [nominationId, setNominationId] = useState([]);
    const [showInputs, setShowInputs] = useState(false);
    const [selectOnline, setSelectOnline] = useState(null);
    const [showFirstOption, setShowFirstOption] = useState(true);
    const [number, setNumber] = useState([]);
    const [name, setName] = useState([]);
    const [criteriaList, setCriteriaList] = useState([{ title: '', criteriaStatement: '' }]);

    useEffect(() => {
        axios.get('/nominations')
            .then((response) => {
                setNominations(response.data);
            })
            .catch((error) => {
                console.error('Ошибка при получении JSON файла', error);
            });
    }, []);


    const deleteNomination = async (event) => {
        try {
            setNominationId(event.currentTarget.value);
            const field = {
                _id: nominationId,
            };
            // eslint-disable-next-line
            const { data } = await axios.delete('/nominations', { data: field });
            alert('Запись удалена');
        } catch (err) {
            alert('Ошибка при удалении');
        }
    };

    const handleSubmit = () => {
        try {
            const combinedCriteria = criteriaList.map((criteria) => {
                return {
                    title: criteria.title,
                    criteriaStatement: criteria.criteriaStatement,
                };
            });
            const fields = {
                name: name,
                number: number,
                online: selectOnline,
                criteria: combinedCriteria,
            }
            axios.post('/nominations', fields)
        } catch (err) {

        }
    }

    const handleOnlineSelection = async (event) => {
        setSelectOnline(event.target.value === 'true');
        setShowFirstOption(false);
    };

    const updateCriterion = (index, field, value) => {
        const updatedCriteria = [...criteriaList];
        updatedCriteria[index][field] = value;
        setCriteriaList(updatedCriteria);
    };

    const addCriterion = () => {
        setCriteriaList([...criteriaList, { title: '', criteriaStatement: '' }]);
    };

    const onlineNominations = nominations.filter((nomination) => nomination.online === 'true');
    const offlineNominations = nominations.filter((nomination) => nomination.online === 'false');

    return (
        <div className={module.add}>
            <article>Номинации</article>
            <div className={module.inputs}>
                {nominations.length !== 0 ? (
                    <>
                        {onlineNominations.length !== 0 ? (
                            <div className={module.inputs}>
                                <article>Онлайн</article>
                                {onlineNominations.map((item) => (
                                    <div className={module.nominationdel} key={item._id}>
                                        <label>
                                            {item.number} {item.name}
                                        </label>
                                        <button className={module.del} value={item._id} onClick={deleteNomination}>
                                            <svg
                                                width="24"
                                                height="24"
                                                fill="none"
                                                stroke="#000000"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.5"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M10 11v6m4-6v6M4 7h16m-1 0-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7h14Zm-4 0V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3h6Z"
                                                ></path>
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={module.inputs}>
                                <article>Онлайн номинаций нет</article>
                            </div>
                        )}

                        {offlineNominations.length !== 0 ? (
                            <div className={module.inputs}>
                                <article>Оффлайн</article>
                                {offlineNominations.map((item) => (
                                    <div className={module.nominationdel} key={item._id}>
                                        <label>
                                            {item.number} {item.name}
                                        </label>
                                        <button className={module.del} value={item._id} onClick={deleteNomination}>
                                            <svg
                                                width="24"
                                                height="24"
                                                fill="none"
                                                stroke="#000000"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.5"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M10 11v6m4-6v6M4 7h16m-1 0-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7h14Zm-4 0V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3h6Z"
                                                ></path>
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={module.inputs}>
                                <article>Оффлайн номинаций нет</article>
                            </div>
                        )}
                    </>
                ) : (
                    <div className={module.inputs}>
                        <article>Номинации не добавлены</article>
                    </div>
                )}
                {showInputs ? (
                    <form className={module.inputs} onSubmit={handleSubmit}>
                        <article>Добавление номинации</article>
                        <input className={module.login} type="text" placeholder="Номер номинации" value={number}
                               onChange={(e) => {
                                   setNumber(e.target.value)
                               }}/>
                        <input className={module.login} type="text" placeholder="Название номинации" value={name}
                               onChange={(e) => {
                                   setName(e.target.value)
                               }}/>
                        <select className={module.login}
                                value={selectOnline}
                                onChange={handleOnlineSelection}
                                id="Online"
                        >
                            {showFirstOption && <option value={null}>Выберите категорию</option>}
                            <option key={"false"} value={"false"}>
                                Оффлайн
                            </option>
                            <option key={"true"} value={"true"}>
                                Онлайн
                            </option>
                        </select>

                        {criteriaList.map((criteria, index) => (
                            <div className={module.inputs} key={index}>
                                <input
                                    className={module.login}
                                    type="text"
                                    placeholder="Критерий оценивания"
                                    value={criteria.title}
                                    onChange={(e) => updateCriterion(index, 'title', e.target.value)}
                                />
                                <textarea
                                    className={module.login}
                                    placeholder="Правила оценивания"
                                    value={criteria.criteriaStatement}
                                    onChange={(e) => updateCriterion(index, 'criteriaStatement', e.target.value)}
                                />
                            </div>
                        ))}
                        <button className={module.accept} type="button" onClick={addCriterion}>
                            Добавить критерий
                        </button>
                        <button className={module.accept} type="submit">
                            Добавить
                        </button>
                    </form>
                ) : (
                    <button className={module.accept} onClick={() => setShowInputs(true)}>Добавить номинацию</button>
                )}
            </div>
        </div>
    )
}
export default NominationAdd;

import React, {useEffect, useState} from "react";
import module from "./AdminPanel.module.css";
import axios from "../../axios";

const JudgeChoose = () => {
    const [works, setWorks] = useState([]);
    const [judges, setJudges] = useState([]);
    const [selectJudge, setSelectJudge] = useState([]);
    const [showFirstOption, setShowFirstOption] = useState(true);

    useEffect(() => {
        axios.get('/works')
            .then(response => {
                setWorks(response.data);
            })
            .catch(error => {
                console.error('Ошибка при получении JSON файла', error);
            });
    }, [])


    useEffect(() => {
        axios.get('/judgesnow')
            .then(response => {
                setJudges(response.data);
            })
            .catch(error => {
                console.error('Ошибка при получении JSON файла', error);
            });
    }, [])

    // eslint-disable-next-line
    const [checkboxCount, setCheckboxCount] = useState(0);
    // eslint-disable-next-line
    const [checkboxStates, setCheckboxStates] = useState({});

    // eslint-disable-next-line
    const [checkbox, setCheckbox] = useState([])

    const [judgeIdLengths, setJudgeIdLengths] = useState({});


    const handleCheckboxChange = async (event) => {
        const isChecked = event.target.checked;
        const id = event.target.value;

        if (isChecked) {
            setCheckbox((prevCheckbox) => [...prevCheckbox, id]);
        } else {
            setCheckbox((prevCheckbox) => prevCheckbox.filter((workId) => workId !== id));

            try {
                // eslint-disable-next-line
                const {data} = await axios.post('/removeJudgeFromWork', {workId: id, judgeId: selectJudge});
            } catch (err) {
                console.error('Error removing judge from work', err);
            }
        }

        setCheckboxStates((prevStates) => ({
            ...prevStates,
            [`checkbox-${id}`]: isChecked,
        }));

        setCheckboxCount((prevCount) => (isChecked ? prevCount + 1 : prevCount - 1));

        // Update the judgeIdLengths state immediately after modifying the works array
        setJudgeIdLengths((prevLengths) => ({
            ...prevLengths,
            [id]: isChecked ? (prevLengths[id] || 0) + 1 : Math.max((prevLengths[id] || 0) - 1, 0),
        }));
    };



    // Add this function to handle judge selection

    const handleJudgeSelection = async (event) => {
        setSelectJudge(event.target.value);
        setShowFirstOption(false);

        // Reset the state of all checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });

        // Get the existing nominations of the selected judge
        try {
            const judgeId = event.target.value;
            const response = await axios.get(`/judgework?judgeId=${judgeId}`);
            const thisJudgeWorks = response.data

            // Set the corresponding checkboxes to checked
            thisJudgeWorks.forEach(work => {
                const workId = work._id;
                const checkbox = document.querySelector(`input[value="${workId}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        } catch (error) {
            console.error('Ошибка при получении номинаций судьи', error);
        }
    }


    const handleSubmit = async (event) => {
        try {
            // Get the values of all checked checkboxes
            const checkedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
            const checkedValues = Array.from(checkedCheckboxes).map(checkbox => checkbox.value);

            const fields = {
                works: checkedValues,
                _id: selectJudge,
            }
            // eslint-disable-next-line
            const {data} = await axios.post('/judgework', fields);
            alert("Форма успешно отправлена")
        } catch (err) {
            alert("Ошибка добавления номинации")
        }
    }

    useEffect(() => {
        const newJudgeIdLengths = works.reduce((lengths, item) => {
            lengths[item._id] = item.judgeId.length;
            return lengths;
        }, {});

        setJudgeIdLengths(newJudgeIdLengths);
    }, [works]);

    return (
        <div className={module.judgechoose}>
            {judges.length!==0 && works.length!==0 ? (
                <>
                    <article>Выбрать судье номинации</article>
                <form onSubmit={handleSubmit}>
                    <select value={selectJudge} onChange={handleJudgeSelection} id="Judge" className={module.login}>
                        {showFirstOption && <option value={null}>Выберите судью</option>}
                        {judges.map((judge) => (
                            <option key={judge._id} value={judge._id}>
                                {judge.fullName}
                            </option>
                        ))}
                    </select>
                    <div className={module.inputs}>
                        {works.map((item) => (
                            <div className={module.nomination} key={item._id}>
                                <input
                                    type="checkbox"
                                    id={`checkbox-${item._id}`}
                                    name={`checkbox-${item._id}`}
                                    onChange={handleCheckboxChange}
                                    value={item._id}
                                    disabled={showFirstOption === true}
                                />
                                <label className={module.work} htmlFor={`checkbox-${item._id}`}>
                                    <span>{item.nominationId.number} {item.participants[0]?.participantId?.category?.charAt(0) || '_'}_{item._id.slice(-4)} </span>
                                    <aside className={module.count}>{judgeIdLengths[item._id] || 0}</aside>
                                </label>

                            </div>
                        ))}

                    </div>
                    <button type={"submit"} className={module.accept} disabled={showFirstOption === true}>Выбрать</button>
                </form>
                </>
            ):(
                <div style={{textAlign: "center"}}>
                    <article>Выбрать судье номинации</article>
                    <p>Либо никто не зарегистрировался, либо нет судей<br/>Пожалуйста, проверьте, что они добавлены</p>
                </div>
            )}
        </div>
    )
}

export default JudgeChoose;

import module from "./AdminPanel.module.css"
import axios from "../../axios";
import {useRef, useState, useEffect} from "react";

const AddChamp = () => {

    const [imageUrl, setImageUrl] = useState()
    const [title, setTitle] = useState()
    const [description, setDescription] = useState()
    const [startDate, setStartDate] = useState()
    const [endRegDate, setEndRegDate] = useState()
    const [startOffline, setStartOffline] = useState()
    const [endOffline, setEndOffline] = useState()
    const [startOnline, setStartOnline] = useState()
    const [endOnline, setEndOnline] = useState()
    const [endDate, setEndDate] = useState()
    const [isFormValid, setIsFormValid] = useState(false);

    const inputFileRef = useRef(null);


    useEffect(() => {
        // Проверяем, заполнены ли все обязательные поля
        const fields = [title, description, startDate, endRegDate, startOffline, endOffline, startOnline, endOnline, endDate];
        setIsFormValid(fields.every((field) => field !== undefined && field.trim() !== ""));
    }, [title, description, startDate, endRegDate, endDate, endOffline, endOnline, startOffline, startOnline]);


    const handleChangeFile = async (event) => {
        try {
            const formData = new FormData();
            const file = event.target.files[0]
            formData.append('image', file)
            const {data} = await axios.post('/upload', formData);
            setImageUrl(data.url);
        } catch (err) {
            alert('Ошибка загрузки')
        }
    }

    const addChampionship = async (event) => {
        try {
            const field = {
                "title": title,
                "description": description,
                "startDate": startDate,

                "startOfflineJudgeDate": startOffline,
                "startOnlineJudgeDate": startOnline,
                "endOfflineJudgeDate": endOffline,
                "endOnlineJudgeDate": endOnline,

                "endRegDate": endRegDate,
                "endDate": endDate,
                "logoImage": imageUrl,
            };
            // eslint-disable-next-line
            const data = await axios.post('/championship', field);
            event.preventDefault()
            alert('Чемпионат создан');
        } catch (err) {
            alert('Ошибка при удалении');
        }
    };


    return (
        <div className={module.reg}>
            <article>Добавить чемпионат</article>
            <form className={module.inputs} onSubmit={addChampionship}>
                <label>Название чемпионата</label>
                <input
                    type="text"
                    className={module.login}
                    placeholder="Чемпионат 2023"
                    value={title}
                    onChange={(e) => (setTitle(e.target.value))}
                />
                <label>Описание чемпионата</label>
                <textarea
                    className={module.login}
                    placeholder="Описание чемпионата для главной страницы"
                    value={description}
                    onChange={(e) => (setDescription(e.target.value))}
                />
                <label>Дата открытия регистрации</label>
                <input
                    className={module.login}
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <label>Дата окончания регистрации</label>
                <input
                    className={module.login}
                    type="datetime-local"
                    value={endRegDate}
                    onChange={(e) => (setEndRegDate(e.target.value))}
                />

                <label>Дата начала оффлайн чемпионата</label>
                <input
                    className={module.login}
                    type="datetime-local"
                    value={startOffline}
                    onChange={(e) => (setStartOffline(e.target.value))}
                />
                <label>Дата окончания оффлайн чемпионата</label>
                <input
                    className={module.login}
                    type="datetime-local"
                    value={endOffline}
                    onChange={(e) => (setEndOffline(e.target.value))}
                />
                <label>Дата начала онлайн чемпионата</label>
                <input
                    className={module.login}
                    type="datetime-local"
                    value={startOnline}
                    onChange={(e) => (setStartOnline(e.target.value))}
                />
                <label>Дата окончания онлайн чемпионата</label>
                <input
                    className={module.login}
                    type="datetime-local"
                    value={endOnline}
                    onChange={(e) => (setEndOnline(e.target.value))}
                />

                <label>Дата окончания подведения итогов</label>
                <input
                    className={module.login}
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => (setEndDate(e.target.value))}
                />

                <input
                    ref={inputFileRef}
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleChangeFile}
                />

                {!imageUrl ? (
                    <label htmlFor="logo" className={module.customFileUpload}>
                        Логотип чемпионата
                    </label>
                ) : (
                    <label htmlFor="photo" className={module.customFileUpload}>
                        Загружено
                    </label>
                )}

                <button className={module.accept} type="submit" disabled={!isFormValid}>
                    Создать
                </button>

            </form>
        </div>
    )
}

export default AddChamp;
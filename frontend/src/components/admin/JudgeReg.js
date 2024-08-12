import {useState, useRef, useEffect} from "react";
import module from "./AdminPanel.module.css";
import axios from "../../axios";

const JudgeReg = () => {

    const [fullName, setFullName] = useState()
    const [userName, setUserName] = useState()
    const [password, setPassword] = useState()
    const [imageUrl, setImageUrl] = useState()
    const [phoneNumber, setPhoneNumber] = useState()
    const [li_1, setLi_1] = useState()
    const [li_2, setLi_2] = useState()
    const [li_3, setLi_3] = useState()
    const [li_4, setLi_4] = useState()
    const [li_5, setLi_5] = useState()
    const [isAdmin, setIsAdmin] = useState(false)

    const inputFileRef = useRef(null);


    const onSubmit = async () => {
        const fields = {
            "fullName": fullName,
            "userName": userName,
            "password": password,
            "photoUrl": imageUrl,
            "phoneNumber": phoneNumber,
            "li_1": li_1,
            "li_2": li_2,
            "li_3": li_3,
            "li_4": li_4,
            "li_5": li_5,
            "isAdmin": isAdmin,

        }
        await axios.post('/auth/register', fields)
            .then(() => {
                alert("Судья зарегистрирован")
            })
            .catch(() => {
                alert("Ошибка")
            })
    };


    const handleChangeFile = async (event) => {
        try {
            const formData = new FormData();
            const file = event.target.files[0]
            formData.append('image', file)
            const {data} = await axios.post('/upload', formData);
            setImageUrl(data.url);
        } catch (err) {
            console.warn(err);
            alert('Ошибка загрузки')
        }
    }

    const [isValid, setIsValid] = useState(false)

    useEffect(() => {
        const allValues = (
            fullName &&
            phoneNumber &&
            imageUrl &&
            li_1 &&
            li_2 &&
            li_3 &&
            userName &&
            password)
        setIsValid(allValues)

    }, [fullName, phoneNumber, imageUrl, li_1, li_2, li_3, userName, password, isAdmin]);

    return (
        <div className={module.reg}>
            <article>Зарегистрировать судью</article>
            <form onSubmit={onSubmit}>
                <div className={module.inputs}>
                    <label>Фамилия/Имя*</label>
                    <input
                        placeholder={
                            "Фамилия/Имя"
                        }
                        className={module.login}
                        type="text"
                        onChange={(e) => {
                            setFullName(e.target.value)
                        }}
                    />
                    <label>Номер телефона*</label>
                    <input
                        placeholder={
                            "+71234567890"
                        }
                        className={module.login}
                        type="tel"
                        onChange={(e) => {
                            setPhoneNumber(e.target.value)
                        }}
                    />
                    <input
                        ref={inputFileRef}
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={handleChangeFile}
                    />

                    {!imageUrl ? (
                        <label htmlFor="photo" className={module.customFileUpload}>
                            Фотография*
                        </label>
                    ) : (
                        <label htmlFor="photo" className={module.customFileUpload}>
                            Загружено
                        </label>
                    )}

                    <label>Достижение*</label>
                    <textarea
                        placeholder={
                            "Длина строки должна быть от 10 до 500 символов"
                        }
                        className={module.login}
                        onChange={(e) => {
                            setLi_1(e.target.value)
                        }}
                    />
                    <label>Достижение*</label>
                    <textarea
                        placeholder={
                            "Длина строки должна быть от 10 до 500 символов"
                        }
                        className={module.login}
                        onChange={(e) => {
                            setLi_2(e.target.value)
                        }}
                    />
                    <label>Достижение*</label>
                    <textarea
                        placeholder={
                            "Длина строки должна быть от 10 до 500 символов"
                        }
                        className={module.login}
                        onChange={(e) => {
                            setLi_3(e.target.value)
                        }}
                    />
                    <label>Достижение</label>
                    <textarea
                        className={module.login}
                        onChange={(e) => {
                            setLi_4(e.target.value)
                        }}
                        placeholder="Длина строки должна быть от 10 до 500 символов"
                    />
                    <label>Достижение</label>
                    <textarea
                        className={module.login}
                        placeholder="Длина строки должна быть от 10 до 500 символов"
                        onChange={(e) => {
                            setLi_5(e.target.value)
                        }}
                    />
                    <label>Имя пользователя*</label>
                    <input
                        placeholder={
                            "Не менее 8 символов"
                        }
                        type="text"
                        className={module.login}
                        onChange={(e) => {
                            setUserName(e.target.value)
                        }}
                    />

                    <label>Пароль*</label>
                    <input
                        placeholder={
                            "Не менее 8 символов"
                        }
                        className={module.login}
                        type="password"
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                    />

                    <label>Права администратора*</label>
                    <select
                        onChange={(e) => {
                            setIsAdmin(e.target.value)
                        }}
                        className={module.login}

                    >
                        <option value={'false'}>Нет</option>
                        <option value={'true'}>Да</option>


                    </select>

                    <button className={module.submit}
                            type="submit"
                            disabled={!isValid}
                    >
                        Зарегистрировать
                    </button>
                </div>
            </form>
        </div>
    )
}

export default JudgeReg;
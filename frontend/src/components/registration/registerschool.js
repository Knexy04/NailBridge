import React, {useState} from "react";
// eslint-disable-next-line
import module from "../admin/AdminPanel.module.css";
import axios from "../../axios";
import {useNavigate} from "react-router-dom";
import countryList from "./countries";

const RegistrationJudge = () => {
    const navigate = useNavigate();
    // eslint-disable-next-line
    const [selectedCategory, setSelectedCategory] = useState("");
    // eslint-disable-next-line
    const [selectedValue, setSelectedValue] = useState("");
    // eslint-disable-next-line
    const [isLoading, setLoading] = useState(false)
    const [fullName, setFormFullname] = useState('');
    const [email, setFormEmail] = useState('');
    const [phoneNumber, setFormPhone] = useState('');
    const [socialUrl, setFormProfilLink] = useState('');
    const [formCountry, setFormCountry] = useState('RU');
    const [li_1, setLi1] = useState('');
    const [li_2, setLi2] = useState('');
    const [li_3, setLi3] = useState('');
    const [li_4, setLi4] = useState('');
    const [li_5, setLi5] = useState('');
    const [experience, setExperience] = useState('');

    const onSubmit = async () => {
        try {
            setLoading(true);
            const fields = {
                fullName,
                phoneNumber,
                socialUrl,
                email,
                li_1,
                li_2,
                li_3,
                li_4,
                li_5,
                experience,
            }
            // eslint-disable-next-line
            const {data} = await axios.post('/judgeschool', fields);
            alert("Форма успешно отправлена")
            navigate('/')
        } catch (err) {
            alert("Ошибка при регистрации")
        }
    }

    return (
        <div className="registration">
            <title>Регистрация</title>
            <article>Регистрация в школу судей</article>
            <div className="reginputs">
                <form>
                    <div className="info">
                        <div className="inputblock">
                            <label htmlFor={'name'}>ФИО</label>
                            <input type="text" placeholder="Иванов Иван Иванович" id="name" value={fullName}
                                   onChange={(e) => setFormFullname(e.target.value)}/>
                        </div>
                        <div className="inputblock">
                            <label htmlFor={'email'}>Электронная почта</label>
                            <input value={email} onChange={(e) => setFormEmail(e.target.value)} type="email"
                                   placeholder="example@gmail.com" id="email"/>
                        </div>
                        <div className="inputblock">
                            <label htmlFor={'phone'}>Номер телефона</label>
                            <input value={phoneNumber} onChange={(e) => setFormPhone(e.target.value)} type="text"
                                   placeholder="+79999999999" id="phone"/>
                        </div>
                        <div className="inputblock">
                            <label htmlFor={'link'}>Ссылка на профиль</label>
                            <input value={socialUrl} onChange={(e) => setFormProfilLink(e.target.value)} type="text"
                                   placeholder="https://example.com" id="link"/>
                        </div>
                        <div className="inputblock">
                            <label htmlFor={'country'}>Страна</label>
                            <select value={formCountry} onChange={(e) => setFormCountry(e.target.value)} id="country"
                                    defaultValue="Росcия">
                                <option value="" disabled hidden>
                                    Выберите страну
                                </option>
                                {Object.keys(countryList).map((code) => (
                                    <option key={code} value={code}>
                                        {countryList[code]}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="inputblock">
                            <label htmlFor={'name'}>ФИО</label>
                            <select id="country" value={experience} onChange={(e) => setExperience(e.target.value)}>
                                <option disabled value="" hidden>
                                    Стаж
                                </option>
                                <option>Меньше 1 года</option>
                                <option>Меньше 5 лет</option>
                                <option>Меньше 10 лет</option>
                                <option>Меньше 15 лет</option>
                                <option>Меньше 20 лет</option>
                                <option>Меньше 25 лет</option>
                                <option>Меньше 30 лет</option>
                                <option>Меньше 35 лет</option>
                                <option>Меньше 40 лет</option>
                                <option>Больше 40 лет</option>
                            </select>
                        </div>
                    </div>
                    <div className="achievements">
                        <div className="title_achievements">
                            Напишите свои достижения (максимум - 5)
                        </div>
                        <ul className="achievements_list">
                            <li className="achievement">
                                <textarea value={li_1} onChange={(e) => setLi1(e.target.value)}
                                          placeholder="Достижение 1"/>
                            </li>
                            <li className="achievement">
                                <textarea value={li_2} onChange={(e) => setLi2(e.target.value)}
                                          placeholder="Достижение 2"/>
                            </li>
                            <li className="achievement">
                                <textarea value={li_3} onChange={(e) => setLi3(e.target.value)}
                                          placeholder="Достижение 3"/>
                            </li>
                            <li className="achievement">
                                <textarea value={li_4} onChange={(e) => setLi4(e.target.value)}
                                          placeholder="Достижение 4"/>
                            </li>
                            <li className="achievement">
                                <textarea value={li_5} onChange={(e) => setLi5(e.target.value)}
                                          placeholder="Достижение 5"/>
                            </li>
                        </ul>
                    </div>
                    <button type="submit" id="submit" onClick={onSubmit} value="Оплатить">Отправить</button>
                </form>
            </div>
        </div>
    );
}

export default RegistrationJudge;
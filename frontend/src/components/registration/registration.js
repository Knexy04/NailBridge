import React, {useEffect, useState} from "react";
import axios from "../../axios";
import {useNavigate} from "react-router-dom";
import countryList from "./countries"
import About from "./about";
import CheckAuth from "./../errors/checkAuth";
// eslint-disable-next-line
import {format} from "date-fns";


const Registration = () => {
    const navigate = useNavigate();
    const [isOfflineVisible, setOfflineVisible] = useState(true);
    const [isOnlineVisible, setOnlineVisible] = useState(false);
    // eslint-disable-next-line
    const [selectedCategory, setSelectedCategory] = useState("");
    const [checkboxCount, setCheckboxCount] = useState(0);
    const [checkboxStates, setCheckboxStates] = useState({});
    const [checkboxStates_abi, setCheckboxStates_abi] = useState({});
    const [checkboxStates_poster, setCheckboxStates_poster] = useState({});
    const [selectedCheckbox, setSelectedCheckbox] = useState(null);
    const [teamSize, setTeamSize] = useState(2);
    const [nominations, setNominations] = useState([]);
    // eslint-disable-next-line
    const [prices, setPrices] = useState([]);
    const [commands, setCommands] = useState([]);

    const [offlineNominations, setOfflineNominations] = useState([])
    const [onlineNominations, setOnlineNominations] = useState([])


    const [fullName, setFormFullname] = useState('');
    const [email, setFormEmail] = useState('');
    const [phoneNumber, setFormPhone] = useState('');
    const [socialUrl, setFormProfilLink] = useState('');
    const [formCountry, setFormCountry] = useState('Росиия');
    const [category, setCategory] = useState('');
    const [command, setCommand] = useState('');
    const [trainerName, setTrainerName] = useState('');
    const [city, setCity] = useState('');
    const [adress, setAdress] = useState('');
    const [experience, setExperience] = useState('');
    const [imageUrl, setImageUrl] = useState()
    const onlineFiles = nominations.filter((item) => item.online === "true");
    const offlineFiles = nominations.filter((item) => item.online === "false");
    const [linkWork, setLinkWork] = useState([])
    // eslint-disable-next-line
    const [links, setLinks] = useState({})

    const [check, setCheck] = useState(false)

    const [teamMembers, setTeamMembers] = useState([]);

    const [company, setCompany] = useState([])

    const [countWork, setCountWork] = useState({})

    const [accept, setAccept] = useState(false)

    const [championship, setChampionship] = useState([])

    const [time, setTime] = useState([])



    useEffect(() => {
        // Проверяем, есть ли значения во всех стейтах
        const allStatesHaveValues = (
            fullName &&
            email &&
            phoneNumber &&
            socialUrl &&
            formCountry &&
            category &&
            city &&
            adress &&
            experience &&
            accept === true &&
            checkboxCount !== 0
        );

        setCheck(allStatesHaveValues);
    }, [fullName, email, phoneNumber, socialUrl, formCountry, category, city, adress, experience, checkboxCount, accept]);


    useEffect(() => {
        axios.get('/timeServer')
            .then(response => {
                setTime(response.data);
            })
            .catch(error => {
                console.error('Ошибка при получении JSON файла', error);
            });
        axios.get('/teams')
            .then(response => {
                setCommands(response.data);
            })
            .catch(error => {
                console.error('Ошибка при получении JSON файла', error);
            });
        axios.get('/championship')
            .then(response => {
                setChampionship(response.data);
            })
            .catch(error => {
                console.error('Ошибка при получении JSON файла', error);
            });
        axios.get('/nominations')
            .then(response => {
                setNominations(response.data);
            })
            .catch(error => {
                console.error('Ошибка при получении JSON файла', error);
            });
        axios.get('/benefit')
            .then(response => {
                setPrices(response.data);
            })
            .catch(error => {
                console.error('Ошибка при получении JSON файла', error);
            });

    }, [])


    const handleFileChange = async (event) => {
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

    const handleLinkWork = (event) => {
        const idNom = event.target.id;
        const value = event.target.value;
        const index = event.target.getAttribute("data-index");
        setLinkWork((prevLinks) => ({
            ...prevLinks,
            [idNom]: {
                ...(prevLinks[idNom] || {}), // Initialize nested object if necessary
                [index]: value,
            },
        }));

        setLinks((prevStates) => ({
            ...prevStates,
            [idNom]: {
                ...(prevStates[idNom] || {}), // Initialize nested object if necessary
                [index]: value,
            },
        }));
    }

    const handleSelectChange = (event) => {
        setTeamSize(parseInt(event.target.value));
    };

    const showOffline = (event) => {
        event.preventDefault();
        setOfflineVisible(true);
        setOnlineVisible(false);
    };

    const showOnline = (event) => {
        event.preventDefault();
        setOfflineVisible(false);
        setOnlineVisible(true);
    };

    const handleCheckboxChange = (event) => {
        const isChecked = event.target.checked;
        const checkboxId = event.target.id;

        if (isOnlineVisible === false) {
            setOfflineNominations((prevStates) => ({
                ...prevStates,
                [checkboxId]: isChecked,
            }));
            delete countWork[checkboxId]; // Удалить работу из countWork, если номинация offline
        } else {
            setOnlineNominations((prevStates) => ({
                ...prevStates,
                [checkboxId]: isChecked,
            }));
            if (isChecked) {
                setCountWork((prevStates) => ({
                    ...prevStates,
                    [checkboxId]: 1, // Добавить новую работу с значением 1 только для online номинаций
                }));
            } else {
                const updatedCountWork = {...countWork};
                delete updatedCountWork[checkboxId]; // Удалить работу из countWork, если номинация online отключена
                setCountWork(updatedCountWork);
            }
        }

        setCheckboxStates((prevStates) => ({
            ...prevStates,
            [checkboxId]: isChecked,
        }));

        if (isChecked) {
            setCheckboxCount((prevCount) => prevCount + 1);
        } else {
            setCheckboxCount((prevCount) => prevCount - 1);
        }
    };
    const handleCheckboxChange_abi = (event) => {
        const isChecked = event.target.checked;
        const checkboxId = event.target.name;

        setCheckboxStates_abi((prevStates) => ({
            ...prevStates,
            [checkboxId]: isChecked,
        }));

        if (isChecked) {
            setSelectedCheckbox(checkboxId);
        } else {
            setSelectedCheckbox(null);
        }
    };

    const handleChange = (index, field, value) => {
        const updatedMembers = [...teamMembers];
        if (updatedMembers[index]) {
            updatedMembers[index][field] = value;
        } else {
            updatedMembers[index] = {[field]: value};
        }
        setTeamMembers(updatedMembers);
    };
    const handleCheckboxChange_poster = (event) => {
        const isChecked = event.target.checked;
        const checkboxId = event.target.name;

        setCheckboxStates_poster((prevStates) => ({
            ...prevStates,
            [checkboxId]: isChecked,
        }));

        if (isChecked) {
            setSelectedCheckbox(checkboxId);
        } else {
            setSelectedCheckbox(null);
        }
    };

    const calculateTotal = () => {
        let count_group = teamSize;
        let total;
        let offlineCount = Object.values(offlineNominations).reduce((count, value) => {
            if (value === true) {
                return count + 1;
            } else {
                return count;
            }
        }, 0);
        let select_check = selectedCheckbox;
        const values = Object.values(countWork);

        const countWorks = values.reduce((accumulator, value) => accumulator + parseInt(value), 0);

        if (select_check === "Абилимпикс") {
            total = (offlineCount + countWorks) * 2500;
        } else if (select_check === "Команда-постер") {
            if (teamSize !== 0) {
                total = ((offlineCount + countWorks) * 2500) * count_group + ((offlineCount + countWorks) * 4500);
            } else {
                total = ((offlineCount + countWorks) * 2500) * count_group + ((offlineCount + countWorks) * 4500);
            }
        } else {
            if (0 < (offlineCount + countWorks) < 7) {
                total = (offlineCount + countWorks) * 4500;
            } else if (6 < (offlineCount + countWorks) < 11) {
                total = (offlineCount + countWorks) * 3500;
            } else {
                total = (offlineCount + countWorks) * 3000;
            }
        }


        return total.toFixed(2); // Округляем до двух десятичных знаков
    };


    const handleSubmit = async () => {
        try {
            let benefit = "";
            if (checkboxStates_abi['Абилимпикс'] === true) {
                benefit = 'Абилимпикс'
            }
            if (checkboxStates_poster['Команда-постер'] === true) {
                benefit = 'Команда-постер'
            }
            const fields = {
                linkBenefitPhoto: imageUrl,
                linkWork: linkWork,
                teamName: command,
                teamTrainer: trainerName,
                benefitName: benefit,
                members: teamMembers,
                fullName: fullName,
                category: category,
                country: formCountry,
                city: city,
                address: adress,
                experience: experience,
                phoneNumber: phoneNumber,
                profileLink: socialUrl,
                payment: true,
                nominationOnline: onlineNominations,
                nominationOffline: offlineNominations,
                company: company,
                email: email,
            }
            await axios.post('/participant', fields);
            alert("Форма успешно отправлена")
            navigate('/members')
        } catch (err) {
            alert("Ошибка при регистрации")
        }
    }

    const [isAboutOpen, setIsAboutOpen] = useState(false);

    const openInfo = () => {
        setIsAboutOpen(true);
    };

    const closeInfo = () => {
        setIsAboutOpen(false);
    };

    const acceptAll = (e) => {
        setAccept(e.target.checked);
    };


    const { format } = require('date-fns');

    const currentDate = time.time

    const startDate = championship?.[0]?.startDate;
    const endDate = championship?.[0]?.endRegDate;

    if (!startDate || !endDate || !championship) {
        return <CheckAuth/>;
    }


    const formattedDateStart = format(new Date(startDate), 'dd.MM.yyyy, HH:mm');


    const formattedDateEnd = format(new Date(endDate), 'dd.MM.yyyy, HH:mm');


    return (
        <div className="registration">
            {currentDate > startDate && currentDate<endDate ? (
                <>
                    <title>Регистрация</title>
                    <div className="article">
                        <article>Регистрация</article>
                        <aside onClick={openInfo} className={"about"}>
                            <p>Как заполнить форму?</p>
                            <svg width="24" height="24" fill="none" stroke="#454545" strokeLinecap="round"
                                 strokeLinejoin="round"
                                 strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M8.228 9c.549-1.165 2.03-2 3.771-2 2.21 0 4 1.343 4 3 0 1.4-1.277 2.575-3.006 2.907-.542.104-.994.54-.994 1.093"></path>
                                <path d="M12 17h.01"></path>
                                <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
                            </svg>
                        </aside>
                        <About isOpen={isAboutOpen} onClose={closeInfo}/>
                    </div>
                    <div className="reginputs">
                        <form onSubmit={handleSubmit}>
                            <div className="info">

                                <div className="inputblock">
                                    <label htmlFor={'name'}>ФИО<strong>*</strong></label>
                                    <input type="text" placeholder="Иванов Иван Иванович" id="name" value={fullName}
                                           onChange={(e) => setFormFullname(e.target.value)}/>
                                </div>

                                <div className="inputblock">
                                    <label htmlFor={'email'}>Электронная почта<strong>*</strong></label>
                                    <input value={email} onChange={(e) => setFormEmail(e.target.value)} type="email"
                                           placeholder="example@gmail.com" id="email"/>
                                </div>

                                <div className="inputblock">
                                    <label htmlFor={'phone'}>Номер телефона<strong>*</strong></label>
                                    <input value={phoneNumber} onChange={(e) => setFormPhone(e.target.value)}
                                           type="text"
                                           placeholder="+79999999999" id="phone"/>
                                </div>

                                <div className="inputblock">
                                    <label htmlFor={'link'}>Ссылка на профиль<strong>*</strong></label>
                                    <input value={socialUrl} onChange={(e) => setFormProfilLink(e.target.value)}
                                           type="text"
                                           placeholder="https://example.com" id="link"/>
                                </div>

                                <div className="inputblock">
                                    <label htmlFor={'category'}>Категория участника<strong>*</strong></label>
                                    <select
                                        id="category"
                                        value={category} onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="" disabled hidden>
                                            Выберите категорию
                                        </option>
                                        <option value="Школьник">Школьник</option>
                                        <option value="Студент">Студент</option>
                                        <option value="Дебют">Дебют</option>
                                        <option value="Юниор">Юниор</option>
                                        <option value="Мастер">Мастер</option>
                                        <option value="Чемпион">Чемпион</option>
                                        <option value="Эксперт">Эксперт</option>
                                    </select>
                                </div>

                                <div className="inputblock">
                                    <label>Опыт<strong>*</strong></label>
                                    <select value={experience} onChange={(e) => setExperience(e.target.value)}
                                            id="country">
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

                                <div className="inputblock">
                                    <label htmlFor={'command'}>Команда</label>
                                    <input value={command} onChange={(e) => setCommand(e.target.value)} type="text"
                                           placeholder="Команда" list="command"
                                           style={{WebkitAppearance: 'none', appearance: 'none'}}/>
                                    <datalist id="command">
                                        {commands.map((item, key) => (
                                            <option key={key} value={item.teamName}/>
                                        ))}
                                    </datalist>
                                </div>

                                <div className="inputblock">
                                    <label htmlFor={'trainers'}>Тренеры (через запятую)</label>
                                    <input value={trainerName} onChange={(e) => setTrainerName(e.target.value)}
                                           type="text"
                                           placeholder="Иванов Василий Евгеньевич, Петрова Татьяна Алексеевна"
                                           id="trainers"/>
                                </div>

                                <div className="inputblock">
                                    <label htmlFor={'country'}>Страна<strong>*</strong></label>
                                    <select value={formCountry} onChange={(e) => setFormCountry(e.target.value)}
                                            id="country"
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
                                    <label htmlFor={'city'}>Город<strong>*</strong></label>
                                    <input value={city} onChange={(e) => setCity(e.target.value)} type="text"
                                           placeholder="Город"
                                           id="city"/>
                                </div>

                                <div className="inputblock">
                                    <label htmlFor={'adress'}>Улица, дом, квартира<strong>*</strong></label>
                                    <input value={adress} onChange={(e) => setAdress(e.target.value)} type="text"
                                           placeholder="ул. Комсомольская, д.5, кв. 1" id="adress"/>
                                </div>

                                <div className="inputblock">
                                    <label>Оператор доставки<strong>*</strong></label>
                                    <select value={company} onChange={(e) => setCompany(e.target.value)} id="country">
                                        <option disabled value="" hidden>
                                            Выберите оператора доставки
                                        </option>
                                        <option>Сдэк</option>
                                        <option>Почта России</option>
                                    </select>
                                </div>

                            </div>
                            <h1>Выберите категорию, если она у вас присутствует</h1>
                            <div className="checkboxes_category">
                                <div className="nomination">
                                    <input
                                        type="checkbox"
                                        id={"Абилимпикс"}
                                        name={"Абилимпикс"}
                                        onChange={handleCheckboxChange_abi}
                                        checked={selectedCheckbox === "Абилимпикс"}
                                    />
                                    <label htmlFor={"Абилимпикс"}>
                                        {"Абилимпикс"}
                                    </label>
                                </div>
                                {checkboxStates_abi["Абилимпикс"] && selectedCheckbox === "Абилимпикс" && (
                                    <div className="block_file">
                                        <div className="file_h">
                                            Прикрепите фото с подтверждением (справкой)<strong>*</strong>
                                        </div>
                                        <div className="file_input">
                                            <label htmlFor={`link_work_${"Абилимпикс"}`}>Добавить фото</label>
                                            {imageUrl && <b>&#x2714; Добавлено</b>}
                                            <input onChange={handleFileChange} accept="image/*" type="file"
                                                   id={`link_work_${"Абилимпикс"}`}/>

                                        </div>
                                    </div>
                                )}

                                <div className="nomination">
                                    <input
                                        type="checkbox"
                                        id={"Команда-постер"}
                                        name={"Команда-постер"}
                                        checked={selectedCheckbox === "Команда-постер"}
                                        onChange={handleCheckboxChange_poster}
                                    />
                                    <label htmlFor={"Команда-постер"}>
                                        {"Команда-постер"}
                                    </label>
                                </div>
                                {checkboxStates_poster["Команда-постер"] && selectedCheckbox === "Команда-постер" && (
                                    <div className="block_file">
                                        <div className="selectP">
                                            <div className="lselect">Количество участников в команде:</div>
                                            <select id="countP" onChange={handleSelectChange} value={teamSize}>
                                                {Array.from(Array(3), (_, index) => (
                                                    <option key={index + 2} value={index + 2}>
                                                        {index + 3}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="psInfo">
                                            {teamSize !== 0 && (
                                                <div className="psInfoTitle">
                                                    Заполните информацию об остальных участниках
                                                </div>
                                            )}
                                            {Array.from(Array(teamSize), (_, index) => (
                                                <div className="pInfo" key={index}>
                                                    <div className="PinfoTitle">
                                                        Участник {index + 2}:
                                                    </div>
                                                    <div className="info">
                                                        <div className="inputblock">
                                                            <label
                                                                htmlFor={`fullName_${index}`}>ФИО<strong>*</strong></label>
                                                            <input
                                                                onChange={(e) => handleChange(index, 'fullName', e.target.value)}
                                                                type="text" placeholder="ФИО" id={`fullName_${index}`}/>
                                                        </div>
                                                        <div className="inputblock">
                                                            <label htmlFor={`email_${index}`}>Электронная
                                                                почта<strong>*</strong></label>
                                                            <input
                                                                onChange={(e) => handleChange(index, 'email', e.target.value)}
                                                                type="email" placeholder="example@gmail.com"
                                                                id={`email_${index}`}/>
                                                        </div>
                                                        <div className="inputblock">
                                                            <label htmlFor={`phoneNumber_${index}`}>Номер
                                                                телефона<strong>*</strong></label>
                                                            <input
                                                                onChange={(e) => handleChange(index, 'phoneNumber', e.target.value)}
                                                                type="text" placeholder="Телефон"
                                                                id={`phoneNumber_${index}`}
                                                                required/>
                                                        </div>
                                                        <div className="inputblock">
                                                            <label htmlFor={`link_${index}`}>Ссылка на
                                                                профиль<strong>*</strong></label>
                                                            <input
                                                                onChange={(e) => handleChange(index, 'profileLink', e.target.value)}
                                                                type="text" placeholder="Ссылка на профиль"
                                                                id={`link_${index}`}/>
                                                        </div>
                                                        <div className="inputblock">
                                                            <label htmlFor={`role_${index}`}>Роль в
                                                                команде<strong>*</strong></label>
                                                            <input
                                                                onChange={(e) => handleChange(index, 'role', e.target.value)}
                                                                type="text" placeholder="Роль в команде"
                                                                id={`role_${index}`}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <h1>Выберите тип чемпионата</h1>
                            <div className={`type ${isOfflineVisible ? "on" : "off"}`}>
                                <button onClick={showOffline}>Оффлайн</button>
                                <span className="divider"></span>
                                <button onClick={showOnline}>Онлайн</button>
                            </div>
                            <h1>Выберите номинации, в которых хотите участвовать</h1>
                            <div className="nominations">
                                <div
                                    className={`offline ${isOfflineVisible ? "visible active nominations" : "hidden"}`}>
                                    {offlineFiles.map((item) => (
                                        <div className="nomination">
                                            <input
                                                id={item._id}
                                                type="checkbox"
                                                name={item.name}
                                                onChange={handleCheckboxChange}
                                            />
                                            <label htmlFor={item._id}>
                                        <span>
                                            {item.number} {item.name}
                                        </span>
                                            </label>

                                        </div>
                                    ))}
                                </div>

                                <div className={`online ${isOnlineVisible ? "visible active nominations" : "hidden"}`}>
                                    {onlineFiles.map((item) => (
                                        <div className="nomination">
                                            <div className='nomination_name'>
                                                <input
                                                    type="checkbox"
                                                    id={item._id}
                                                    name={item.name}
                                                    onChange={handleCheckboxChange}
                                                />
                                                <label htmlFor={item._id}>
                                        <span>
                                            {item.number} {item.name}
                                        </span>
                                                </label>
                                            </div>
                                            <div>
                                                {checkboxStates[item._id] && (
                                                    <div className="block_link">
                                                        <div className="selectP">
                                                            <div className="lselect">Количество работ в этой
                                                                номинации:
                                                            </div>
                                                            <select
                                                                id="countP"
                                                                onChange={(e) => setCountWork(prevState => ({
                                                                    ...prevState,
                                                                    [item._id]: e.target.value
                                                                }))}
                                                                value={countWork[item._id]}
                                                            >
                                                                {Array.from(Array(10), (_, index) => (
                                                                    <option key={index + 1} value={index + 1}>
                                                                        {index + 1}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="link_blocks">
                                                            {Array.from(Array(parseInt(countWork[item._id])), (_, index) => (
                                                                <div key={index} className={"link_block_reg"}>
                                                                    <div className="name_link">Укажите ссылку на фото
                                                                        своей
                                                                        работы
                                                                    </div>
                                                                    <div className="input_link">
                                                                        <input
                                                                            value={linkWork[item._id]?.[index] || ""}
                                                                            data-index={index}
                                                                            onChange={handleLinkWork}
                                                                            type="text"
                                                                            placeholder="Ссылка"
                                                                            id={item._id}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={"pay"}>
                                <div className="nomination">
                                    <input
                                        id={"accept"}
                                        type="checkbox"
                                        name={"accept"}
                                        value={accept}
                                        onChange={(e) => acceptAll(e)}
                                    />
                                    <label htmlFor={"accept"}>
                            <span>
                                Я подтверждаю, что ознакомился с <strong
                                onClick={openInfo}>часто задаваемыми вопросами </strong>и даю согласие на обработку данных
                            </span>
                                    </label>

                                </div>
                                <button type="submit" id="submit" value="Оплатить" disabled={!check}>Оплатить</button>
                            </div>
                        </form>
                        {checkboxCount > 0 && (
                            <p>Итоговая сумма: {calculateTotal()} руб.</p>
                        )}
                    </div>
                </>
            ) : (
                currentDate<startDate?(
                    <>
                        <title>Регистрация</title>
                        <div className="article">
                            <article>Регистрация</article>
                        </div>
                        <div style={{fontWeight: "400", textAlign: "center", marginTop: "64px", marginBottom: "64px"}}>
                            {`Регистрация откроется ${formattedDateStart} `}
                        </div>
                    </>
                ):(
                    currentDate>endDate?(
                        <>
                            <title>Регистрация</title>
                            <div className="article">
                                <article>Регистрация</article>
                            </div>
                            <div style={{fontWeight: "400", textAlign: "center", marginTop: "64px", marginBottom: "64px"}}>
                                {`Регистрация закрылась ${formattedDateEnd}`}
                            </div>
                        </>
                        ) : ("")
                )
            )}

        </div>
    );

};

export default Registration;
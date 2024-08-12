const About = ({isOpen, onClose}) => {

    if (!isOpen) return null;

    return (
        <div className={"overlay"}>
            <div className={'infoblock'}>
                <div className={'article'}>
                    <article>Часто задаваемы вопросы</article>
                    <span onClick={onClose}>
                    <svg width="48" height="48" fill="none" stroke="#152328FF" strokeLinecap="round"
                         strokeLinejoin="round"
                         strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="m10 14 2-2m0 0 2-2m-2 2-2-2m2 2 2 2m7-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
                    </svg>
                </span>
                </div>
                <div className={"text"}>
                    <article>Как заполнять форму</article>
                    <div className={"inputblock"}>
                        <label>Какие данные вводить</label>
                        <li>1. Убедитесь, что заполнили все поля, отмеченные символом <strong>*</strong></li>
                        <li>2. Почту следует вводить по этому примеру: example@gmail.com
                            (присутствуют <strong>@</strong> и <strong>.com</strong>)
                        </li>
                        <li>3. Номер телефона введен с <strong>+</strong> в начале и не содержит в себе букв или
                            символов
                        </li>
                        <li>4. Все ссылки с <strong>https://</strong> или <strong>http://</strong> в начале</li>
                        <li>5. В поле "Улица, дом, квартира", если выбираете в качестве оператора
                            доставки <strong>СДЕК</strong>, вводите адрес пункта выдачи СДЕК, если же выбираете доставку
                            Почтой России, вводите свой адрес с индексом
                        </li>
                        <li>6. При выборе категории "<strong>Абилимпикс</strong>" вам необходимо загрузить справку,
                            подтверждающую возможность участия под данной категорией
                        </li>
                        <li>7. <strong>В случае обнаружения поддельной справки или неприменимого изображения, мы
                            свяжемся с Вами для уточнения информации. Если отправленное изображение содержит
                            непристойные материалы или если Вы не отвечаете на наши сообщения в течение недели, Ваше
                            участие может быть аннулировано без возможности возврата средств</strong></li>
                    </div>
                    <div className={"inputblock"}>
                        <label>Как загрузить изображения для участия в Онлайн номинациях</label>
                        <li>1. Зайдите на <a target="_blank" rel="noreferrer"
                                             href={"https://mega.nz"}><strong>mega.nz</strong></a> и зарегистрируйте
                            новый аккаунт, если это необходимо
                        </li>
                        <li>2. После входа в аккаунт, найдите кнопку <strong>Создать папку</strong> или подобную
                            иконку <svg width="24" height="24" fill="none" stroke="#454545" strokeLinecap="round"
                                        strokeLinejoin="round" strokeWidth="1" viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 0 1 2-2h6l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"></path>
                            </svg>, нажав на неё в предложенном поле введите номер и название выбранной номинации(и
                            номер работы, если загружаете больше одной), нажмите нопку создать
                        </li>
                        <li>3. Откройте созданную папку и загрузите туда все файлы своей работы (<strong>Не более
                            10</strong>)
                        </li>
                        <li>4. Вернитесь к списку папок и нажмите на три точки, рядом с папкой, после чего появится окно
                            в котором нужно нажать <strong>Поделиться ссылкой</strong> и <strong>Скопировать
                                ссылку</strong></li>
                        <li>5. Скопированную ссылку вставьте в появившемся окне под выбранной номинацией</li>
                        <li>6. Повторите пункты <strong>2-5</strong> столько раз, сколько будет необходимо для загрузки
                            всех работ во всех номинациях
                        </li>
                    </div>
                    <div className={"inputblock"}>
                        <article>Цены</article>
                        <label>Обычный участник</label>
                        <li>1-6 номинаций <strong>4500р.</strong> за каждую</li>
                        <li>7-10 номинаций <strong>3500р.</strong> за номинацию</li>
                        <li>10 и более номинаций <strong>3000р.</strong> за номинацию</li>

                        <label>Команда-постер</label>
                        <li>Первый участник: <strong>4500р. за любое количество номинаций</strong></li>
                        <li>Все остальные участники: <strong>2500р.</strong> за любое количество номинаций</li>

                        <label>Абилимпикс</label>
                        <li>Любое количество номинаций: <strong>2500р.</strong> за каждую</li>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About;
import {body} from "express-validator";

export const memberRegisterValidator = [
    body('fullName', 'Введите ваше имя').isLength({min: 8} && {max:120}),
    body('nominations', 'Выберите хотя бы одну номинацию').isLength({min: 1}),
    body('category', 'Выберите категорию').isLength({min: 1}),
    body('team'),
    body('country', 'Выберите страну').isLength({min: 1}),
    body('city', 'Введите Ваш город').isLength({min: 1}),
    body('post', 'Введите полный адрес доставки(Ваш личный адрес или адрес ближайшего пункта СДЕК)').isLength({min: 8}),
    body('experience', 'Укажите Ваш опыт').isLength({min: 1}),
    body('phoneNumber', 'Укажите Ваш номер телефона').isMobilePhone,
    body('profileLink', 'Укажите ссылку на любую Вашу соц. сеть').isURL,
    body('payment', 'Для участия необходимо оплатить выбранные номинации'),
]
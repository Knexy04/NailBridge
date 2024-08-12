import {body} from "express-validator";

export const RegisterValidator = [
    body('userName', 'Имя пользователя должно быть не короче 8 символов').isLength({min: 8}),
    body('password', 'Длина пароля должна быть не менее 8 символов').isLength({min: 8}),
    body('isAdmin'),
    body('fullName', 'Укажите ФИО').isLength({min: 10}),
    body('phoneNumber', "Введите номер телефона").notEmpty().isMobilePhone,
    body('photoUrl'),
    body('li_1', 'Длина строки должна быть от 10 до 500 символов').isLength({min: 10, max: 500}),
    body('li_2', 'Длина строки должна быть от 10 до 500 символов').isLength({min: 10, max: 500}),
    body('li_3', 'Длина строки должна быть от 10 до 500 символов').isLength({min: 10, max: 500}),
    body('li_4', 'Длина строки должна быть от 10 до 500 символов').optional({ checkFalsy: true }).isLength({min: 10, max: 500}),
    body('li_5', 'Длина строки должна быть от 10 до 500 символов').optional({ checkFalsy: true }).isLength({min: 10, max: 500}),
]
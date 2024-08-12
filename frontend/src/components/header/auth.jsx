import React, {useState, useEffect} from 'react';
import module from "./auth.module.css"
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {fetchUserData, selectIsAuth} from "../../redux/slices/auth";
import {Navigate} from "react-router-dom";

const Login = () => {
    const [errorMessage, setErrorMessage] = useState(null);

    const isAuth = useSelector(selectIsAuth);
    const authError = useSelector(state => state.auth.error);

    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        // eslint-disable-next-line
        setError,
        formState: {errors, isValid}
    } = useForm({
        defaultValues: {
            userName: '',
            password: '',
        },
    });

    useEffect(() => {
        if (authError?.message) {
            setErrorMessage(authError.message);
        }
    }, [authError]);

    const onSubmit = async (values) => {

        const data = await dispatch(fetchUserData(values));

        if (authError?.message) {
            return console.log(authError.message);
        }
        if ('token' in data.payload) {
            window.localStorage.setItem('token', data.payload.token);
        }
    }

    if (isAuth) {
        return <Navigate to={'/'}/>
    }

    return (
        <div className={module.auth}>
            <title>Вход</title>
            <form onSubmit={handleSubmit(onSubmit)} className={module.form}>
                <div className={module.flexcolumn}>
                    <label>Имя пользователя</label>
                </div>
                <div className={`${module.inputForm} ${errors.userName ? module.errorInputForm : ''}`}>
                    <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="#000000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M14.828 9.828a4 4 0 1 0-5.656-5.656 4 4 0 0 0 5.656 5.656Z"></path>
                        <path d="M7.05 16.05A7 7 0 0 1 19 21H5a7 7 0 0 1 2.05-4.95Z"></path>
                    </svg>
                    <input
                        placeholder={errors.userName ? errors.userName.message : 'Введите имя пользователя'}
                        className={`${module.input} ${errors.password ? module.errorInput : module.defaultInput}`}
                        {...register('userName', {required: 'Вы не ввели имя пользователя'})}
                    />
                </div>

                <div className={module.flexcolumn}>
                    <label>Пароль</label>
                </div>
                <div className={`${module.inputForm} ${errors.password ? module.errorInputForm : ''}`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        viewBox="-64 0 512 512"
                        height="20"
                    >
                        <path
                            d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path>
                        <path
                            d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96                            43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path>
                    </svg>
                    <input
                        placeholder={errors.password ? errors.password.message : 'Введите пароль'}
                        className={`${module.input} ${errors.password ? module.errorInput : module.defaultInput}`}
                        type="password"
                        {...register('password', {required: 'Вы не ввели пароль'})}
                    />
                </div>
                {errorMessage ? (
                    <div className={module.error}>
                        <svg width="20" height="20" fill="none" stroke="#ff0000" strokeLinecap="round"
                             strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 16h-1v-4h-1"></path>
                            <path d="M12 8h.01"></path>
                            <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
                        </svg>
                        <p>{errorMessage}</p>
                    </div>) : (
                    '')}
                <button className={module.buttonsubmit}
                        type={'submit'}
                        disabled={!isValid}
                >
                    <p>Войти</p>
                </button>
            </form>
        </div>
    )
}

export default Login;

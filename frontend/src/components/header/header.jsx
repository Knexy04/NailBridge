import React, {useState, useRef, useEffect} from "react";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logout, selectIsAdmin, selectIsAuth} from "../../redux/slices/auth";
// eslint-disable-next-line
import module from "./auth.module.css"

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isButtonSvg, setIsButtonSvg] = useState(true);
    const menuRef = useRef(null);
    const isAuth = useSelector(selectIsAuth);
    const dispatch = useDispatch();
    const isAdmin = useSelector(selectIsAdmin);

    const handleButtonClick = () => {
        setIsMenuOpen(!isMenuOpen);
        setIsButtonSvg(!isButtonSvg);
    };

    const onClickFunc = () => {
        setIsMenuOpen(false);
        setIsButtonSvg(true);
    };


    useEffect(() => {
        if (menuRef.current) {
            const menu = menuRef.current;
            const menuHeight = menu.scrollHeight;
            const menuAuthHeight = isAuth ? (isAdmin === true ? '320px' : '224px') : ('176px');
            menu.animate(
                [
                    {height: isMenuOpen ? "0px" : `${menuHeight}px`, opacity: isMenuOpen ? 0 : 1},
                    {height: isMenuOpen ? menuAuthHeight : "0px", opacity: isMenuOpen ? 1 : 0},
                ],
                {
                    duration: 250,
                    fill: "forwards",
                    easing: "ease-in-out"
                }
            );

            if (!isMenuOpen) {
                setTimeout(() => {
                    menu.style.display = "none";
                }, 250);
            } else {
                menu.style.display = "grid";
            }
        }
    }, [isMenuOpen, isAuth, isAdmin]);


    const onClickLogout = () => {
        if (window.confirm('Вы точно хотите выйти?')) {
            dispatch(logout());
            window.localStorage.removeItem('token')
            handleButtonClick();
            window.location.reload();
        }
    };

    return (
        <>
            <img alt={''} className={'background'} src={"photos/earth2.png"}/>
            <header>
                <Link onClick={onClickFunc} to="/">Nail Bridge</Link>
                {/*<img className={module.cups} src={'/photos/cups.svg'}/>*/}
                <div className="menu">
                    <button onClick={handleButtonClick}>
                        {isButtonSvg ? (
                            <svg
                                width="36"
                                height="36"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M4 18h16M4 6h16H4Zm0 6h16H4Z"></path>
                            </svg>
                        ) : (
                            <svg
                                width="36"
                                height="36"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="m6 6 12 12M6 18 18 6 6 18Z"></path>
                            </svg>
                        )}
                    </button>
                </div>

                <div className={`addictedmenu ${isMenuOpen ? "open" : ""}`} ref={menuRef}>
                    {isAuth ? (
                        <>
                            <Link onClick={onClickLogout}>Выйти</Link>
                            <Link onClick={handleButtonClick} to="/judge">Судить</Link>
                            <Link onClick={handleButtonClick} to="/members">Список участников</Link>
                            <Link onClick={handleButtonClick} to="/championships">Прошлые чемпионаты</Link>
                            {(isAdmin === true) && (
                                <>
                                    <Link onClick={handleButtonClick} to="/judges">Список судей</Link>
                                    <Link onClick={handleButtonClick} to="/adminpanel">Панель Администратора</Link>

                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <Link onClick={handleButtonClick} to="/login">Войти</Link>
                            <Link onClick={handleButtonClick} to="/members">Список участников</Link>
                            <Link onClick={handleButtonClick} to="/championships">Прошлые чемпионаты</Link>
                        </>
                    )}
                </div>

            </header>
        </>
    )
        ;
};

export const handleAuthClick = (setIsAuthOpen, isAuthOpen) => {
    setIsAuthOpen(!isAuthOpen);
};

export default Header;

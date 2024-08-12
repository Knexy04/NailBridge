import Judge from "./judging";
import React from "react";
import "../../styles/judging.css";
import "./tabs";
import ListPerson from "./List_person";
import JudgePass from "./Judge_pass";
import {Route, Routes, useNavigate} from "react-router-dom";
import {useState, useRef, useEffect} from "react";
import axios from "../../axios";
// eslint-disable-next-line
import CheckAuth from "../errors/checkAuth";
// eslint-disable-next-line
import {format} from "date-fns";
import {useSelector} from "react-redux";
import {selectIsAdmin} from "../../redux/slices/auth";


const JudgePage = () => {
    const [idJudge, setIdJudge] = useState([])
    const [judgeWorks, setJudgeWorks] = useState([])
    const navigate = useNavigate();
    const isAdmin = useSelector(selectIsAdmin);
    const [isLoading, setIsLoading] = useState(true);
    const [showForbidden, setShowForbidden] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response1 = await axios.get('/auth/me');
                setIdJudge(response1.data);
                const judgeId = response1.data._id;
                const response2 = await axios.get(`/judgework?judgeId=${judgeId}`);
                setJudgeWorks(response2.data);
            } catch (error) {
                console.error('Ошибка при получении JSON файла', error);
            }
        };
        fetchData();
    }, []);


    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    useEffect(() => {
        if (menuRef.current) {
            const menu = menuRef.current;
            const menuHeight = menu.scrollHeight;
            menu.animate(
                [
                    {height: isMenuOpen ? "0px" : `${menuHeight}px`},
                    {height: isMenuOpen ? `${menuHeight}px` : "0px"},
                ],
                {
                    duration: 300,
                    fill: "forwards",
                    easing: "ease-in-out",
                }
            );
        }
    }, [isMenuOpen]);

    useEffect(() => {
        if (isAdmin !== undefined) {
            setIsLoading(false);
            if (!isAdmin) {
                navigate("/");
            }
        }
    }, [isAdmin, navigate])

    useEffect(() => {
        if (isLoading) {
            const timeoutId = setTimeout(() => {
                setShowForbidden(true);
            }, 5000);
            return () => clearTimeout(timeoutId);
        }
    }, [isLoading]);

    if (isLoading) {
        return showForbidden ? navigate("/") : <CheckAuth/>;
    }

    if (judgeWorks.length > 0) {
        return (
            <div className="JudgePage fade-in">
                <title>Судить</title>
                <div className="list_person_phone_btn">
                    <svg
                        width="50"
                        onClick={toggleMenu}
                        height="50"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M12 2.4a1.2 1.2 0 0 0-1.2 1.2v1.2a1.2 1.2 0 1 0 2.4 0V3.6A1.2 1.2 0 0 0 12 2.4ZM4.8 4.8h3.6a3.6 3.6 0 0 0 7.2 0h3.6a2.4 2.4 0 0 1 2.4 2.4V18a2.4 2.4 0 0 1-2.4 2.4H4.8A2.4 2.4 0 0 1 2.4 18V7.2a2.4 2.4 0 0 1 2.4-2.4Zm3 8.4a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Zm2.94 4.8a3 3 0 1 0-5.88 0h5.88Zm3.66-7.2a1.2 1.2 0 0 0 0 2.4H18a1.2 1.2 0 1 0 0-2.4h-3.6Zm-1.2 4.8a1.2 1.2 0 0 1 1.2-1.2h2.4a1.2 1.2 0 0 1 0 2.4h-2.4a1.2 1.2 0 0 1-1.2-1.2Z"
                            clip-rule="evenodd"
                        ></path>
                    </svg>
                </div>
                {isMenuOpen && (
                    <div className="list_person_phone" ref={menuRef}>
                        <ul>
                            <ListPerson
                                onClick_function={toggleMenu}
                                persons={judgeWorks}
                            />
                        </ul>
                    </div>
                )}
                <div className="list_person">
                    <ul>
                        <ListPerson
                            onClick_function={toggleMenu}
                            persons={judgeWorks}
                        />
                    </ul>
                </div>
                <div className="reviews_f">
                    <div className="ddd">
                        <Routes>
                            <Route path="" element={<JudgePass/>}/>
                            <Route
                                path="/judge_review/:id"
                                element={<Judge persons={judgeWorks} idJudge={idJudge}/>}
                            />
                        </Routes>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="JudgePage fade-in">
                <div className="person_none">Пока что, вам не нужно никого оценивать!</div>
            </div>
        )
    }
}

export default JudgePage;
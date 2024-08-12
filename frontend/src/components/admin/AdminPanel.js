import {useEffect, useState} from 'react';
import module from './AdminPanel.module.css'

import JudgeReg from "./JudgeReg";
import JudgeChoose from "./JudgeChoose";
import {useSelector} from "react-redux";
import {selectIsAdmin} from "../../redux/slices/auth";
import {useNavigate} from "react-router-dom";
import NominationAdd from "./NominationAdd";
import CheckAuth from "../errors/checkAuth";
import AddChamp from "./AddChamp";
import TableGrades from "./tableGrades";

const AdminPanel = () => {
    const navigate = useNavigate();
    const isAdmin = useSelector(selectIsAdmin);
    const [isLoading, setIsLoading] = useState(true);
    const [showForbidden, setShowForbidden] = useState(false);

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

    return (
        <div className={module.admin}>
            <title>Панель администратора</title>
            <div className={module.first}>
                <JudgeReg/>
                <JudgeChoose/>
            </div>
            <div className={module.thrid}>
                <NominationAdd/>
                <AddChamp/>
            </div>
            <div className={module.thrid}>
                <TableGrades/>
            </div>
        </div>
    )
};

export default AdminPanel;

import Carousel from "./Carousel";
import CarouselJudge from "./CarouselJudge";
import CarouselSchool from "./CarouselSchool";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectIsAdmin} from "../../redux/slices/auth";
import {useEffect, useState} from "react";
import axios from "../../axios";
import CheckAuth from "../errors/checkAuth";

const Judges = () => {

    const navigate = useNavigate();
    const isAdmin = useSelector(selectIsAdmin);
    const [isLoading, setIsLoading] = useState(true);
    const [showForbidden, setShowForbidden] = useState(false);
    const [judges, setJudges] = useState([])
    const [school, setSchool] = useState([])

    useEffect(() => {
        axios.get('/judgereq')
            .then(res => {
                setJudges(res.data)
            })
            .catch(res => {
                console.error(res.error)
            })
    }, []);

    useEffect(() => {
        axios.get('/judgeschool')
            .then(res => {
                setSchool(res.data)
            })
            .catch(res => {
                console.error(res.error)
            })
    }, []);


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

    return(
        <div className='second'>
            <title>Судьи</title>
            <Carousel/>
            <CarouselJudge judges={judges}/>
            <CarouselSchool judges={school}/>
        </div>
    )
}

export default Judges;
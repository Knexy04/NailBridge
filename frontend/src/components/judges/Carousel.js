import React, {useEffect, useRef, useState} from "react";
import module from '../admin/AdminPanel.module.css'
import axios from "../../axios";

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Carousel = () => {
    const [allJudges, setAllJudges] = useState([]);
    const [championship, setChampionship] = useState()

    const [slide, setSlide] = useState(1)
    const [width, setWidth] = useState(0)

    const isTableView = 769 <= window.innerWidth && window.innerWidth < 1240;
    const isMobileView = 768 >= window.innerWidth;

    const sliderRef = useRef(null);


    const settings = {
        lazyLoad: "progressive",
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: slide,
        slidesToScroll: 1,
        draggable: false,
        swipe: false,
        responsive: [
            {
                breakpoint: 1440,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 1128,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    useEffect(() => {
        axios.get('/judges')
            .then(res => {
                setAllJudges(res.data)
            })
            .catch(error => {
                console.error('Ошибка при получении JSON файла', error);
            });
        axios.get('/championship')
            .then(res => {
                setChampionship(res.data[0]._id)
            })
            .catch(error => {
                console.error('Ошибка при получении JSON файла', error);
            });

        if (allJudges.length > 3 && !isTableView) {
            setSlide(3)
        } else if (allJudges.length < 3 && !isTableView) {
            setSlide(allJudges.length)
        } else if (allJudges.length > 3 && isTableView) {
            setSlide(2)
        } else if (allJudges.length > 3 && isTableView) {
            setSlide(allJudges.length)
        }
        if (slide > 2) {
            setWidth(100)
        } else if (slide === 1) {
            setWidth(35)
        } else {
            setWidth(70)
        }

    }, [allJudges, slide, isTableView]);

    const deleteJudge = async (id) => {
        try {
            const sendData = {
                _id: id
            }

            await axios.delete('/judges', {data: sendData});
            alert("Запись удалена")
        } catch (err) {
            alert("Ошибка при удалении")
        }
    }

    const updateJudge = async (id, event) => {
        try {
            const fields = {
                "_id": id,
            }
            await axios.post('/judgechamp', fields, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            alert("Форма успешно отправлена")

        } catch (err) {
            alert("Ошибка при регистрации")
        }
    }

    const handlePrevPage = () => {
        sliderRef.current.slickPrev(); // Прокручиваем карусель назад
    };

    const handleNextPage = () => {
        sliderRef.current.slickNext(); // Прокручиваем карусель вперед
    };

    return (
        <>
            <div className="carousel-container" style={{
                width: `${width}%`
            }}>
                <article>Все судьи</article>
                <div className="carousel-wrapper">
                    {allJudges.length > 0 && (
                        <Slider ref={sliderRef} {...settings}>
                            {allJudges.map((judge, index) => (

                                <div className="carousel-slide" key={index} id={judge.fullName}>
                                    <img
                                        className="judgepic"
                                        src={`https://nailbridge.onrender.com${judge.photoUrl}`}
                                        data-lazy={`https://nailbridge.onrender.com${judge.photoUrl}`}
                                        alt={judge.fullName}
                                    />
                                    <div className="imagetext_judge">
                                        <article>{judge.fullName}</article>
                                        <p>{judge.phoneNumber}</p>
                                        <div className={module.buttons}>
                                            <button className={module.delete}
                                                    onClick={() => deleteJudge(judge._id)}>Удалить
                                                судью
                                            </button>
                                            <button className={module.delete}
                                                    disabled={judge.championshipId === championship}
                                                    onClick={() => updateJudge(judge._id)}>
                                                Обновить чемпионат
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    )}
                </div>
            </div>
            {isMobileView && (
                <div className="arrows" style={{marginBottom: "108px"}}>
                    <div className="arr">
                        <svg
                            width="24"
                            height="24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={handlePrevPage}
                        >
                            <path d="m15 19-7-7 7-7"></path>
                        </svg>

                        <svg
                            width="24"
                            height="24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={handleNextPage}
                        >
                            <path d="m9 5 7 7-7 7"></path>
                        </svg>
                    </div>
                </div>
            )}
        </>
    );
};

export default Carousel;
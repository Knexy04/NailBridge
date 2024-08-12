import React, { useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../App.css"; // Импортируем файл стилей

const CarouselJudge = ({ judges }) => {
    const isTableView = window.innerWidth && window.innerWidth <= 769;

    const sliderRef = useRef(null);


    const settings = {
        lazyLoad: "progressive",
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: judges.length > 1 ? judges.length > 2 ? 3 : 2 : 1, // Условие для определения количества отображаемых слайдов
        slidesToScroll: 1,
        draggable: false,
        swipe: false,
        responsive: [
            {
                breakpoint: 1440,
                settings: {
                    slidesToShow: judges.length > 2 ? judges.length > 2 ? 3 : 2 : 1 // Аналогичное условие для адаптивных настроек
                }
            },
            {
                breakpoint: 1128,
                settings: {
                    slidesToShow: judges.length > 1 ? 2 : 1
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: judges.length > 1 ? 1 : 1
                }
            }
        ]
    };

    const handlePrevPage = () => {
        sliderRef.current.slickPrev(); // Прокручиваем карусель назад
    };

    const handleNextPage = () => {
        sliderRef.current.slickNext(); // Прокручиваем карусель вперед
    };


    return (
        <>
            <div className="carousel-container" >
                <article>Запросы на судейство</article>
                <div className="carousel-wrapper" style={judges.length===1 && !isTableView?({
                    width: "32%",
                    marginLeft: "34%"
                }):(
                    judges.length===2 && !isTableView ? (
                        {
                            width: "64%",
                            marginLeft : "18%"
                        }
                    ) : ({})
                )}>
                    <Slider ref={sliderRef} {...settings}>
                        {judges.map((judge, index) => (
                            <div key={index} className="carousel-slide">
                                <img
                                    className="judgepic"
                                    src={`https://nailbridge.onrender.com${judge.photoUrl}`}
                                    alt={judge.fullName}
                                />
                                <div className="imagetext_judge">
                                    <article>{judge.fullName}</article>
                                    <p>{judge.phoneNumber}</p>
                                    <p>{judge.email}</p>
                                    <ul>
                                        {judge.li_1 !== "" && <li sele>{judge.li_1}</li>}
                                        {judge.li_2 !== "" && <li>{judge.li_2}</li>}
                                        {judge.li_3 !== "" && <li>{judge.li_3}</li>}
                                        {judge.li_4 !== "" && <li>{judge.li_4}</li>}
                                        {judge.li_5 !== "" && <li>{judge.li_5}</li>}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
            {isTableView && (
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

export default CarouselJudge;
import React from "react";
import "../../App.css"; // Импортируем файл стилей

const CarouselJudge = ({judges}) => {
    return (
        <>
            <div className="carousel-container">
                <article>Школа судей</article>
                <div className="cards">
                    {judges.map((judge, index) => (
                        <div className="judgecard">
                            <article>{judge.fullName}</article>
                            <label>Номер телефона</label>
                            <p>{judge.phoneNumber}</p>
                            <label>Почта</label>
                            <p>{judge.email}</p>
                            <label>Социальная сеть</label>
                            <a href={judge.socialUrl} target="_blank" rel="noreferrer"><p>Ссылка</p></a>
                            <ul>
                                {judge.li_1 !== "" && <li>{judge.li_1}</li>}
                                {judge.li_2 !== "" && <li>{judge.li_2}</li>}
                                {judge.li_3 !== "" && <li>{judge.li_3}</li>}
                                {judge.li_4 !== "" && <li>{judge.li_4}</li>}
                                {judge.li_5 !== "" && <li>{judge.li_5}</li>}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
};

export default CarouselJudge;
import React, {useState} from "react";

function Organisators(props) {

    const isMobileView = window.innerWidth < 768;

    const elena = props.orgs.filter(org => org.id === "1");

    const inna = props.orgs.filter(org => org.id === "2");

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handlePrevClick = () => {
        setCurrentImageIndex((currentIndex) =>
            currentIndex === 0 ? 1 : currentIndex - 1
        );
    };

    const handleNextClick = () => {
        setCurrentImageIndex((currentIndex) =>
            currentIndex === 1 ? 0 : currentIndex + 1
        );
    };

    return (
        <div className="Organisators">
            <div className="orgs"
                 style={{
                     display: isMobileView === true ? "-webkit-inline-flex" : "flex",
                     gap: isMobileView === false ? "16px" : "0",
                 }}>
                <div
                    className="organisator"
                    id={inna[0].name}
                    style={{
                        transform:
                            isMobileView === true
                                ? currentImageIndex === 0
                                    ? "translateX(0%)"
                                    : "translateX(-100%)"
                                : "",
                            
                    }}
                >
                    <img alt="" className="orgpic" src={`photos/${inna[0].photo}`} draggable={"false"}/>
                    <div className="imagetext">
                        <article>{inna[0].name}</article>
                        <ul>
                            {inna[0].text.map((obj) => (
                                <li>{obj}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div
                    className="organisator"
                    id={elena[0].name}
                    style={{
                        transform:
                            isMobileView === true
                                ? currentImageIndex === 1
                                    ? "translateX(-100%)"
                                    : "translateX(100%)"
                                : "",
                    }}
                >
                    <img alt="" className="orgpic" src={`photos/${elena[0].photo}`} draggable={"false"}/>
                    <div className="imagetext">
                        <article>{elena[0].name}</article>
                        <ul>
                            {elena[0].text.map((obj) => (
                                <li>{obj}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {isMobileView && (
                <div className="arrows">
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
                            onClick={handlePrevClick}
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
                            viewBox="0 0 24"
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={handleNextClick}
                        >
                            <path d="m9 5 7 7-7 7"></path>
                        </svg>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Organisators;
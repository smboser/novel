import React from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export const AlertAdvisories = ({ parameters }) => {
    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };

    return (
        <Carousel
            className="row"
            responsive={responsive}
            showDots={false}
            infinite={true}
            autoPlay={false}
            autoPlaySpeed={1000}
        >
            <div className="col-md-4 col-sm-4 col-xs-12" style={{ "width": "100%" }}>
                <div className="dbb ttlcent">
                    <h2><img src="images/temp.jpg" />Temperature Alert</h2>
                    <h3>Kol 1</h3>
                    <div className="temp">40<sup>0</sup>C</div>
                    <p>Kol 1 has exceed</p>
                </div>
            </div>
            <div className="col-md-4 col-sm-4 col-xs-12" style={{ "width": "100%" }}>
                <div className="dbb ttlcent">
                    <h2><img src="images/temp.jpg" />Temperature Alert</h2>
                    <h3>Kol 1</h3>
                    <div className="temp">40<sup>0</sup>C</div>
                    <p>Kol 1 has exceed</p>
                </div>
            </div>
            <div className="col-md-4 col-sm-4 col-xs-12" style={{ "width": "100%" }}>
                <div className="dbb ttlcent">
                    <h2><img src="images/temp.jpg" />Temperature Alert</h2>
                    <h3>Kol 1</h3>
                    <div className="temp">40<sup>0</sup>C</div>
                    <p>Kol 1 has exceed</p>
                </div>
            </div>
            <div className="col-md-4 col-sm-4 col-xs-12" style={{ "width": "100%" }}>
                <div className="dbb ttlcent">
                    <h2><img src="images/temp.jpg" />Temperature Alert</h2>
                    <h3>Kol 1</h3>
                    <div className="temp">40<sup>0</sup>C</div>
                    <p>Kol 1 has exceed</p>
                </div>
            </div>
        </Carousel>
    );
};
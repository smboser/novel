import React from 'react';
import { GaugeChart } from "../components/GaugeChart";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export const AvgParameters = ({ settings, last24HoursData }) => {
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

            {settings ? Object.keys(settings).map((stname, i) => {
                let setting = settings[stname];
                return (
                    <div key={i} className="col-md-4 col-sm-6 col-xs-12" style={{ "width": "100%", "paddingTop": "10px", "paddingBottom": "10px" }}>
                        <GaugeChart setting={setting} last24HoursData={last24HoursData} />
                    </div>
                );
            }) : <div />}
        </Carousel>
    );
};
import React from 'react';
import { GaugeChart } from "../components/GaugeChart";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export const AvgParameters = ({ parameters, last24HoursData }) => {
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
            <div key={0} className="col-md-4 col-sm-6 col-xs-12" style={{ "width": "100%" }}>
                <GaugeChart param={parameters[0]} last24HoursData={last24HoursData} />
            </div>
            <div key={1} className="col-md-4 col-sm-6 col-xs-12" style={{ "width": "100%" }}>
                <GaugeChart param={parameters[1]} last24HoursData={last24HoursData} />
            </div>
            <div key={2} className="col-md-4 col-sm-6 col-xs-12" style={{ "width": "100%" }}>
                <GaugeChart param={parameters[2]} last24HoursData={last24HoursData} />
            </div>
            <div key={3} className="col-md-4 col-sm-6 col-xs-12" style={{ "width": "100%" }}>
                <GaugeChart param={parameters[3]} last24HoursData={last24HoursData} />
            </div>
            <div key={4} className="col-md-4 col-sm-6 col-xs-12" style={{ "width": "100%" }}>
                <GaugeChart param={parameters[4]} last24HoursData={last24HoursData} />
            </div>
        </Carousel>
    );
};
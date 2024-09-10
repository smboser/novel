import React from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export const AlertAdvisories = ({ settings, last24HoursData }) => {
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

    // Organized data
    let advisoriesData = [];
    let devices = Object.keys(last24HoursData);
    Object.keys(settings).forEach((setname) => {
        let setting = settings[setname];
        let { name, unit, lt, gt, parameter } = setting;


        devices.forEach((device) => {
            let data = last24HoursData[device];
            let curval = data[parameter];
            // For exceeded
            if (typeof (gt) != "undefined" && gt && curval > gt) {
                let altdata = {
                    "devName": device,
                    "parameter": parameter,
                    "name": name,
                    "unit": unit,
                    "value": curval,
                    "msg": `${device} has exceeded ${parameter}`
                }
                advisoriesData.push(altdata);
            }

            // For subceeded
            if (typeof (lt) != "undefined" && lt && curval < lt) {
                let altdata = {
                    "devName": device,
                    "parameter": parameter,
                    "name": name,
                    "unit": unit,
                    "value": curval,
                    "msg": `${device} has subceeded ${parameter}`
                }
                advisoriesData.push(altdata);
            }
        });
    });

    return (
        <Carousel
            className="row"
            responsive={responsive}
            showDots={false}
            infinite={true}
            autoPlay={false}
            autoPlaySpeed={1000}
        >

            {advisoriesData ? advisoriesData.map((data, i) => {
                return (
                    <div key={i} className="col-md-4 col-sm-4 col-xs-12" style={{ "width": "100%" }}>
                        <div className="dbb ttlcent">
                            <h2><img src="images/temp.jpg" />{data.name} Alert</h2>
                            <h3>{data.devName}</h3>
                            <div className="temp">{data.value} {data.unit}</div>
                            <p>{data.msg}</p>
                        </div>
                    </div>
                );
            }) : <div />}
        </Carousel>
    );
};
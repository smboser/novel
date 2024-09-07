import React from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

export const AlertAdvisories = ({ settings, parameters, last24HoursData }) => {
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

    // Organized advisories data
    let advisoriesData = [];
    Object.keys(settings).forEach((setname) => {
        let setting = settings[setname];
        let parameter = parameters.filter((parameter)=>parameter.key==setname);
        parameter = (parameter.length > 0) ? parameter[0] : [];
        if (setting.gt) {
            last24HoursData.forEach((data) => {
                let curval = data[setname];
                if (curval > setting.gt) {
                    let altdata = {
                        "devName": data.devName,
                        "parameter": setname,
                        "name": parameter.name,
                        "unit": parameter.unit,
                        "value": curval
                    }
                    advisoriesData.push(altdata);
                }
            });
        }
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
                            <p>{data.devName} has exceeded {data.parameter}</p>
                        </div>
                    </div>
                );
            }) : <div />}
        </Carousel>
    );
};
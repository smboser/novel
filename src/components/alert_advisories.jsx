import React from 'react';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { getAlertAdvisories } from "../helper/utils";
import { APP_CONST } from "../helper/application-constant";
export const AlertAdvisories = ({ settings, last24HoursData }) => {
    const responsive = APP_CONST.alert_advisories_responsive_parameter;
    const advisoriesData = getAlertAdvisories(settings, last24HoursData);
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
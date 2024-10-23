import React from 'react';
import { GaugeChart } from "../components/GaugeChart";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { APP_CONST } from "../helper/application-constant";
import { calculateAvgLatestData, getOrganizedDevicesAverage } from "../helper/utils";
export const AvgParameters = ({ parameters, selectedDevices, last24HoursData }) => {
    const responsive = APP_CONST.avg_device_data_responsive_parameter;
    const organizedDevicesAverage = getOrganizedDevicesAverage(parameters, selectedDevices, last24HoursData);
    console.log("Organized Devices Average:", organizedDevicesAverage);
    return (
        <Carousel
            className="row"
            responsive={responsive}
            showDots={false}
            infinite={true}
            autoPlay={false}
            autoPlaySpeed={1000}
        >

            {organizedDevicesAverage.length > 0 ? organizedDevicesAverage.map((data, i) => {
                try {
                    return (
                        <div key={i} className="col-md-4 col-sm-6 col-xs-12" style={{ "width": "100%", "paddingTop": "10px", "paddingBottom": "10px" }}>
                            <GaugeChart data={data} />
                        </div>
                    );
                } catch (err) {

                }

            }) : <div />}
        </Carousel>
    );
};
import React from 'react';
import { useState, useEffect } from "react";
import { CirclesWithBar } from "react-loader-spinner";
import "react-multi-carousel/lib/styles.css";
import { useAuth } from "../hooks/useAuth";
import { APP_CONST } from "../helper/application-constant";
import { getSensorData } from "../helper/web-service";
import { Navbar } from "../components/nav";
import { AvgParameters } from "../components/avg_parameters";
import { AlertAdvisories } from "../components/alert_advisories";
import { DetailedAnalytics } from "../components/detailed_analytics";

export const ReportPage = () => {
    const { user } = useAuth();
    const [isLoaderVisible, setLoaderVisible] = useState(false);
    const [series, setSeries] = useState([]);
    const [parameters, setParameters] = useState(JSON.parse(JSON.stringify(APP_CONST.parameters)));
    const [last24HourEachDevice, setLast24HourEachDevice] = useState([]);
    const [devices, setDevices] = useState([]);
    useEffect(() => {
        // Showing loader
        setLoaderVisible(true);
        // Call API to get sensor data
        getSensorData(user)
            .then((data) => {
                let values = data.value;
                let sers = [];
                let devs = [];
                let lastEachDev = [];
                let avgpams = [];

                // Get series data
                values.forEach(value => {
                    let instData = {
                        "timestamp": value.Timestamp,
                        "light_level": value.light_level,
                        "co2": value.co2,
                        "humidity": value.humidity,
                        "pressure": value.pressure,
                        "temperature": value.temperature,
                        "tvoc": value.tvoc
                    };

                    if (sers.length > 0) {
                        let index = sers.findIndex(ser => ser.devName === value.devName);
                        if (index !== -1)
                            sers[index]["data"].push(instData);
                        else sers.push({
                            "devName": value.devName,
                            "data": [instData]
                        });
                    } else {
                        sers.push({
                            "devName": value.devName,
                            "data": [instData]
                        });
                    }


                    let avgData = {
                        "devName": value.devName,
                        "timestamp": value.Timestamp,
                        "co2": value.co2,
                        "humidity": value.humidity,
                        "light_level": value.light_level,
                        "temperature": value.temperature,
                        "tvoc": value.tvoc
                    };

                    if (lastEachDev.length > 0) {
                        let index = lastEachDev.findIndex(device => device.devName === value.devName);
                        if (index !== -1) {
                            let d1 = new Date(lastEachDev[index]['timestamp']);
                            let d2 = new Date(value.Timestamp);
                            if (d2.getTime() > d1.getTime()) {
                                lastEachDev[index] = avgData;
                            }
                        } else lastEachDev.push(avgData);
                    } else {
                        lastEachDev.push(avgData);
                    }
                });

                // Find the unique devices
                devs = [...new Set(sers.map(ser => ser.devName))];

                setDevices(devs);
                setSeries(sers);
                setLast24HourEachDevice(lastEachDev);
                setLoaderVisible(false);
            });
    }, []);


    return (
        <>
            <CirclesWithBar
                color="#00bfff"
                height="70"
                width="70"
                wrapperClass="loader"
                visible={isLoaderVisible}
            />
            <div className="formbodymain">
                <div className="row">
                    <div className="col-md-12 col-sm-12 col-xs-12">
                        <Navbar />
                    </div>
                    <div className="col-md-12 col-sm-12 col-xs-12 report" id="style-3">
                        <div className="x_panel">
                            <div className="col-md-12 col-sm-12 col-xs-12">
                                <div className="ttl_main center">
                                    <h2 style={{ textAlign: "center" }}>Device Data</h2>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 col-sm-12 col-xs-12">
                                        <div className="centerwrapperbox">
                                            <h2 className="dev_ttlmain">All devices data average for last 24 hours</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="centerwrapperbox">
                                    <div className="chartbox dbb">
                                        {
                                            (last24HourEachDevice.length > 0)
                                                ?
                                                <AvgParameters
                                                    parameters={parameters}
                                                    last24HoursData={last24HourEachDevice}
                                                />
                                                : "Waiting to load data...."
                                        }
                                    </div>
                                </div>
                                <div className="centerwrapperbox ptopten">
                                    <h2 className="dev_ttlmain">Device advisories</h2>
                                    <AlertAdvisories></AlertAdvisories>
                                </div>
                                <div className="centerwrapperbox ptopten">
                                    <h2 className="dev_ttlmain">Detailed Analytics</h2>
                                    {
                                        (series.length > 0)
                                            ?
                                            <DetailedAnalytics
                                                devices={devices}
                                                parameters={parameters}
                                                series={series}
                                                default_parameter={APP_CONST.default_parameter}
                                            ></DetailedAnalytics>
                                            : "Waiting to load data...."
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
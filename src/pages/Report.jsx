import React from 'react';
import { useState, useEffect } from "react";
import { CirclesWithBar } from "react-loader-spinner";
import "react-multi-carousel/lib/styles.css";
import { useAuth } from "../hooks/useAuth";
import { APP_CONST } from "../helper/application-constant";
import { getSensorData, getAdvisorySettingData } from "../helper/web-service";
import { Navbar } from "../components/nav";
import { AvgParameters } from "../components/avg_parameters";
import { AlertAdvisories } from "../components/alert_advisories";
import { DetailedAnalytics } from "../components/detailed_analytics";

export const ReportPage = () => {
    const { user } = useAuth();
    const [isLoaderVisible, setLoaderVisible] = useState(false);
    const [settings, setSettings] = useState([]);
    const [series, setSeries] = useState([]);
    const [parameters, setParameters] = useState(JSON.parse(JSON.stringify(APP_CONST.parameters)));
    const [last24HourEachDevice, setLast24HourEachDevice] = useState([]);
    const [devices, setDevices] = useState([]);
    const [selectedHourly, setSelectedHourly] = useState("last_hour");
    const [selectedParam, setSelectedParam] = useState(APP_CONST.default_parameter);

    useEffect(() => {
        console.log(`Inside useEffect for  ReportPage`);

        // Showing loader
        setLoaderVisible(true);

        // Call the api for getAdvisorySettingData and getSensorData
        Promise.all([
            getAdvisorySettingData(user),
            getSensorData(user)
        ]).then((reponses) => {
            let repAdvisorySettings = reponses[0];
            let repSensorData = reponses[1];
            let organizedAdvisorySettings = repAdvisorySettings.value.reduce((acc, alert) => {
                if (!acc[alert.parameter]) {
                    acc[alert.parameter] = {
                        lt: "",
                        gt: "",
                        active: alert.active,
                        parameter: alert.parameter,
                        orgName: user.orgName,
                    };
                }
                if (alert.func === "lt") {
                    acc[alert.parameter].lt = alert.level || "";
                } else if (alert.func === "gt") {
                    acc[alert.parameter].gt = alert.level || "";
                }
                return acc;
            }, {});

            let values = repSensorData.value;
            let sers = [];
            let devs = [];
            let lastEachDev = [];

            // Organized data
            values.forEach(value => {
                let instData = { "timestamp": value.Timestamp };
                Object.keys(organizedAdvisorySettings).forEach((settingName) => {
                    instData[settingName] = value[settingName];
                });

                // Organized data for line chart
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

                // Organized data for gauge chart
                let avgData = JSON.parse(JSON.stringify(instData));
                avgData["devName"] = value.devName;
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

            // Sorting serices
            // sers.sort(function (a, b) {
            //     var key1 = new Date(a.timestamp);
            //     var key2 = new Date(b.timestamp);
            //     if (key1 < key2) {
            //         return -1;
            //     } else if (key1 == key2) {
            //         return 0;
            //     } else {
            //         return 1;
            //     }
            // });
            // Find the unique devices
            devs = [...new Set(sers.map(ser => ser.devName))];
            setSettings(organizedAdvisorySettings);
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
                                <div className="centerwrapperbox">
                                    <h2 className="dev_ttlmain">All devices average</h2>
                                    {
                                        (last24HourEachDevice.length > 0)
                                            ?
                                            <div className="chartbox dbb">

                                                <AvgParameters
                                                    settings={settings}
                                                    parameters={parameters}
                                                    last24HoursData={last24HourEachDevice}
                                                />

                                            </div>
                                            : "Waiting to load data...."
                                    }
                                </div>
                                <div className="centerwrapperbox ptopten">
                                    <h2 className="dev_ttlmain">Device advisories</h2>
                                    {
                                        (last24HourEachDevice.length > 0)
                                            ?
                                            <AlertAdvisories
                                                settings={settings}
                                                parameters={parameters}
                                                last24HoursData={last24HourEachDevice}
                                            />
                                            : "Waiting to load data...."
                                    }
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
                                                selectedHourly={selectedHourly}
                                                selectedParam={selectedParam}
                                                setSelectedHourly={setSelectedHourly}
                                                setSelectedParam={setSelectedParam}
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
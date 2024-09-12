import React from 'react';
import { useState, useEffect } from "react";
import { CirclesWithBar } from "react-loader-spinner";
import "react-multi-carousel/lib/styles.css";
import { useAuth } from "../hooks/useAuth";
import { APP_CONST } from "../helper/application-constant";
import { getSensorData, getAdvisorySettingData } from "../helper/web-service";
import { Navbar } from "../components/nav";
import { Footer } from "../components/footer";
import { AvgParameters } from "../components/avg_parameters";
import { AlertAdvisories } from "../components/alert_advisories";
import { DetailedAnalytics } from "../components/detailed_analytics";
import { filterLatestAlerts, getOrganizedAdvisorySettings, getParameters } from "../helper/utils";

export const ReportPage = () => {
    const { user } = useAuth();
    const [isLoaderVisible, setLoaderVisible] = useState(false);
    const [settings, setSettings] = useState([]);
    const [series, setSeries] = useState(null);
    const [last24HourEachDevice, setLast24HourEachDevice] = useState(null);
    const [selectedHourly, setSelectedHourly] = useState("last_hour");
    const [selectedParam, setSelectedParam] = useState(APP_CONST.default_parameter);

    useEffect(() => {
        console.log(`Inside useEffect for  ReportPage`);

        // Showing loader
        setLoaderVisible(true);

        // Call the api for getAdvisorySettingData and getSensorData
        Promise.all([
            getAdvisorySettingData(user), // Call API to get advisory setting
            getSensorData(user)  // Call API to get sensor data
        ]).then((reponses) => {
            let parameters = getParameters();
            // Organized advisory settings
            let repAdvisorySettings = reponses[0];
            let latestAdvisorySettings = filterLatestAlerts(repAdvisorySettings.value);
            let organizedAdvisorySettings = getOrganizedAdvisorySettings(latestAdvisorySettings, parameters);
            console.log("Organized Advisory Settings:", organizedAdvisorySettings);

            // Organized sensor data
            let repSensorData = reponses[1];
            let activeAdvisorySettings = Object.keys(organizedAdvisorySettings);
            let seriesData = {};
            let latestData = {};
            repSensorData.value.forEach(value => {
                let devName = value.devName;
                let instData = { "timestamp": value.Timestamp };
                activeAdvisorySettings.forEach((setname) => {
                    instData[setname] = value[setname];
                });

                if (!seriesData[devName]) {
                    seriesData[devName] = [];
                }

                if (!latestData[devName]) {
                    latestData[devName] = {};
                }

                seriesData[devName].push(instData);

                if (Object.keys(latestData[devName]) == 0) {
                    latestData[devName] = instData;
                } else if (new Date(value.Timestamp) > new Date(latestData[devName].timestamp)) {
                    latestData[devName] = instData;
                }
            });

            console.log("Series Data:", seriesData);
            console.log("Latest Data:", latestData);

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
            setSettings(organizedAdvisorySettings);
            setSeries(seriesData);
            setLast24HourEachDevice(latestData);
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
                                        (last24HourEachDevice)
                                            ?
                                            <div className="chartbox dbb">

                                                <AvgParameters
                                                    settings={settings}
                                                    last24HoursData={last24HourEachDevice}
                                                />

                                            </div>
                                            : "Waiting to load data...."
                                    }
                                </div>
                                <div className="centerwrapperbox ptopten">
                                    <h2 className="dev_ttlmain">Device advisories</h2>
                                    {
                                        (last24HourEachDevice)
                                            ?
                                            <AlertAdvisories
                                                settings={settings}
                                                last24HoursData={last24HourEachDevice}
                                            />
                                            : "Waiting to load data...."
                                    }
                                </div>
                                <div className="centerwrapperbox ptopten">
                                    <h2 className="dev_ttlmain">Detailed Analytics</h2>
                                    {
                                        (series)
                                            ?
                                            <DetailedAnalytics
                                                settings={settings}
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
            <Footer/>
        </>
    );
};
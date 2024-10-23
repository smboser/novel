import React from 'react';
import { useState, useEffect } from "react";
import { CirclesWithBar } from "react-loader-spinner";
import "react-multi-carousel/lib/styles.css";
import { useAuth } from "../hooks/useAuth";
import { APP_CONST } from "../helper/application-constant";
import { getDevices, getSensorData, getAdvisorySettings } from "../helper/web-service";
import { Navbar } from "../components/nav";
import { Footer } from "../components/footer";
import { AvgParameters } from "../components/avg_parameters";
import { DeviceList } from "../components/deviceList";
import { AlertAdvisories } from "../components/alert_advisories";
import { DetailedAnalytics } from "../components/detailed_analytics";
import { getOrganizedAdvisorySettings, getOrganizedParameters, getOrganizedSensorData } from "../helper/utils";
export const ReportPage = () => {
    const { user } = useAuth();
    const [isLoaderVisible, setLoaderVisible] = useState(false);
    const [settings, setSettings] = useState([]);
    const [parameters, setParameters] = useState([]);
    const [series, setSeries] = useState(null);
    const [devices, setDevices] = useState([]);
    const [selectedDevices, setSelectedDevices] = useState([]);
    const [last24HourEachDevice, setLast24HourEachDevice] = useState(null);
    const [selectedHourly, setSelectedHourly] = useState("last_hour");
    const [selectedParam, setSelectedParam] = useState(APP_CONST.default_parameter);

    useEffect(() => {
        console.log(`Inside useEffect for  ReportPage`);

        // Showing loader
        setLoaderVisible(true);

        // Call the api for getAdvisorySettingData and getSensorData
        Promise.all([
            getDevices(user),
            getAdvisorySettings(user),  // Call API to get advisory setting
            getSensorData(user)         // Call API to get sensor data
        ]).then((reponses) => {
            console.log(" ---- ALL DAta Fetching ----")
            // Organized devices
            let repDevices = reponses[0]["value"];
            let deviceList = repDevices.map((device) => { 
                let {devName, devEUI} = device;
                return { devName, devEUI };
            });
            console.log("DeviceList:", deviceList);
            // Organized parameters
            let repAdvisorySettings = reponses[1]["value"];
            let parameters = getOrganizedParameters(repAdvisorySettings);
            console.log("Organized Parameters:", parameters);
            let organizedAdvisorySettings = getOrganizedAdvisorySettings(repAdvisorySettings);
            console.log("Organized Advisory Settings:", organizedAdvisorySettings);

            // Organized sensor data
            let repSensorData = reponses[2]["value"];
            let { seriesData, latestData } = getOrganizedSensorData(repSensorData, Object.keys(parameters));
            console.log("Series Data:", seriesData);
            console.log("Latest Data:", latestData);

            // Find the unique devices
            setSettings(organizedAdvisorySettings);
            setParameters(parameters);
            setSeries(seriesData);
            setDevices(deviceList);
            setSelectedDevices(deviceList.map((device) => device.devEUI));
            setLast24HourEachDevice(latestData);
            setLoaderVisible(false);
        });
    }, []);


    const handleCheckboxChange = (event) => {
        event.stopPropagation();
        event.preventDefault();
        console.log("--- Inside handleCheckboxChange ---");
        let value = event.target.value;
        let isChecked = event.target.checked;
        if (isChecked) {
            setSelectedDevices([...selectedDevices, value]);
        } else {
            setSelectedDevices(selectedDevices.filter((id) => id !== value));
        }
    };

    const handleChecked = (event) => {
        event.stopPropagation();
        event.preventDefault();
        console.log("--- Inside handleChecked ---")
        setSelectedDevices(devices.map((device) => device.devEUI));
    };

    const handleUnchecked = (event) => {
        event.stopPropagation();
        event.preventDefault();
        console.log("--- Inside handleUnchecked ---")
        setSelectedDevices([]);
    };


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
                    <div className="col-md-12 col-sm-12 col-xs-12">
                        <h2 style={{ textAlign: "center" }}>Device Data</h2>
                        <div className="row report_page">
                            <div className="col-md-2 col-sm-3 col-xs-12">
                                <h2 className="dev_ttlmain">Devices</h2>
                                <div className="dbb chtbox">
                                    <span className="label label-primary" style={{ "padding": "6px", "cursor": "pointer" }} onClick={handleChecked}>Checked</span>
                                    <span className="label label-primary" style={{ "padding": "6px", "cursor": "pointer", "marginLeft": "10px" }} onClick={handleUnchecked}>Unchecked</span>
                                    <div className="list">
                                        {
                                            (devices.length > 0)
                                                ?
                                                <DeviceList
                                                    deviceList={devices}
                                                    selectedDeviceList={selectedDevices}
                                                    changeHandeler={handleCheckboxChange}></DeviceList>
                                                : <div className="waiting_loader">Waiting to load data....</div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-10 col-sm-9 col-xs-12">
                                <h2 className="dev_ttlmain">All devices average</h2>
                                <div className="dbb chartbox">
                                    {
                                        (last24HourEachDevice)
                                            ?
                                            <AvgParameters
                                                parameters={parameters}
                                                selectedDevices={selectedDevices}
                                                last24HoursData={last24HourEachDevice}
                                            />
                                            : <div className="waiting_loader">Waiting to load data....</div>
                                    }
                                </div>
                                <h2 className="dev_ttlmain">Detailed analytics</h2>
                                <div className="dbb chtbox" style={{ "height": "370px" }}>
                                    {
                                        (series)
                                            ?
                                            <DetailedAnalytics
                                                parameters={parameters}
                                                devices={devices}
                                                selectedDevices={selectedDevices}
                                                series={series}
                                                selectedHourly={selectedHourly}
                                                selectedParam={selectedParam}
                                                setSelectedHourly={setSelectedHourly}
                                                setSelectedParam={setSelectedParam}
                                            ></DetailedAnalytics>
                                            : <div className="waiting_loader">Waiting to load data....</div>
                                    }
                                </div>
                            </div>
                            <div className="col-md-12 col-sm-12 col-xs-12">
                                <h2 className="dev_ttlmain">Device advisories</h2>
                                {
                                    (last24HourEachDevice)
                                        ?
                                        <AlertAdvisories
                                            settings={settings}
                                            last24HoursData={last24HourEachDevice}
                                        />
                                        : <div className="waiting_loader">Waiting to load data....</div>
                                }
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </>
    );
};
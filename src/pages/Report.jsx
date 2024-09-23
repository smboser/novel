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
import { DeviceList } from "../components/deviceList";
import { AlertAdvisories } from "../components/alert_advisories";
import { DetailedAnalytics } from "../components/detailed_analytics";
import { filterLatestAlerts, getOrganizedAdvisorySettings, getParameters } from "../helper/utils";

// Connect with Redux and import and require actions
import { connect } from 'react-redux';
import { setUserDetails } from "../redux/actions/userActions";

export const Report = (props) => {    
    const { user } = useAuth();
    const [isLoaderVisible, setLoaderVisible] = useState(false);
    const [settings, setSettings] = useState([]);
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
            let deviceList = new Set();
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

                // Added devices name
                deviceList.add(devName);
                // Push sensore data
                seriesData[devName].push(instData);
                // Push last 24 hours data
                if (Object.keys(latestData[devName]) == 0) {
                    latestData[devName] = instData;
                } else if (new Date(value.Timestamp) > new Date(latestData[devName].timestamp)) {
                    latestData[devName] = instData;
                }
            });

            console.log("Series Data:", seriesData);
            console.log("Latest Data:", latestData);

            // Find the unique devices
            deviceList = Array.from(deviceList);
            setSettings(organizedAdvisorySettings);
            setSeries(seriesData);
            setDevices(deviceList);
            setSelectedDevices(deviceList);
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
        setSelectedDevices(devices);
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
                                    <span className="label label-primary" style={{ "cursor": "pointer" }} onClick={handleChecked}>Checked</span>
                                    <span className="label label-primary" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={handleUnchecked}>Unchecked</span>
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
                                <div className="dbb chartbox" style={{ "height": "220px" }}>
                                    {
                                        (last24HourEachDevice)
                                            ?
                                            <AvgParameters
                                                settings={settings}
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
                                                settings={settings}
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

// mapStateToProps
const mapStateToProps = (state) => ({
    userDetails: state.users.userDetails, // Ensure the correct path to userDetails
  });
  
  // mapDispatchToProps
  const mapDispatchToProps = (dispatch) => ({
    setUserDetails: (data) => dispatch(setUserDetails(data)),
  });
  
  // Connect component to Redux
  export default connect(mapStateToProps, mapDispatchToProps)(Report);
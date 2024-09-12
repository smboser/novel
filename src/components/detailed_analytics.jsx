import React from 'react';
import Plot from 'react-plotly.js';
import moment from 'moment';
import { useState, useEffect } from "react";
import { debounce } from '@mui/material';

export const DetailedAnalytics = ({ settings, series, selectedHourly, selectedParam, setSelectedHourly, setSelectedParam }) => {
    const [selectedDevices, setSelectedDevices] = useState([]);
    const [organizedSerieData, setOrganizedSerieData] = useState([]);
    const devices = Object.keys(series);
    const detailedAnalyticsData = () => {
        let pdt = moment().add(-1, 'hours');
        switch (selectedHourly) {
            case "last_hour":
                pdt = moment().add(-1, 'hours');
                break;
            case "last_12_hour":
                pdt = moment().add(-12, 'hours');
                break;
            case "last_24_hour":
                pdt = moment().add(-24, 'hours');
                break;
            case "last_48_hour":
                pdt = moment().add(-48, 'hours');
                break;
            case "last_week":
                pdt = moment().add(-1, 'weeks');
                break;
        }
        let sd = [];
        devices.forEach(device => {
            let xArr = [];
            let yArr = [];
            // If device is not in the selected list
            if (!selectedDevices.includes(device)) {
                return;
            }
            debugger;
            // Get the data for device
            let data = series[device];
            data.forEach(s => {
                let cdt = moment(s.timestamp);
                let yval = s[selectedParam];
                if (cdt.diff(pdt, 'seconds') > 0 && typeof (yval) != "undefined" && yval != null) {
                    xArr.push(moment(s.timestamp).format('YYYY-MM-DD H:mm:ss'));
                    yArr.push(yval);
                }
            });
            if (xArr.length > 0 && yArr.length > 0) {
                sd.push({
                    x: xArr,
                    y: yArr,
                    type: 'scatter',
                    marker: {
                        size: 5
                    },
                    line: {
                        width: 1
                    },
                    name: device,
                });
            }
        });
        setOrganizedSerieData(sd);
    };

    useEffect(() => {
        console.log(`Inside useEffect for  DetailedAnalytics`);
        setSelectedDevices(devices);
        detailedAnalyticsData();
    }, []);

    useEffect(() => {
        console.log(`Inside useEffect for  DetailedAnalytics`);
        detailedAnalyticsData();
    }, [selectedHourly, selectedParam, selectedDevices]);

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

    const handleHourlyFilterChange = (event) => {
        console.log("--- Inside handleHourlyFilterChange ---");
        setSelectedHourly(event.target.value);
    };

    const handleParamFilterChange = (event) => {
        console.log("--- Inside handleParamFilterChange ---")
        setSelectedParam(event.target.value);
    };

    const handleChecked = (event) => {
        console.log("--- Inside handleChecked ---")
        setSelectedDevices(devices);
    };

    const handleUnchecked = (event) => {
        console.log("--- Inside handleUnchecked ---")
        setSelectedDevices([]);
    };




    console.log(selectedDevices);
    return (
        <div className="row respodr">
            <div className="col-md-3 col-sm-2 col-xs-12">
                <div className="dbb boxh onesec" style={{ "padding": "10px 15px", "height": "260px" }}>
                    <h2 className="dev_ttl" style={{ "fontSize": "14px" }}>Devices</h2>
                    <div className="list" style={{ marginTop: "20px" }}>
                        <span className="label label-primary" style={{ "cursor": "pointer" }} onClick={handleChecked}>Checked</span>
                        <span className="label label-primary" style={{ "marginLeft": "10px", "cursor": "pointer" }} onClick={handleUnchecked}>Unchecked</span>
                        <ul style={{ "marginTop": "10px" }}>
                            {Object.keys(series).map((device, i) => {
                                return (
                                    <li key={i}>
                                        <input
                                            type="checkbox"
                                            id={`custom-checkbox-${i}`}
                                            name={device}
                                            value={device}
                                            checked={selectedDevices.includes(device)}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label>{device}</label>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="col-md-9 col-sm-8 col-xs-12" style={{ "paddingRight": "0px" }}>
                <div className="dbb chtbox" style={{ "padding": "20px 15px" }}>
                    <div className="row">
                        <div className="col-md-3 col-sm-3 col-xs-12 chtsel">
                            <select
                                name="hourly_filter"
                                value={selectedHourly}
                                onChange={handleHourlyFilterChange}>
                                <option value="last_hour">Last hour</option>
                                <option value="last_12_hour">Last 12 hours</option>
                                <option value="last_24_hour">Last 24 hours</option>
                                <option value="last_48_hour">Last 48 hours</option>
                                <option value="last_week">Last Week</option>
                            </select>
                        </div>
                        <div className="col-md-3 col-sm-3 col-xs-12 chtsel">
                            <select
                                name="type_filter"
                                value={selectedParam}
                                onChange={handleParamFilterChange}>
                                {Object.keys(settings).map((setname, i) => {
                                    let setting = settings[setname];
                                    return (
                                        <option key={i} value={setting.parameter}>{setting.name}</option>
                                    )
                                })};
                            </select>
                        </div>
                    </div>
                    {
                        (organizedSerieData.length > 0)
                            ?
                            <Plot
                                data={organizedSerieData}
                                layout={{
                                    height: 300,
                                    margin: {
                                        l: 30,
                                        r: 30,
                                        b: 30,
                                        t: 30,
                                        pad: 5
                                    },
                                    xaxis: {
                                        automargin: true
                                    },
                                    yaxis: {
                                        automargin: true
                                    }
                                }}
                                config={{
                                    displayModeBar: false
                                }}
                                useResizeHandler={true}
                                style={{ width: "100%" }}
                            />
                            : <div style={{ "paddingTop": "50px", "paddingBottom": "80px" }}><b>No device selected</b></div>
                    }
                </div>
            </div>
        </div>
    );
};
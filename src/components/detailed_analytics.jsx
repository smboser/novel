import React from 'react';
import Plot from 'react-plotly.js';
import moment from 'moment';
import { useState, useEffect } from "react";
import { debounce } from '@mui/material';

export const DetailedAnalytics = ({ devices, parameters, series, selectedHourly, selectedParam, setSelectedHourly, setSelectedParam }) => {
    const [deviceList, setDeviceList] = useState([]);
    const [organizedSerieData, setOrganizedSerieData] = useState([]);


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
        series.forEach(ser => {
            let xArr = [];
            let yArr = [];
            ser.data.forEach(s => {
                let cdt = moment(s.timestamp);
                let yval = s[selectedParam];
                if (cdt.diff(pdt, 'seconds') > 0 && yval) {
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
                    name: ser.devName,
                });
            }
        });
        setOrganizedSerieData(sd);
    };

    useEffect(() => {
        console.log(`Inside useEffect for  DetailedAnalytics`);
        let devList = devices.map((dev)=>{ return {"devName": dev, isChecked: true}});
        setDeviceList(devList);
        detailedAnalyticsData();
    }, []);

    useEffect(() => {
        console.log(`Inside useEffect for  DetailedAnalytics`);
        detailedAnalyticsData();
    }, [selectedHourly,selectedParam, deviceList]);

    const handleCheckboxChange = (event) => {
        event.stopPropagation();
        event.preventDefault();
        console.log("--- Inside handleCheckboxChange ---");
        debugger
        let value = event.target.value;
        let index = deviceList.findIndex(device => device.devName === value);
        deviceList[index]["isChecked"] = !deviceList[index]["isChecked"];
        setDeviceList(deviceList);
    };

    const handleHourlyFilterChange = (event) => {
        console.log("--- Inside handleHourlyFilterChange ---");
        setSelectedHourly(event.target.value);
    };

    const handleParamFilterChange = (event) => {
        console.log("--- Inside handleParamFilterChange ---")
        setSelectedParam(event.target.value);
    };





    return (
        <div className="row respodr">
            <div className="col-md-3 col-sm-2 col-xs-12">
                <div className="dbb boxh onesec" style={{ "padding": "10px 15px", "height": "260px" }}>
                    <h2 className="dev_ttl" style={{ "fontSize": "14px" }}>Devices</h2>
                    <div className="list" style={{ marginTop: "20px" }}>
                        <ul>
                            {deviceList.map((device, i) => {
                                return (
                                    <li key={i}>
                                        <input
                                            type="checkbox"
                                            id={`custom-checkbox-${i}`}
                                            name={device.devName}
                                            value={device.devName}
                                            checked={device.isChecked}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label>{device.devName}</label>
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
                                {parameters.map((parameter, i) => {
                                    return (
                                        <option key={i} value={parameter.key}>{parameter.name}</option>
                                    )
                                })};
                            </select>
                        </div>
                    </div>
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
                </div>
            </div>
        </div>
    );
};
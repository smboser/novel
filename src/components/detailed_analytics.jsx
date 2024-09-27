import React from 'react';
import Plot from 'react-plotly.js';
import moment from 'moment';
import { useState, useEffect } from "react";

export const DetailedAnalytics = ({ settings, devices, selectedDevices, series, selectedHourly, selectedParam, setSelectedHourly, setSelectedParam }) => {
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
        devices.forEach(device => {
            let xArr = [];
            let yArr = [];
            // If device is not in the selected list
            if (!selectedDevices.includes(device)) {
                return;
            }
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
        detailedAnalyticsData();
    }, []);

    useEffect(() => {
        console.log(`Inside useEffect for  DetailedAnalytics`);
        detailedAnalyticsData();
    }, [selectedHourly, selectedParam, selectedDevices]);



    const handleHourlyFilterChange = (event) => {
        console.log("--- Inside handleHourlyFilterChange ---");
        setSelectedHourly(event.target.value);
    };

    const handleParamFilterChange = (event) => {
        console.log("--- Inside handleParamFilterChange ---")
        setSelectedParam(event.target.value);
    };

    return (
        <>
            <div className="row">
                <div className="col-xs-12">
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

                    <select
                        name="type_filter"
                        value={selectedParam}
                        onChange={handleParamFilterChange}
                        style={{"marginLeft":"10px"}}>
                        {Object.keys(settings).map((setname, i) => {
                            let setting = settings[setname];
                            return (
                                <option key={i} value={setting.parameter}>{setting.name}</option>
                            )
                        })}
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
        </>
    );
};
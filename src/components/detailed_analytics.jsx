import React from 'react';
import Plot from 'react-plotly.js';
import moment from 'moment';
import { useState, useEffect } from "react";

export const DetailedAnalytics = ({ devices, parameters, series, default_parameter }) => {
    const [selectedDevices, setSelectedDevices] = useState(devices);
    const [selectedParam, setSelectedParam] = useState(default_parameter);
    const [serData, setSerData] = useState([]);
    useEffect(() => {
        let sd = [];
        series.forEach(ser => {
            let xArr = [];
            let yArr = [];
            ser.data.forEach(s => {
                xArr.push(moment(s.timestamp).format('YYYY-MM-DD h:mm:ss'));
                yArr.push(s[selectedParam]);
            });
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
        });
        console.log(sd);
        setSerData(sd);
    }, []);


    const handleCheckboxChange = (event) => {
        event.stopPropagation();
        event.preventDefault();
        let deves = selectedDevices;
        let dev = event.target.value;
        debugger;
        if(deves.includes(dev)) {
            let index = deves.indexOf(dev);
            deves.splice(index, 1);
        } else {
            deves.push(dev);
        }
        setSelectedDevices(deves);
    };

    return (
        <div className="row respodr">
            <div className="col-md-3 col-sm-2 col-xs-12">
                <div className="dbb boxh onesec" style={{ "padding": "10px 15px", "height": "260px" }}>
                    <h2 className="dev_ttl" style={{ "fontSize": "14px" }}>Devices</h2>
                    <div className="list" style={{ marginTop: "20px" }}>
                        <ul>
                            {selectedDevices.map((device, i) => {
                                return (
                                    <li key={i}>
                                        <input
                                            type="checkbox"
                                            value={device}
                                            defaultChecked={(selectedDevices.includes(device))}
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
                            <select name="hourly_filter" id="hourly_filter">
                                <option value="last_hour">Last hour</option>
                                <option value="last_12_hour">Last 12 hours</option>
                                <option value="last_24_hour">Last 24 hours</option>
                                <option value="last_48_hour">Last 48 hours</option>
                                <option value="last_week">Last Week</option>
                            </select>
                        </div>
                        <div className="col-md-3 col-sm-3 col-xs-12 chtsel">
                            <select name="type_filter" id="type_filter">
                                {parameters.map((parameter, i) => {
                                    return (
                                        <option key={i} value={parameter.key}>{parameter.name}</option>
                                    )
                                })};
                            </select>
                        </div>
                    </div>
                    <Plot
                        data={serData}
                        layout={{
                            height: 200,
                            margin: {
                                l: 30,
                                r: 30,
                                b: 30,
                                t: 30,
                                pad: 5
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
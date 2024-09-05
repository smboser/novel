import React from 'react';
import Plot from 'react-plotly.js';
import { Navbar } from "../components/nav";
import { GaugeChart } from "../components/GaugeChart";

export const ReportPage = () => {
    var trace1 = {
        x: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        y: [10, 15, 13, 17, 10, 5, 6],
        type: 'scatter',
        marker: {
            color: 'rgb(219, 64, 82)',
            size: 5
        },
        line: {
            color: 'rgb(219, 64, 82)',
            width: 1
        },
        name: 'Line 1',
    };

    var trace2 = {
        x: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        y: [16, 5, 11, 9, 11, 12, 3],
        type: 'scatter',
        marker: {
            color: 'rgb(55, 128, 191)',
            size: 5
        },
        line: {
            color: 'rgb(55, 128, 191)',
            width: 1
        },
        name: 'Line 2',
    };

    var trace3 = {
        x: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        y: [21, 16, 25, 19, 28, 32, 29],
        type: 'scatter',
        marker: {
            color: 'rgb(255, 217, 102)',
            size: 5
        },
        line: {
            color: 'rgb(255, 217, 102)',
            width: 1
        },
        name: 'Line 3',
    };


    return (
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
                                        <h2 className="dev_ttlmain">All devices average</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="centerwrapperbox">
                                <div className="chartbox dbb">
                                    <div className="row">
                                        <div className="col-md-3 col-sm-6 col-xs-12">
                                            <GaugeChart title="Temperature" />
                                        </div>
                                        <div className="col-md-3 col-sm-6 col-xs-12">
                                            <GaugeChart title="Humidity" />
                                        </div>
                                        <div className="col-md-3 col-sm-6 col-xs-12">
                                            <GaugeChart title="CO2" />
                                        </div>
                                        <div className="col-md-3 col-sm-6 col-xs-12">
                                            <GaugeChart title="TVOC" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="centerwrapperbox ptopten">
                                <div className="row">
                                    <div className="col-md-4 col-sm-4 col-xs-12">
                                        <div className="dbb ttlcent">
                                            <h2><img src="images/temp.jpg" />Temperature Alert</h2>
                                            <h3>Kol 1</h3>
                                            <div className="temp">40<sup>0</sup>C</div>
                                            <p>Kol 1 has exceed</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-sm-4 col-xs-12">
                                        <div className="dbb ttlcent">
                                            <h2><img src="images/temp.jpg" />Temperature Alert</h2>
                                            <h3>Kol 1</h3>
                                            <div className="temp">40<sup>0</sup>C</div>
                                            <p>Kol 1 has exceed</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-sm-4 col-xs-12">
                                        <div className="dbb ttlcent">
                                            <h2><img src="images/temp.jpg" />Temperature Alert</h2>
                                            <h3>Kol 1</h3>
                                            <div className="temp">40<sup>0</sup>C</div>
                                            <p>Kol 1 has exceed</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="centerwrapperbox ptopten">
                                <h2 className="dev_ttlmain">Detailed Analytics</h2>
                                <div className="row respodr">
                                    <div className="col-md-3 col-sm-2 col-xs-12">
                                        <div className="dbb boxh onesec" style={{"padding":"10px 15px","height":"260px"}}>
                                            <h2 className="dev_ttl" style={{"fontSize":"14px"}}>Devices</h2>
                                            <div className="list" style={{marginTop:"20px"}}>
                                                <ul>
                                                    <li><input type="checkbox" value="device-1"  checked/> <label>Device 1</label></li>
                                                    <li><input type="checkbox" value="device-2"  checked/> <label>Device 2</label></li>
                                                    <li><input type="checkbox" value="device-3"  checked/> <label>Device 3</label></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-9 col-sm-8 col-xs-12" style={{"paddingRight": "5px"}}>
                                        <div className="dbb chtbox" style={{"padding":"20px 15px"}}>
                                            <div className="row">
                                                <div className="col-md-3 col-sm-3 col-xs-12 chtsel">
                                                    <select name="hourly_filter" id="hourly_filter">
                                                        <option value="volvo">Last hour</option>
                                                        <option value="volvo">Last 12 hours</option>
                                                        <option value="volvo">Last 24 hours</option>
                                                        <option value="volvo">Last 48 hours</option>
                                                        <option value="volvo">Last Week</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-3 col-sm-3 col-xs-12 chtsel">
                                                    <select name="type_filter" id="type_filter">
                                                        <option value="temperature">Temperature</option>
                                                        <option value="humidity">Humidity</option>
                                                        <option value="co2">CO2</option>
                                                        <option value="co2">TVOC</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <Plot
                                                data={[trace1, trace2, trace1, trace3]}
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
                                                style={{ width: "100%"}}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
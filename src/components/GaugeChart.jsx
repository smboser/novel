import React from 'react';
import { GaugeComponent } from 'react-gauge-component';
import { calculateAvgLatestData } from "../helper/utils";
export const GaugeChart = ({ setting, selectedDevices, last24HoursData }) => {
    let {min_value, max_value, lt, gt, parameter} = setting;
    // Calculate low thohresld and high thohresld
    let low_thohresld = Math.floor((lt) ? ((lt < min_value) ? min_value : lt) : min_value);
    let high_thohresld = Math.floor((gt) ? ((gt > max_value) ? max_value * .7 : gt) : max_value * .7);
    // Calculate average
    let avg = calculateAvgLatestData(last24HoursData, parameter, selectedDevices);
    console.log(`Inside GaugeChart component`);
    console.log(`Values of ${setting.parameter} parameter:`,setting);
    console.log(`Values of latest data :`, last24HoursData);
    console.log(`Values of min :${min_value} and max:${max_value} and low thohresld : ${low_thohresld} and high thohresld : ${high_thohresld}`);
    console.log(`Values of avg :${avg}`);

    return (
        <>
            <div className="gauge">
                <GaugeComponent
                    type="semicircle"
                    arc={{
                        width: 0.15,
                        padding: 0.005,
                        cornerRadius: 1,
                        subArcs: [
                            {
                                limit: low_thohresld,
                                color: '#F5CD19',
                                showTick: false
                            },
                            {
                                limit: high_thohresld,
                                color: '#75e64d',
                                showTick: false
                            },
                            {
                                color: '#F5CD19',
                                showTick: false
                            }
                        ]
                    }}

                    
                    pointer={{
                        color: '#345243',
                        length: 0.80,
                        width: 10,
                    }}
                    labels={{
                        valueLabel: {
                            formatTextValue: value => value,
                            hide: true
                        },
                        tickLabels: {
                            type: 'outer',
                            defaultTickValueConfig: {
                                formatTextValue: value => value,
                                style: {
                                    fontSize: "11px",
                                    fill: "#464A4F",
                                    width: "100px"
                                }
                            },
                            defaultTickLineConfig: {
                                length: 0
                            },
                            ticks: [],
                        }
                    }}
                    value={avg}
                    minValue={min_value}
                    maxValue={max_value}
                />
                <div className="info">
                    <h5>{setting.name}</h5>
                </div>
            </div>
            <div className="reading_gauge">{avg} {setting.unit}</div>
        </>
    );
};
import React from 'react';
import { GaugeComponent } from 'react-gauge-component';
export const GaugeChart = ({ setting, last24HoursData }) => {
    let min_value = setting.minValue;
    let max_value = setting.max_value;
    // Calculate low thohresld and high thohresld
    let low_thohresld = Math.floor((setting.lt) ? ((setting.lt < min_value) ? min_value : setting.lt) : min_value);
    let high_thohresld = Math.floor((setting.gt) ? ((setting.gt > max_value) ? max_value * .7 : setting.gt) : max_value * .7);
    let total = last24HoursData.reduce((accumulator, current) => {
        let curval = (current[setting.parameter]) ? current[setting.parameter] : 0
        return accumulator + curval;
    }, 0);
    let avg = Math.floor(total / last24HoursData.length);

    console.log(`Inside GaugeChart component`);
    console.log(`For setting :-----------`);
    console.log(setting);
    console.log(`For last24HoursData :-------------`);
    console.log(last24HoursData);
    console.log(`For min :${min_value} and max:${max_value} and low thohresld : ${low_thohresld} and high thohresld : ${high_thohresld}`);
    console.log(`For avg :${avg}`);

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
                                color: '#ff6666',
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
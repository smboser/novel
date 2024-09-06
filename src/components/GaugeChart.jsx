import React from 'react';
import { GaugeComponent } from 'react-gauge-component';
export const GaugeChart = ({ param, last24HoursData }) => {
    let total = last24HoursData.reduce((accumulator, current) => {
        let curval = (current[param.key]) ? current[param.key] : 0
        return accumulator + curval;
    }, 0);
    let avg = Math.floor(total / last24HoursData.length);
    return (
        <div className="gauge">
            <GaugeComponent
                type="semicircle"
                arc={{
                    width: 0.2,
                    padding: 0.005,
                    cornerRadius: 1,
                    subArcs: [
                        {
                            limit: param.upper_limit_value,
                            color: '#5BE12C',
                            showTick: false
                        },
                        {
                            color: '#EA4228',
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
                        style: {
                            fontSize: "35px",
                            fill: "red",
                            textShadow: "red 1px 1px 0px, red 0px 0px 2.5em, red 0px 0px 0.2em"
                        }
                    },
                    tickLabels: {
                        type: 'outer',
                        defaultTickValueConfig: { formatTextValue: value => value, fontSize: 10 },
                        ticks: [
                            { value: 0 },
                            { value: 50 },
                            { value: 100 }
                        ],
                    }
                }}
                value={avg}
                minValue={param.min_value}
                maxValue={param.max_value}
            />
            <div className="info">
                <h5>{param.name}</h5>
            </div>
        </div>
    );
};
import React from 'react';
import { GaugeComponent } from 'react-gauge-component';
export const GaugeChart = ({ title }) => {
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
                            limit: 70,
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
                            textShadow: "red 1px 1px 0px, red 0px 0px 2.5em, red 0px 0px 0.2em"}
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
                value={32}
                minValue={0}
                maxValue={100}
            />
            <div className="info">
                <h5>{title}</h5>
            </div>
        </div>
    );
};
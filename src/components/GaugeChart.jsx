import React from 'react';
import Plot from 'react-plotly.js';
export const GaugeChart = ({title}) => {
    var theta = 93.5;
    var r = 0.7;
    var x_head = r * Math.cos(Math.PI/180*theta);
    var y_head = r * Math.sin(Math.PI/180*theta);
    return (
        <Plot
            data={[
                {
                    mode: "gauge+number",
                    type: "indicator",
                    value: 40,
                    title: { text: title, font: { size: 12 } },
                    gauge: {
                        bgcolor: "#e63900",
                        borderwidth: 0,
                        bar: {
                            color: "blue",
                            line: {
                                color: "red",
                                width: 0
                            },
                            thickness: 0
                        },
                        axis: {
                            range: [0, 100],
                            visible: true,
                            tickmode: "array",
                            ticks: "outside"
                        },
                        steps: [
                            {
                                range: [0, 60],
                                color: "#33cc33"
                            }
                        ]
                    }
                }
            ]}
            layout={{
                height: 150,
                margin: {
                    l: 30,
                    r: 30,
                    b: 10,
                    t: 10,
                    pad: 5
                },
                xaxis: { range: [0, 1], showgrid: false, 'zeroline': false, 'visible': false },
                yaxis: { range: [0, 1], showgrid: false, 'zeroline': false, 'visible': false },
                showlegend: false,
                annotations: [
                    {
                        ax: 0.5,
                        ay: 0,
                        axref: 'x',
                        ayref: 'y',
                        x: 0.5 + x_head,
                        y: y_head,
                        xref: 'x',
                        yref: 'y',
                        showarrow: true,
                        arrowhead: 9,
                    }
                ]
            }}
            config={{
                displayModeBar:false
            }}
            useResizeHandler={true}
            style={{width: "100%", height: "100%"}}
        />
    );
};
import React from "react";
import { GaugeComponent } from "react-gauge-component";
import { calculateAvgLatestData } from "../helper/utils";
export const GaugeChart = ({ data }) => {
  let { min_value, max_value, low_thohresld, high_thohresld, paramDisplayName, unit, avg } = data;
  
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
                color: "#F5CD19",
                showTick: false,
              },
              {
                limit: high_thohresld,
                color: "#75e64d",
                showTick: false,
              },
              {
                color: "#F5CD19",
                showTick: false,
              },
            ],
          }}
          pointer={{
            color: "#345243",
            length: 0.8,
            width: 10,
          }}
          labels={{
            valueLabel: {
              formatTextValue: (value) => value,
              hide: true,
            },
            tickLabels: {
              type: "outer",
              defaultTickValueConfig: {
                formatTextValue: (value) => value,
                style: {
                  fontSize: "11px",
                  fill: "#464A4F",
                  width: "100px",
                },
              },
              defaultTickLineConfig: {
                length: 0,
              },
              ticks: [],
            },
          }}
          value={avg}
          minValue={min_value}
          maxValue={max_value}
        />
        <div className="info">
          <h5>{paramDisplayName}</h5>
        </div>
      </div>

      <div className="reading_gauge">
        {avg}{" "} {unit}
      </div>
    </>
  );
};

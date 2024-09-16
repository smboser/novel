import { useState, useEffect } from "react";
export const DeviceList = ({deviceList, selectedDeviceList, changeHandeler}) => {
    console.log("Inside devicelist component");
    const [selectedDevices, setSelectedDevices] = useState([]);
    useEffect(() => {
        setSelectedDevices(selectedDeviceList);
    }, [selectedDeviceList]);
    
    return (
        <ul style={{ "marginTop": "10px" }}>
            {
                deviceList ? deviceList.map((device, i) => {
                    return (
                        <li key={i}>
                            <input
                                type="checkbox"
                                value={device}
                                checked={selectedDevices.includes(device)} 
                                onChange={changeHandeler}
                            />
                            <label>{device}</label>
                        </li>
                    )
                })
                : <div />
            }
        </ul>
    );
};
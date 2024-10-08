import { useState, useEffect, createElement } from "react";
import { CirclesWithBar } from "react-loader-spinner";
import * as MaterialDesign from "react-icons/md";
import { Navbar } from "../components/nav";
import { Footer } from "../components/footer";
import { DeviceModel } from "../components/device_model";
import { useAuth } from "../hooks/useAuth";
import { getDevices } from "../helper/web-service";
import { differenceDate } from "../helper/utils";

export const DevicePage = () => {
  const { user } = useAuth();
  const [isLoaderVisible, setLoaderVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedDeviceType, setSelectedDeviceType] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [orgDevices, setOrgDevices] = useState([]);
  const [devices, setDevices] = useState([]);
  const [deviceTypes, setDeviceTypes] = useState([]);

  useEffect(() => {
    setLoaderVisible(true);
    getDevices(user).then((data) => {
      let devices = data.value;
      let dTypes = [...new Set(devices.map((device) => device.deviceType))];
      setDevices(devices);
      setOrgDevices(devices);
      setDeviceTypes(dTypes);
      setLoaderVisible(false);
    });
  }, []);

  const handleChange = (event) => {
    let type = event.target.value;
    let deves = orgDevices.filter((device) => {
      if (type) {
        return device.deviceType === type;
      } else {
        return true;
      }
    });
    setDevices(deves);
    setSelectedDeviceType(event.target.value);
  };

  const handleModelClose = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setOpen(false);
  };

  return (
    <>
      <CirclesWithBar
        color="#00bfff"
        height="70"
        width="70"
        wrapperClass="loader"
        visible={isLoaderVisible}
      />
      <div className="formbodymain">
        <div className="row">
          <div className="col-md-12 col-sm-12 col-xs-12">
            <Navbar />
          </div>

          <div className="col-md-12 col-sm-12 col-xs-12">
            <div className="x_panel">
              <div className="col-md-12 col-sm-12 col-xs-12">
                <div className="ttl_main">
                  <h2>
                    <strong>Device Settings</strong>
                  </h2>
                </div>
                <div className="row">
                  <div className="col-md-6 col-sm-6 col-xs-6">
                    <p className="text-muted font-13 m-b-30">
                      {devices.length} Devices
                    </p>
                  </div>
                  <div className="col-md-6 col-sm-6 col-xs-6 txtrgt">
                    <select value={selectedDeviceType} onChange={handleChange}>
                      <option value="">Filter Device Type</option>
                      {deviceTypes.map((type, i) => {
                        return (
                          <option value={type} key={i}>
                            {type}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
              <div className="x_content">
                <table id="datatable" className="table table-striped">
                  <thead>
                    <tr>
                      <th>Device Name</th>
                      <th>Last Update</th>
                      <th>Device Type</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {devices.map((device, i) => {
                      let delta = differenceDate(
                        new Date(device.lastUpdate),
                        new Date()
                      );
                      return (
                        <tr key={i}>
                          <td>
                            <MaterialDesign.MdAir color="#00bdd5" size={20} />{" "}
                            {device.devName}
                          </td>
                          <td>{delta}</td>
                          <td>{device.deviceType}</td>
                          <th>
                            <img
                              src="images/eye.jpg"
                              data-device={JSON.stringify(device)}
                              onClick={(event) => {
                                event.stopPropagation();
                                event.preventDefault();
                                let device = null;
                                try {
                                  device = JSON.parse(
                                    event.target.getAttribute("data-device")
                                  );
                                } catch (err) {
                                  console.log(
                                    "Error occurred to parse the data-device"
                                  );
                                }
                                setOpen(true);
                                setSelectedDevice(device);
                              }}
                            />
                          </th>
                          <td></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedDevice != null ? (
        <DeviceModel
          isOpen={isOpen}
          closeModel={handleModelClose}
          device={selectedDevice}
        />
      ) : (
        ""
      )}
      <Footer />
    </>
  );
};

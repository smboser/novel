import React, { useState, useEffect } from "react";
import { Navbar } from "../components/nav";
import { Footer } from "../components/footer";
import { useAuth } from "../hooks/useAuth";
import { InputAdornment, OutlinedInput, Button } from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";
import { useQuery } from "react-query";
import axios from "axios";
import { filterLatestAlerts } from "../helper/utils";
import {
  setAdvisorySettings,
  getAdvisorySettings
} from "../helper/web-service";
import styles from "./SettingPage.module.css";
import { toast, Toaster } from "react-hot-toast";
import { CirclesWithBar } from "react-loader-spinner";
import SwitchComponent from "../components/SwitchComponent";
import { APP_CONST } from "../helper/application-constant";
import { min } from "date-fns";

export const SettingPage = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState([]);
  const [isLoaderVisible, setLoaderVisible] = useState(false);
  const [showSuccMsg, setShowSuccMsg] = useState(false);
  const [showErrMsg, setShowErrMsg] = useState(false);
  const [isEligibleForSave, setIsEligibleForSave] = useState(false);
  const [isEligibleDevEUIForSave, setIsEligibleDevEUIForSave] = useState(false);
  const [isEligibleParameterForSave, setIsEligibleParameterForSave] = useState(false);
  const [errors, setErrors] = useState({});

  const farmer_companies = APP_CONST.farmer_companies;
  const orgName = user.orgName;
  // Fetch data inside the component
  const fetchAlertData = async () => {
    const apiUrl = getAdvisorySettings(user);
    const response = await axios.get(apiUrl);
    return response.data.value;
  };

  const { data, isLoading, error } = useQuery("alertData", fetchAlertData);

  // Update state when data is fetched
  useEffect(() => {
    if (data) {
      const organizedData = {};
      data.forEach((dt) => {
        let devEUI = dt.devEUI;
        if (!organizedData[devEUI]) {
          organizedData[devEUI] = [];
        }
        organizedData[devEUI].push({
          min_value: dt.min_value,
          max_value: dt.max_value,
          avg_value: dt.avg_value,
          currentMinAlert: dt.currentMinAlert,
          currentMaxAlert: dt.currentMaxAlert,
          alertActive: dt.alertActive,
          parameter: dt.parameter,
          orgName: dt.orgName,
          paramDisplayName: dt.paramDisplayName,
          repeatedAlert: dt.repeatedAlert
        })
      });
      const settingsData = Object.entries(organizedData).map(
        ([
          devEUI,
          parameters,
        ]) => ({
          devEUI,
          parameters
        })
      );
      setSettings(settingsData);
    }
  }, [data, user]);

  useEffect(() => {
    console.log("settings", settings);
  }, [settings]);

  // Validate the lt and gt values based on APP_CONST parameters
  const validateValues = (devEUI, parameterKey, field, value) => {
    const selectedDevice = settings.find((s) => s?.devEUI === devEUI);
    const selectedSetting = selectedDevice.parameters.find((s) => s?.parameter === parameterKey);
    let isValid = true;
    let errorMsg = "";
    switch (field) {
      case "currentMinAlert":
        if (selectedSetting?.min_value > value) {
          isValid = false;
          errorMsg = `Low Threshold should be more than or equal ${selectedSetting.min_value}`;
        }
        if (selectedSetting?.currentMaxAlert <= value) {
          isValid = false;
          errorMsg = `Low Threshold should be less than ${selectedSetting.currentMaxAlert}`;
        }
        break;
      case "currentMaxAlert":
        if (selectedSetting?.max_value < value) {
          isValid = false;
          errorMsg = `High Threshold should be less than or equal ${selectedSetting.max_value}`;
        }
        if (selectedSetting?.currentMinAlert >= value) {
          isValid = false;
          errorMsg = `High Threshold should be more than ${selectedSetting.currentMinAlert}`;
        }
        break;
      case "min_value":
        if (selectedSetting?.currentMinAlert < value) {
          isValid = false;
          errorMsg = `Minimum value should be less than or equal ${selectedSetting.currentMinAlert}`;
        }
        break;
      case "max_value":
        if (selectedSetting?.currentMaxAlert > value) {
          isValid = false;
          errorMsg = `Minimum value should be less than or equal ${selectedSetting.currentMaxAlert}`;
        }
        break;
      default:
        isValid = true;
        errorMsg = "";
    }
    return { isValid, errorMsg };
  };

  const handleSave = async (isLoaderVisible = true, devEUI, parameter) => {
    if (isLoaderVisible) setLoaderVisible(true);
    const apiSaveUrl = setAdvisorySettings(user);
    try {
      let selectedDevice = settings.find((s) => s?.devEUI === devEUI);
      let selectedSetting = selectedDevice.parameters.find((s) => s?.parameter === parameter);
      selectedSetting = {...selectedSetting, devEUI: devEUI};
      console.log("selectedSetting :", selectedSetting);
      if (selectedSetting.length === 0) {
        toast.warn("No settings to save.");
        return;
      }
      await axios.post(apiSaveUrl, selectedSetting);
      toast.success("Settings saved successfully!");
      setShowSuccMsg(true);
      setLoaderVisible(false);
    } catch (err) {
      toast.error("Error saving settings. Please try again.");
      setShowErrMsg(true);
      setLoaderVisible(false);
    }
  };

  // Auto-save on blur
  const handleBlur = async (devEUI, parameter, field, value) => {
    const { isValid, errorMsg } = validateValues(devEUI, parameter, field, value);
    if (isValid) {
      const updatedSettings = settings.map((s) => {
        if (s.devEUI === devEUI) {
          s.parameters.map((p) => {
            if (p.parameter === parameter) {
              p[field] = Number(value);
            }
            return p;
          })
        }
        return s;
      });
      setSettings(updatedSettings);
      setErrors((prev) => ({ ...prev, [`${parameter}_${field}`]: false }));
      setIsEligibleDevEUIForSave(devEUI);
      setIsEligibleParameterForSave(parameter);
      setIsEligibleForSave(true);
    } else {
      toast.error(errorMsg);
      setErrors((prev) => ({ ...prev, [`${parameter}_${field}`]: true }));
      // TODO: Re-render the form with its original values
    }
  };

  useEffect(() => {
    setLoaderVisible(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (isEligibleForSave !== false) {
      let devEUI = isEligibleDevEUIForSave;
      let parameter = isEligibleParameterForSave;
      setIsEligibleForSave(false);
      setIsEligibleParameterForSave(false);
      setIsEligibleDevEUIForSave(false);
      handleSave(false, devEUI, parameter);
    }
  }, [isEligibleForSave, isEligibleDevEUIForSave, isEligibleParameterForSave]);

  useEffect(() => {
    setTimeout(() => {
      if (showSuccMsg || showErrMsg) {
        setShowErrMsg(false);
        setShowSuccMsg(false);
      }
    }, 5000);
  }, [showSuccMsg, showErrMsg]);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
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
          <div className="col-md-12 col-sm-12 col-xs-12"></div>
          <div className="">
            <div className="col-md-12 col-sm-12 col-xs-12 report" id="style-3">
              <div className="x_panel">
                <div className="col-md-12 col-sm-12 col-xs-12">
                  <div className="ttl_main">
                    <h2>
                      <strong>Advisory Setting</strong>
                    </h2>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 col-sm-12 col-xs-12">
                    <div className="centerwrapperbox">
                      <h2 className="dev_ttlmain"> </h2>
                    </div>
                  </div>
                </div>
                <div>
                  {settings.map((setting, index) => (
                    <div key={index}>
                      <h5>{setting.devEUI}</h5>
                      <div className="chartbox dbb">
                        <table
                          id="datatable"
                          className={`table table-striped table-bordered ${styles.table}`}
                        >
                          <thead>
                            <tr>
                              <th style={{ textAlign: "center" }}>Active</th>
                              <th style={{ textAlign: "center" }}>Alert</th>
                              <th style={{ textAlign: "center" }}>Minimum</th>
                              <th style={{ textAlign: "center" }}>Low Threshold</th>
                              <th style={{ textAlign: "center" }}>
                                High Threshold
                              </th>
                              <th style={{ textAlign: "center" }}>Maximum</th>
                            </tr>
                          </thead>
                          <tbody>
                            {setting.parameters.map((param, index) => (
                              <tr key={index}>
                                <td>
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      checked={param.alertActive}
                                      onChange={(e) => {
                                        setSettings((prev) => {
                                          prev.map((s) => {
                                            if (s.devEUI === setting.devEUI) {
                                              s.parameters.map((p) => {
                                                if (p.parameter === param.parameter) {
                                                  p.alertActive = e.target.checked;
                                                }
                                                return p;
                                              })
                                            }
                                            return s;
                                          })
                                          return prev;
                                        });
                                        setIsEligibleDevEUIForSave(setting.devEUI);
                                        setIsEligibleParameterForSave(param.parameter);
                                        setIsEligibleForSave(true);
                                      }}
                                    />
                                    <span className="slider round"></span>
                                  </label>
                                </td>
                                <td>
                                  <span>{param.paramDisplayName}</span>
                                  <input type="hidden" value={param.parameter} />
                                </td>
                                <td className={styles.settings_input}>
                                  {param.parameter === "leakage_status" ? (
                                    <div className={styles.switch_container}>
                                      <span>OFF</span>
                                      <label className="switch">
                                        <input
                                          type="checkbox"
                                          checked={
                                            param.min_value > 0 && param.max_value > 0
                                          }
                                          onChange={(e) => {
                                            setSettings((prev) => {
                                              prev.map((s) => {
                                                if (s.devEUI === setting.devEUI) {
                                                  s.parameters.map((p) => {
                                                    if (p.parameter === param.parameter) {
                                                      p.min_value = e.target.checked ? 1 : 0;
                                                      p.max_value = e.target.checked ? 1 : 0;
                                                    }
                                                    return p;
                                                  })
                                                }
                                                return s;
                                              })
                                              return prev;
                                            });
                                            setIsEligibleDevEUIForSave(setting.devEUI);
                                            setIsEligibleParameterForSave(param.parameter);
                                            setIsEligibleForSave(true);
                                          }}
                                        />
                                        <span className="slider round"></span>
                                      </label>
                                      <span>ON</span>
                                    </div>
                                  ) : (
                                    <OutlinedInput
                                      startAdornment={
                                        <InputAdornment position="start">
                                          <ErrorOutline style={{ color: "red" }} />
                                        </InputAdornment>
                                      }
                                      defaultValue={param.min_value}
                                      onBlur={(e) =>
                                        handleBlur(
                                          setting.devEUI,
                                          param.parameter,
                                          "min_value",
                                          e.target.value
                                        )
                                      }
                                      disabled={!param.alertActive}
                                      error={
                                        errors[`${param.parameter}_min_value`] || false
                                      }
                                      style={{
                                        borderColor: errors[
                                          `${param.parameter}_min_value`
                                        ]
                                          ? "red"
                                          : "",
                                        borderWidth: errors[
                                          `${param.parameter}_min_value`
                                        ]
                                          ? "2px"
                                          : "",
                                      }}
                                      aria-describedby="outlined-weight-helper-text"
                                    />
                                  )}
                                </td>
                                <td className={styles.settings_input}>
                                  {param.parameter !== "leakage_status" ? (
                                    <OutlinedInput
                                      startAdornment={
                                        <InputAdornment position="start">
                                          <ErrorOutline style={{ color: "red" }} />
                                        </InputAdornment>
                                      }
                                      defaultValue={param.currentMinAlert}
                                      onBlur={(e) =>
                                        handleBlur(
                                          setting.devEUI,
                                          param.parameter,
                                          "currentMinAlert",
                                          e.target.value
                                        )
                                      }
                                      disabled={!param.alertActive}
                                      error={
                                        errors[`${param.parameter}_currentMinAlert`] || false
                                      }
                                      style={{
                                        borderColor: errors[
                                          `${param.parameter}_currentMinAlert`
                                        ]
                                          ? "red"
                                          : "",
                                        borderWidth: errors[
                                          `${param.parameter}_currentMinAlert`
                                        ]
                                          ? "2px"
                                          : "",
                                      }}
                                      aria-describedby="outlined-weight-helper-text"
                                    />
                                  ) : (
                                    ""
                                  )}
                                </td>
                                <td className={styles.settings_input}>
                                  {param.parameter !== "leakage_status" ? (
                                    <OutlinedInput
                                      startAdornment={
                                        <InputAdornment position="start">
                                          <ErrorOutline style={{ color: "red" }} />
                                        </InputAdornment>
                                      }
                                      defaultValue={param.currentMaxAlert}
                                      onBlur={(e) =>
                                        handleBlur(
                                          setting.devEUI,
                                          param.parameter,
                                          "currentMaxAlert",
                                          e.target.value
                                        )
                                      }
                                      disabled={!param.alertActive}
                                      error={
                                        errors[`${param.parameter}_currentMaxAlert`] || false
                                      }
                                      style={{
                                        borderColor: errors[
                                          `${param.parameter}_currentMaxAlert`
                                        ]
                                          ? "red"
                                          : "",
                                        borderWidth: errors[
                                          `${param.parameter}_currentMaxAlert`
                                        ]
                                          ? "2px"
                                          : "",
                                      }}
                                      aria-describedby="outlined-weight-helper-text"
                                    />
                                  ) : (
                                    ""
                                  )}
                                </td>
                                <td className={styles.settings_input}>
                                  {param.parameter !== "leakage_status" ? (
                                    <OutlinedInput
                                      startAdornment={
                                        <InputAdornment position="start">
                                          <ErrorOutline style={{ color: "red" }} />
                                        </InputAdornment>
                                      }
                                      defaultValue={param.max_value}
                                      onBlur={(e) =>
                                        handleBlur(
                                          setting.devEUI,
                                          param.parameter,
                                          "max_value",
                                          e.target.value
                                        )
                                      }
                                      disabled={!param.alertActive}
                                      error={
                                        errors[`${param.parameter}_max_value`] || false
                                      }
                                      style={{
                                        borderColor: errors[
                                          `${param.parameter}_max_value`
                                        ]
                                          ? "red"
                                          : "",
                                        borderWidth: errors[
                                          `${param.parameter}_max_value`
                                        ]
                                          ? "2px"
                                          : "",
                                      }}
                                      aria-describedby="outlined-weight-helper-text"
                                    />
                                  ) : (
                                    ""
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}


                  <div className="row">
                    <div className="col-md-12 col-sm-12 col-xs-12">
                      <div
                        className="dev_ttlmain"
                        style={{ paddingTop: "5px" }}
                      >
                        Should autosave as well on change...
                        {showSuccMsg ? (
                          <span className={styles.succ_msg}>
                            Settings saved successfully
                          </span>
                        ) : (
                          ""
                        )}
                        {showErrMsg ? (
                          <span className={styles.err_msg}>
                            Error saving settings. Please try again.
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {farmer_companies.includes(orgName) ? (
          <div className="col-md-12 col-sm-12 col-xs-12">
            <SwitchComponent />
          </div>
        ) : (
          ""
        )}

      </div>
      <Footer />
    </>
  );
};

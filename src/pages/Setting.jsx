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
  getAdvisorySettings,
  getMinMaxAdvisorySettings,
} from "../helper/web-service";
import styles from "./SettingPage.module.css";
import { toast, Toaster } from "react-hot-toast";
import { CirclesWithBar } from "react-loader-spinner";

export const SettingPage = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState([]);
  const [isLoaderVisible, setLoaderVisible] = useState(false);
  const [showSuccMsg, setShowSuccMsg] = useState(false);
  const [showErrMsg, setShowErrMsg] = useState(false);
  const [minMaxResult, setMinMaxResult] = useState([]);
  const [isEligibleForSave, setIsEligibleForSave] = useState(false);

  // Fetch data inside the component
  const fetchAlertData = async () => {
    const apiUrl = getAdvisorySettings(user);
    const response = await axios.get(apiUrl);
    if (response?.data?.value) {
      // calling min / max api
      const minMaxApiUrl = getMinMaxAdvisorySettings(user);
      const result = await axios.get(minMaxApiUrl);
      setMinMaxResult(result?.data?.value ?? []);
    }
    return response.data.value;
  };

  const { data, isLoading, error } = useQuery("alertData", fetchAlertData);

  // Update state when data is fetched
  useEffect(() => {
    if (data && minMaxResult) {
      const modifiedData = filterLatestAlerts(data);
      const organizedData = modifiedData.reduce((acc, alert) => {
        if (!acc[alert.paramDisplayName]) {
          acc[alert.paramDisplayName] = {
            lt: "",
            gt: "",
            active: alert.active,
            parameter: alert.parameter,
            orgName: user.orgName,
          };
        }
        if (alert.func === "lt") {
          acc[alert.paramDisplayName].lt = alert.level || 0;
        } else if (alert.func === "gt") {
          acc[alert.paramDisplayName].gt = alert.level || 0;
        }
        return acc;
      }, {});
      const settingsData = Object.entries(organizedData).map(
        ([paramDisplayName, { lt, gt, active, parameter, orgName }]) => ({
          parameter,
          paramDisplayName,
          lt,
          gt,
          active,
          orgName,
        })
      );
      settingsData.forEach((s) => {
        s["min"] = minMaxResult.find(
          (mm) => mm.parameter === s.parameter
        )?.min_value;
        s["max"] = minMaxResult.find(
          (mm) => mm.parameter === s.parameter
        )?.max_value;
      });
      setSettings(settingsData);
    }
  }, [minMaxResult, user]);

  useEffect(() => {
    console.log("settings", settings);
  }, [settings]);

  // Validate the lt and gt values based on APP_CONST parameters
  const validateValues = (parameterKey, field, value) => {
    const selectedSetting = settings.find((s) => s?.parameter === parameterKey);
    let isValid = true;
    let errorMsg = "";
    switch (field) {
      case "lt":
        if (selectedSetting?.min > value) {
          isValid = false;
          errorMsg = `Low Threshold should be more than or equal ${selectedSetting.min}`;
        }
        if (selectedSetting?.gt <= value) {
          isValid = false;
          errorMsg = `Low Threshold should be less than ${selectedSetting.gt}`;
        }
        break;
      case "gt":
        if (selectedSetting?.max < value) {
          isValid = false;
          errorMsg = `High Threshold should be less than or equal ${selectedSetting.max}`;
        }
        if (selectedSetting?.lt >= value) {
          isValid = false;
          errorMsg = `High Threshold should be more than ${selectedSetting.lt}`;
        }
        break;
      case "min":
        if (selectedSetting?.lt < value) {
          console.log("here");
          isValid = false;
          errorMsg = `Minimum value should be less than or equal ${selectedSetting.lt}`;
        }
        break;
      case "max":
        if (selectedSetting?.gt > value) {
          isValid = false;
          errorMsg = `Minimum value should be less than or equal ${selectedSetting.lt}`;
        }
        break;
      default:
        isValid = true;
        errorMsg = "";
    }
    return { isValid, errorMsg };
  };

  const handleSave = async (isLoaderVisible = true) => {
    if (isLoaderVisible) setLoaderVisible(true);
    const apiSaveUrl = setAdvisorySettings(user);
    try {
      const filteredSettings = settings.flatMap(
        ({ parameter, lt, gt, min, max, active, orgName }) => {
          const results = [];

          // Create a result entry for lt if it exists
          if (typeof lt !== undefined) {
            results.push({
              active,
              parameter,
              orgName,
              min: Number(min),
              max: Number(max),
              func: "lt",
              level: Number(lt),
            });
          }

          // Create a result entry for gt if it exists
          if (typeof gt !== undefined) {
            results.push({
              active,
              parameter,
              orgName,
              min: Number(min),
              max: Number(max),
              func: "gt",
              level: Number(gt),
            });
          }

          return results;
        }
      );

      if (filteredSettings.length === 0) {
        toast.warn("No settings to save.");
        return;
      }

      await axios.post(apiSaveUrl, { settings: filteredSettings });
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
  const handleBlur = async (parameter, field, value) => {
    const { isValid, errorMsg } = validateValues(parameter, field, value);
    console.log("isValid", isValid);
    if (isValid) {
      const updatedSettings = settings.map((s) =>
        s.parameter === parameter ? { ...s, [field]: Number(value) } : s
      );
      console.log("updatedSettings", updatedSettings);
      setSettings(updatedSettings);
      setIsEligibleForSave(true);
      // await handleSave(false);
    } else {
      toast.error(errorMsg);
      // alert(errorMsg);
    }
  };

  useEffect(() => {
    setLoaderVisible(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (isEligibleForSave !== false) {
      console.log("setIsEligibleForSave", isEligibleForSave);
      setIsEligibleForSave(false);
      handleSave(false);
    }
  }, [isEligibleForSave]);

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
      <Navbar />
      <div className="formbodymain">
        <div className="row">
          <div className="col-md-12 col-sm-12 col-xs-12"></div>
          <div className="">
            <div className="col-md-12 col-sm-12 col-xs-12 report" id="style-3">
              <div className="x_panel">
                <div className="col-md-12 col-sm-12 col-xs-12">
                  <div className="ttl_main center">
                    <h2 style={{ textAlign: "center" }}>Advisory Setting</h2>
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
                        {settings.map((setting, index) => (
                          <tr key={index}>
                            <td>
                              <label className="switch">
                                <input
                                  type="checkbox"
                                  checked={setting.active}
                                  onChange={(e) => {
                                    setSettings((prev) =>
                                      prev.map((s) =>
                                        s.parameter === setting.parameter
                                          ? { ...s, active: e.target.checked }
                                          : s
                                      )
                                    );
                                    setIsEligibleForSave(true);
                                  }}
                                />
                                <span className="slider round"></span>
                              </label>
                            </td>
                            <td>
                              <span>{setting.paramDisplayName}</span>
                              <input type="hidden" value={setting.parameter} />
                            </td>
                            <td className={styles.settings_input}>
                              <OutlinedInput
                                startAdornment={
                                  <InputAdornment position="start">
                                    <ErrorOutline style={{ color: "red" }} />
                                  </InputAdornment>
                                }
                                defaultValue={setting.min}
                                // onChange={(e) => {
                                //   setSettings((prev) =>
                                //     prev.map((s) =>
                                //       s.parameter === setting.parameter
                                //         ? { ...s, min: e.target.value }
                                //         : s
                                //     )
                                //   );
                                // }}
                                onBlur={(e) =>
                                  handleBlur(
                                    setting.parameter,
                                    "min",
                                    e.target.value
                                  )
                                }
                                disabled={!setting.active}
                                aria-describedby="outlined-weight-helper-text"
                              />
                            </td>
                            <td className={styles.settings_input}>
                              <OutlinedInput
                                startAdornment={
                                  <InputAdornment position="start">
                                    <ErrorOutline style={{ color: "red" }} />
                                  </InputAdornment>
                                }
                                defaultValue={setting.lt}
                                // onChange={(e) => {
                                //   setSettings((prev) =>
                                //     prev.map((s) =>
                                //       s.parameter === setting.parameter
                                //         ? { ...s, lt: e.target.value }
                                //         : s
                                //     )
                                //   );
                                // }}
                                onBlur={(e) =>
                                  handleBlur(
                                    setting.parameter,
                                    "lt",
                                    e.target.value
                                  )
                                }
                                disabled={!setting.active}
                                aria-describedby="outlined-weight-helper-text"
                              />
                            </td>
                            <td className={styles.settings_input}>
                              <OutlinedInput
                                startAdornment={
                                  <InputAdornment position="start">
                                    <ErrorOutline style={{ color: "red" }} />
                                  </InputAdornment>
                                }
                                defaultValue={setting.gt}
                                // onChange={(e) => {
                                //   setSettings((prev) =>
                                //     prev.map((s) =>
                                //       s.parameter === setting.parameter
                                //         ? { ...s, lt: e.target.value }
                                //         : s
                                //     )
                                //   );
                                // }}
                                onBlur={(e) =>
                                  handleBlur(
                                    setting.parameter,
                                    "gt",
                                    e.target.value
                                  )
                                }
                                disabled={!setting.active}
                                aria-describedby="outlined-weight-helper-text"
                              />
                            </td>
                            <td className={styles.settings_input}>
                              <OutlinedInput
                                startAdornment={
                                  <InputAdornment position="start">
                                    <ErrorOutline style={{ color: "red" }} />
                                  </InputAdornment>
                                }
                                defaultValue={setting.max}
                                // onChange={(e) => {
                                //   setSettings((prev) =>
                                //     prev.map((s) =>
                                //       s.parameter === setting.parameter
                                //         ? { ...s, max: e.target.value }
                                //         : s
                                //     )
                                //   );
                                // }}
                                onBlur={(e) =>
                                  handleBlur(
                                    setting.parameter,
                                    "max",
                                    e.target.value
                                  )
                                }
                                disabled={!setting.active}
                                aria-describedby="outlined-weight-helper-text"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Button
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                    style={{ color: "#ffffff", verticalAlign: "middle" }}
                    disabled={isLoaderVisible}
                    className={`btn btn-success btn-block ${styles.save_btn}`}
                  >
                    {isLoaderVisible ? "Saving..." : "Save"}
                  </Button>
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
      </div>
      <Footer />
    </>
  );
};

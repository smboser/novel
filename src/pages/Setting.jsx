import React, { useState, useEffect } from "react";
import { Navbar } from "../components/nav";
import { useAuth } from "../hooks/useAuth";
import { InputAdornment, OutlinedInput, Button } from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";
import { useQuery } from "react-query";
import axios from "axios";
import { filterLatestAlerts } from "../helper/utils";
import {
  setAdvisorySettings,
  getAdvisorySettings,
} from "../helper/web-service";
import styles from "./SettingPage.module.css";
import { toast } from "react-hot-toast";
import { CirclesWithBar } from "react-loader-spinner";
import { APP_CONST } from "../helper/application-constant";

export const SettingPage = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState([]);
  const [isLoaderVisible, setLoaderVisible] = useState(false);
  const [showSuccMsg, setShowSuccMsg] = useState(false);
  const [showErrMsg, setShowErrMsg] = useState(false);

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
          acc[alert.paramDisplayName].lt = alert.level || "";
        } else if (alert.func === "gt") {
          acc[alert.paramDisplayName].gt = alert.level || "";
        }
        return acc;
      }, {});
      setSettings(
        Object.entries(organizedData).map(
          ([paramDisplayName, { lt, gt, active, parameter, orgName }]) => ({
            parameter,
            paramDisplayName,
            lt,
            gt,
            active,
            orgName,
          })
        )
      );
    }
  }, [data, user]);

  // Validate the lt and gt values based on APP_CONST parameters
  const validateValues = (parameterKey, field, value) => {
    const paramConfig = APP_CONST.parameters.find(
      (param) => param.key === parameterKey
    );
    if (!paramConfig) return null;

    const { min_value, max_value } = paramConfig;
    let isValid = true;
    let errorMsg = "";

    if (field === "lt" && value < min_value) {
      isValid = false;
      errorMsg = `Low Threshold should be more than ${min_value}`;
    }

    if (field === "gt" && value > max_value) {
      isValid = false;
      errorMsg = `High Threshold should be less than ${max_value}`;
    }

    return { isValid, errorMsg };
  };

  const handleSave = async () => {
    setLoaderVisible(true);
    const apiSaveUrl = setAdvisorySettings(user);
    try {
      const filteredSettings = settings.flatMap(
        ({ parameter, lt, gt, active, orgName }) => {
          const results = [];

          // Create a result entry for lt if it exists
          if (lt) {
            results.push({
              active,
              parameter,
              orgName,
              func: "lt",
              level: Number(lt),
            });
          }

          // Create a result entry for gt if it exists
          if (gt) {
            results.push({
              active,
              parameter,
              orgName,
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
    if (isValid) {
      const updatedSettings = settings.map((s) =>
        s.parameter === parameter ? { ...s, [field]: value } : s
      );
      setSettings(updatedSettings);
      console.log("updatedSettings", updatedSettings);
      await handleSave();
    } else {
      toast.error(errorMsg);
      alert(errorMsg);
    }
  };

  useEffect(() => {
    setLoaderVisible(isLoading);
  }, [isLoading]);

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
                          <th>Active</th>
                          <th>Alert</th>
                          <th>Low Threshold</th>
                          <th>High Threshold</th>
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
                                  }}
                                />
                                <span className="slider round"></span>
                              </label>
                            </td>
                            <td>
                              <span>{setting.paramDisplayName}</span>
                              <input type="hidden" value={setting.parameter} />
                            </td>
                            <td>
                              <OutlinedInput
                                startAdornment={
                                  <InputAdornment position="start">
                                    <ErrorOutline style={{ color: "red" }} />
                                  </InputAdornment>
                                }
                                value={setting.lt}
                                onChange={(e) => {
                                  setSettings((prev) =>
                                    prev.map((s) =>
                                      s.parameter === setting.parameter
                                        ? { ...s, lt: e.target.value }
                                        : s
                                    )
                                  );
                                }}
                                onBlur={() =>
                                  handleBlur(
                                    setting.parameter,
                                    "lt",
                                    setting.lt
                                  )
                                }
                                disabled={!setting.active}
                                aria-describedby="outlined-weight-helper-text"
                              />
                            </td>
                            <td>
                              <OutlinedInput
                                startAdornment={
                                  <InputAdornment position="start">
                                    <ErrorOutline style={{ color: "red" }} />
                                  </InputAdornment>
                                }
                                value={setting.gt}
                                onChange={(e) => {
                                  setSettings((prev) =>
                                    prev.map((s) =>
                                      s.parameter === setting.parameter
                                        ? { ...s, gt: e.target.value }
                                        : s
                                    )
                                  );
                                }}
                                onBlur={() =>
                                  handleBlur(
                                    setting.parameter,
                                    "gt",
                                    setting.gt
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
    </>
  );
};

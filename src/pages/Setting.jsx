import React, { useState, useEffect } from "react";
import { Navbar } from "../components/nav";
import { useAuth } from "../hooks/useAuth";
import { InputAdornment, OutlinedInput, Button } from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";
import { useQuery } from "react-query";
import axios from "axios";
import {
  setAdvisorySettings,
  getAdvisorySettings,
} from "../helper/web-service";
import styles from "./SettingPage.module.css";
import { toast } from "react-hot-toast";
import { CirclesWithBar } from "react-loader-spinner";

export const SettingPage = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState([]);
  const [isLoaderVisible, setLoaderVisible] = useState(false);
  const [showSuccMsg, setShowSuccMsg] = useState(false);
  const [showErrMsg, setShowErrMsg] = useState(false);

  // Fetch data inside the component
  const fetchAlertData = async () => {
    const apiUrl = getAdvisorySettings(user);
    console.log("Fetching URL:", apiUrl); // Log the URL for debugging
    const response = await axios.get(apiUrl);
    return response.data.value;
  };

  const { data, isLoading, error } = useQuery("alertData", fetchAlertData);

  // Update state when data is fetched
  useEffect(() => {
    if (data) {
      const organizedData = data.reduce((acc, alert) => {
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

  const handleSave = async () => {
    setLoaderVisible(true);
    const apiSaveUrl = setAdvisorySettings(user);
    // const apiUrl =
    //   "https://prod-26.australiaeast.logic.azure.com:443/workflows/3c179ff0e6064518b5750820cac3e7a8/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=ZjmaeAOmkBUJb0a5KEXPL4n7bCp9W_doTwMsvTK987c&authToken=" +
    //   user.token;

    try {
      const filteredSettings = settings
        .map(({ parameter, lt, gt, active, orgName }) => ({
          active,
          func: lt ? "lt" : gt ? "gt" : null,
          level: lt ? Number(lt) : gt ? Number(gt) : null,
          orgName,
          parameter,
        }))
        .filter(({ func, level }) => func && !isNaN(level));

      if (filteredSettings.length === 0) {
        toast.warn("No settings to save.");
        return;
      }

      await axios.post(apiSaveUrl, { settings: filteredSettings });
      toast.success("Settings saved successfully!");
      setShowSuccMsg(true);
      setLoaderVisible(false);
    } catch (err) {
      console.error("Error saving settings:", err);
      toast.error("Error saving settings. Please try again.");
      setShowErrMsg(true);
      setLoaderVisible(false);
    }
  };

  // Auto-save on blur
  const handleBlur = async (parameter, field, value) => {
    const updatedSettings = settings.map((s) =>
      s.parameter === parameter ? { ...s, [field]: value } : s
    );
    setSettings(updatedSettings);
    await handleSave();
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
                    color="success"
                    className={`btn btn-success btn-block ${styles.save_btn}`}
                  >
                    Save
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

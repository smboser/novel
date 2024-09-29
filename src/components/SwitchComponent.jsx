import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker";
import styles from "./SwitchComponent.module.css";
import { Button } from "@mui/material";
import { toast, Toaster } from "react-hot-toast";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
} from "@mui/material";
import { getValveSettings, setValveSettings } from "../helper/web-service";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const SwitchComponent = () => {
  const [isLoaderVisible, setLoaderVisible] = useState(false);
  const [rows, setRows] = useState([]);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const fetchDeviceSettings = async () => {
    const apiUrl = getValveSettings(user);
    const response = await axios.get(apiUrl);
    return response.data;
  };

  const saveDeviceSettings = async (rows) => {
    const apiUrl = setValveSettings(user);
    await axios.post(apiUrl, rows);
    toast.success("Settings saved successfully!");
  };

  // Fetch device settings data
  const { data, isLoading, error } = useQuery(
    "valve-settings",
    fetchDeviceSettings
  );

  useEffect(() => {
    if (data) {
      setRows(data.value);
    }
  }, [data]);

  // Mutation to save data
  const mutation = useMutation(saveDeviceSettings, {
    onSuccess: () => {
      // Invalidate and refetch data after mutation
      queryClient.invalidateQueries("deviceSettings");
    },
  });

  const handleSwitchChange = (id) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, active: !row.active } : row
      )
    );
  };

  const handleTimeChange = (id, field, newTime) => {
    const onlyTime = dayjs(newTime).format("HH:mm:ss");
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, [field]: onlyTime } : row
      )
    );
  };

  const handleCheckboxChange = (id) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, autoTurnOnOff: !row.autoTurnOnOff } : row
      )
    );
  };

  const handleSave = async () => {
    setLoaderVisible(true);
    try {
      await mutation.mutateAsync({
        active: rows[0].active,
        orgName: rows[0].PartitionKey,
        devEUI: rows[0].devEUI,
        autoTurnOnOff: rows[0].autoTurnOnOff,
        turnOffTime: rows[0].turnOffTime,
        turnOnTime: rows[0].turnOnTime,
      });
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setLoaderVisible(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  return (
    <div className="col-md-12 col-sm-12 col-xs-12">
      <div className="x_panel">
        <div className="ttl_main">
          <h2 style={{ paddingTop: "2px" }}>
            <strong>Device Settings</strong>
          </h2>
        </div>
        <div className="formbodymain">
          <div className="row">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TableContainer component={Paper} className={styles.deviceTable}>
                <Table aria-label="simple table" className={styles.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Active</TableCell>
                      <TableCell>Device</TableCell>
                      <TableCell>Auto</TableCell>
                      <TableCell>Turn on Time</TableCell>
                      <TableCell>Turn off Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows &&
                      rows.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className={styles.settings_input}>
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={row.active}
                                onChange={() => handleSwitchChange(row.id)}
                              />
                              <span className="slider round"></span>
                            </label>
                          </TableCell>

                          <TableCell>
                            <div
                              dangerouslySetInnerHTML={{ __html: row.devEUI }}
                            />
                          </TableCell>
                          <TableCell className={styles.settings_input}>
                            <Checkbox
                              checked={row.autoTurnOnOff}
                              onChange={() => handleCheckboxChange(row.id)}
                              color="primary"
                            />
                          </TableCell>
                          <TableCell className={styles.settings_input}>
                            <DesktopTimePicker
                              value={dayjs()
                                .set(
                                  "hour",
                                  Number(row.turnOnTime.split(":")[0])
                                )
                                .set(
                                  "minute",
                                  Number(row.turnOnTime.split(":")[1])
                                )
                                .set(
                                  "second",
                                  Number(row.turnOnTime.split(":")[2])
                                )}
                              onChange={(newTime) =>
                                handleTimeChange(
                                  row.id,
                                  "turnOnTime",
                                  newTime.toString()
                                )
                              }
                              className={styles.timPicker}
                            />
                          </TableCell>
                          <TableCell className={styles.settings_input}>
                            <DesktopTimePicker
                              value={dayjs()
                                .set(
                                  "hour",
                                  Number(row.turnOffTime.split(":")[0])
                                )
                                .set(
                                  "minute",
                                  Number(row.turnOffTime.split(":")[1])
                                )
                                .set(
                                  "second",
                                  Number(row.turnOffTime.split(":")[2])
                                )}
                              onChange={(newTime) =>
                                handleTimeChange(
                                  row.id,
                                  "turnOffTime",
                                  newTime.toString()
                                )
                              }
                              className={styles.timPicker}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <div className={styles.btnDiv}>
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
              </div>
            </LocalizationProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwitchComponent;

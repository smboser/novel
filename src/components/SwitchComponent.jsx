import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker";
import styles from "./SwitchComponent.module.css";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Checkbox,
  Paper,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const SampleTable = () => {
  const [rows, setRows] = useState([
    {
      id: 1,
      enabled: true,
      text: "<strong>Valve Switch 1</strong><br />devEUI",
      checked: true,
      startTime: new Date(),
      endTime: new Date(),
    },
    {
      id: 2,
      enabled: false,
      text: "<strong>Valve Switch 2</strong><br />devEUI",
      checked: false,
      startTime: new Date(),
      endTime: new Date(),
    },
  ]);

  const handleSwitchChange = (id) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, enabled: !row.enabled } : row
      )
    );
  };

  const handleTimeChange = (id, field, newTime) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, [field]: newTime } : row
      )
    );
  };
  const handleCheckboxChange = (id) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, checked: !row.checked } : row
      )
    );
  };
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
                    {rows.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className={styles.settings_input}>
                          {/* <Switch
                            checked={row.enabled}
                            onChange={() => handleSwitchChange(row.id)}
                            color="primary"
                          /> */}
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={row.enabled}
                              onChange={() => handleSwitchChange(row.id)}
                            />
                            <span className="slider round"></span>
                          </label>
                        </TableCell>

                        <TableCell>
                          <div dangerouslySetInnerHTML={{ __html: row.text }} />
                        </TableCell>
                        <TableCell className={styles.settings_input}>
                          <Checkbox
                            checked={row.checked}
                            onChange={() => handleCheckboxChange(row.id)}
                            color="primary"
                          />
                        </TableCell>
                        <TableCell className={styles.settings_input}>
                          <DesktopTimePicker
                            defaultValue={dayjs("2022-04-17T15:30")}
                            className={styles.timPicker}
                          />
                        </TableCell>
                        <TableCell className={styles.settings_input}>
                          <DesktopTimePicker
                            defaultValue={dayjs("2022-04-17T15:30")}
                            className={styles.timPicker}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </LocalizationProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleTable;

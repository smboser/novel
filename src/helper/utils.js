import { APP_CONST } from "../helper/application-constant";

export function differenceDate(date_past, date_now) {
  let date_past_time = date_past.getTime();
  let date_now_time = date_now.getTime();

  var delta = Math.abs(date_now_time - date_past_time) / 1000;

  // calculate (and subtract) whole days
  let days = Math.floor(delta / 86400);
  delta -= days * 86400;

  // calculate (and subtract) whole hours
  let hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;

  // calculate (and subtract) whole minutes
  let minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;

  // what's left is seconds
  let seconds = Math.floor(delta % 60);

  let diff = "";
  if (days > 0) {
    diff = `${days}D`;
  }
  if (hours > 0) {
    diff = `${diff} ${hours}H`;
  }
  if (minutes > 0) {
    diff = `${diff} ${minutes}M`;
  }
  if (seconds > 0) {
    diff = `${diff} ${seconds}S`;
  }
  return diff;
}

export const filterLatestAlerts = (data) => {
  // Create a map to group entries by parameter and func
  const latestEntries = data.reduce((acc, item) => {
    const { parameter, func, Timestamp } = item;

    if (!acc[parameter]) {
      acc[parameter] = { lt: null, gt: null };
    }

    if (func === "lt") {
      // Update the 'lt' entry if it's the latest one
      if (
        !acc[parameter].lt ||
        new Date(Timestamp) > new Date(acc[parameter].lt.Timestamp)
      ) {
        acc[parameter].lt = item;
      }
    } else if (func === "gt") {
      // Update the 'gt' entry if it's the latest one
      if (
        !acc[parameter].gt ||
        new Date(Timestamp) > new Date(acc[parameter].gt.Timestamp)
      ) {
        acc[parameter].gt = item;
      }
    }

    return acc;
  }, {});

  // Convert the result to an array if needed
  const filteredData = Object.values(latestEntries).flatMap(({ lt, gt }) =>
    [lt, gt].filter(Boolean)
  );

  return filteredData;
};

export const getOrganizedParameters = (data) => {
  const parameters = data.value.reduce((acc, param) => {
    if (!acc[param.parameter] && param.parameter != "leakage_status") {
      acc[param.parameter] = {
        name: param.paramDisplayName,
        unit: param.unit
      };
    }
    return acc;
  }, {});
  return parameters;
}


export const getOrganizedAdvisorySettings = (data, parameters) => {
  const advisorySettings = data.reduce((acc, alert) => {
    if (parameters[alert.parameter]) {
      if (!acc[alert.parameter] && alert.active) {
          let param = parameters[alert.parameter];
          let curObj = {
              lt: "",
              gt: "",
              active: alert.active,
              parameter: alert.parameter,
              orgName: alert.orgName,
              min_value: alert.min,
              max_value: alert.max
          };
          acc[alert.parameter] = { ...param, ...curObj };
      }
      if (alert.func === "lt" && alert.active) {
        acc[alert.parameter].lt = alert.level || "";
      } else if (alert.func === "gt" && alert.active) {
        acc[alert.parameter].gt = alert.level || "";
      }
    }
    return acc;
  }, {});

  return advisorySettings;
}

export const calculateAvgLatestData = (latestData, parameter, selectedDevices) => {
  let total = 0, count = 0;
  Object.keys(latestData).forEach(devname => {
    if (typeof (latestData[devname][parameter]) != "undefined" && selectedDevices.includes(devname)) {
      total += latestData[devname][parameter];
      count += 1;
    }
  });
  return (count > 0) ? Math.floor(total / count) : 0;
}

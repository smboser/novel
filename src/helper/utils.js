import { APP_CONST } from "../helper/application-constant";
import moment from 'moment';

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
  const advisorySettings = data.reduce((acc, alert) => {

    let parameter = alert.parameter;
    if (!acc[parameter]) {
      acc[parameter] = {
        parameter: parameter,
        paramDisplayName: alert.paramDisplayName,
        orgName: alert.orgName,
        currentMinAlert: alert.currentMinAlert,
        min_value: alert.min_value,
        currentMaxAlert: alert.currentMaxAlert,
        max_value: alert.max_value,
        unit: alert.unit,
        active: alert.alertActive
      };
    }
    if (acc[parameter]["min_value"] > alert.min_value) {
      acc[parameter]["min_value"] = alert.min_value;
    }

    if (acc[parameter]["currentMaxAlert"] > alert.currentMaxAlert) {
      acc[parameter]["currentMaxAlert"] = alert.currentMaxAlert;
    }

    if (acc[parameter]["max_value"] < alert.max_value) {
      acc[parameter]["max_value"] = alert.max_value;
    }

    if (acc[parameter]["currentMaxAlert"] < alert.currentMaxAlert) {
      acc[parameter]["currentMaxAlert"] = alert.currentMaxAlert;
    }
    return acc;
  }, {});

  return advisorySettings;
}

export const getOrganizedAdvisorySettings = (data) => {
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
      repeatedAlert: dt.repeatedAlert,
      unit: dt.unit
    });
  });
  return organizedData;
}

export const getOrganizedSensorData = (data, parameters) => {
  let seriesData = {};
  let latestData = {};
  let dailyRainfall = 0;
  let currentDay = null;
  let timeBefore24Hour = moment().add(-24, 'hours');
  data.forEach(value => {
    let devName = value.devName;
    let devEUI = value.devEUI;
    // For series data
    if (!seriesData[devEUI]) {
      seriesData[devEUI] = [];
    }
    // For last 24 hours data
    if (!latestData[devEUI]) {
      latestData[devEUI] = {};
    }

    let instData = {
      "timestamp": value.Timestamp,
      "devName": devName,
      "devEUI": devEUI
    };


    parameters.forEach((parameter) => {
      let fvalue = value[parameter] || null;
      switch (parameter) {
        case "rainfall_total":
          if (fvalue != null) {
            let day = moment(value.Timestamp).format('YYYY-MM-DD');
            if (day !== currentDay) {
              dailyRainfall = 0;
              currentDay = day;
            }
            dailyRainfall += fvalue;
            instData[parameter] = dailyRainfall;
            break;
          }
        default:
          instData[parameter] = fvalue;
          break;
      }
    });


    // Push into series data array
    seriesData[devEUI].push(instData);
    // Push into last 24 hours data
    let tm = moment(value.Timestamp);
    if (tm.diff(timeBefore24Hour, 'seconds') > 0) {
      if (Object.keys(latestData[devEUI]) == 0) {
        latestData[devEUI] = instData;
      } else if (new Date(value.Timestamp) > new Date(latestData[devEUI].timestamp)) {
        latestData[devEUI] = instData;
      }
    }
  });
  return {
    "seriesData": seriesData,
    "latestData": latestData
  }
}

export const getAlertAdvisories = (settings, last24HoursData) => {
  // Organized data
  let advisoriesData = [];
  Object.keys(settings).forEach((devEUI) => {
    let parameters = settings[devEUI];
    parameters.forEach((param) => {
      let { paramDisplayName, unit, currentMinAlert, currentMaxAlert, parameter, alertActive } = param;
      if (typeof (last24HoursData[devEUI]) == "undefined" || !alertActive) {
        return true;
      }
      let curval = last24HoursData[devEUI][parameter];
      let devName = last24HoursData[devEUI]["devName"];
      // For exceeded
      if (typeof (currentMaxAlert) != "undefined" && currentMaxAlert && (curval != null && curval > currentMaxAlert)) {
        let altdata = {
          "devName": devName,
          "parameter": parameter,
          "name": paramDisplayName,
          "unit": unit,
          "value": curval,
          "msg": `${devName} has exceeded ${parameter}`
        }
        advisoriesData.push(altdata);
      }

      // For subceeded
      if (typeof (currentMinAlert) != "undefined" && currentMinAlert && (curval != null && curval < currentMinAlert)) {
        let altdata = {
          "devName": devName,
          "parameter": parameter,
          "name": paramDisplayName,
          "unit": unit,
          "value": curval,
          "msg": `${devName} has subceeded ${parameter}`
        }
        advisoriesData.push(altdata);
      }
    });
  });
  return advisoriesData;
}


export const calculateAvgLatestData = (latestData, parameter, selectedDevices) => {
  let total = 0, count = 0;
  Object.keys(latestData).forEach(devEUI => {
    if (typeof (latestData[devEUI][parameter]) != "undefined" && latestData[devEUI][parameter] != null && selectedDevices.includes(devEUI)) {
      total += latestData[devEUI][parameter];
      count += 1;
    }
  });
  return (count > 0) ? Math.floor(total / count) : 0;
}

export const getOrganizedDevicesAverage = (parameters, selectedDevices, last24HoursData) => {

  const organizedData = [];
  Object.keys(parameters).forEach((key) => {
    let param = parameters[key];
    let { min_value, max_value, currentMinAlert, currentMaxAlert, parameter, paramDisplayName, unit } = param;
    // Find low thohresld and high thohresld
    let low_thohresld = currentMinAlert ? (currentMinAlert < min_value ? min_value : currentMinAlert) : min_value;
    let high_thohresld = currentMaxAlert ? (currentMaxAlert > max_value ? max_value * 0.7 : currentMaxAlert) : max_value * 0.7;
    // Calculate average
    let avg = calculateAvgLatestData(last24HoursData, parameter, selectedDevices);
    if (!isValidatedAvgDevice(min_value, max_value, currentMinAlert, currentMaxAlert)) {
      console.info(`[Utils][getOrganizedDevicesAverage] The ${parameter} is not considered for those value  min :${min_value} and max:${max_value} and low thohresld : ${low_thohresld} and high thohresld : ${high_thohresld}`);
      return;
    }
    organizedData.push({
      min_value,
      max_value,
      low_thohresld,
      high_thohresld,
      parameter,
      paramDisplayName,
      unit,
      avg
    });
  });
  return organizedData;

}

export const isValidatedAvgDevice = (min_value, max_value, currentMinAlert, currentMaxAlert) => {
  let flag = true;
  if ((typeof (min_value) == "undefined" && typeof (max_value) == "undefined") || typeof (max_value) == "undefined") {
    flag = false;
  } else if (max_value <= min_value) {
    flag = false;
  } else if (min_value > currentMinAlert) {
    flag = false;
  } else if (max_value < currentMaxAlert) {
    flag = false;
  } else if (currentMinAlert > currentMaxAlert) {
    flag = false;
  } else if (currentMinAlert >= max_value) {
    flag = false;
  } else if (currentMaxAlert <= min_value) {
    flag = false;
  }
  return flag;
}

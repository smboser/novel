export const APP_CONST = {
  BASE_URL: "https://prod-11.australiaeast.logic.azure.com:443/workflows",
  API_VERSION: "2016-10-01",
  SP: "/triggers/When_a_HTTP_request_is_received/run",
  SV: "1.0",
  default_parameter: "temperature",
  farmer_companies: ["JoeFarm"],
  parameters: [
    {
      name: "Temperature",
      key: "temperature",
      avg_value: 0,
      min_value: 0,
      max_value: 60,
      unit: "°C",
    },
    {
      name: "Humidity",
      key: "humidity",
      avg_value: 0,
      min_value: 0,
      max_value: 100,
      unit: "%",
    },
    {
      name: "CO2",
      key: "co2",
      avg_value: 0,
      min_value: 0,
      max_value: 10000,
      unit: "ppm",
    },
    {
      name: "TVOC",
      key: "tvoc",
      avg_value: 0,
      min_value: 0,
      max_value: 100,
      unit: "ppm",
    },
    {
      name: "Light",
      key: "light_level",
      avg_value: 0,
      min_value: 0,
      max_value: 8,
      unit: "index",
    },
    {
      name: "Battery",
      key: "battery",
      avg_value: 0,
      min_value: 0,
      max_value: 100,
      unit: "",
    },
    {
      name: "pm2.5",
      key: "pm2_5",
      avg_value: 0,
      min_value: 0,
      max_value: 100,
      unit: "ppm",
    },
    {
      name: "pm10",
      key: "pm10",
      avg_value: 0,
      min_value: 0,
      max_value: 100,
      unit: "ppm",
    },
    {
      name: "Pressure",
      key: "pressure",
      avg_value: 0,
      min_value: 0,
      max_value: 2000,
      unit: "milibar",
    },
  ],
};

export const APP_CONST = {
    "BASE_URL": "https://prod-11.australiaeast.logic.azure.com:443/workflows",
    "API_VERSION": "2016-10-01",
    "SP": "/triggers/When_a_HTTP_request_is_received/run",
    "SV": "1.0",
    "default_parameter": "temperature",
    "parameters": [
        {
            "name": "Temperature",
            "key": "temperature",
            "avg_value": 0,
            "min_value": 0,
            "upper_limit_value": 45,
            "max_value": 60
        },
        {
            "name": "Humidity",
            "key": "humidity",
            "avg_value": 0,
            "min_value": 0,
            "upper_limit_value": 45,
            "max_value": 100
        },
        {
            "name": "CO2",
            "key": "co2",
            "avg_value": 0,
            "min_value": 0,
            "upper_limit_value": 6000,
            "max_value": 10000
        },
        {
            "name": "TVOC",
            "key": "tvoc",
            "avg_value": 0,
            "min_value": 0,
            "upper_limit_value": 80,
            "max_value": 100
        },
        {
            "name": "Light",
            "key": "light_level",
            "avg_value": 0,
            "min_value": 0,
            "upper_limit_value": 3,
            "max_value": 8
        }
    ]
};
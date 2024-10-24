export const APP_CONST = {
  BASE_URL: `${import.meta.env.VITE_LOGIN_API_URL}/workflows`,
  API_VERSION: "2016-10-01",
  SP: "/triggers/When_a_HTTP_request_is_received/run",
  SV: "1.0",
  default_parameter: "temperature",
  farmer_companies: ["JoeFarm", "FieldSolutions"],
  testingUsers: ["DeepTesting"],
  alert_advisories_responsive_parameter: {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  },
  avg_device_data_responsive_parameter: {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  },
};

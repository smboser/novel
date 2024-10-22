import { APP_CONST } from "./application-constant";
import moment from "moment";

const requestHeader = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

async function getRequest(url) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: requestHeader,
    });
    if (!response.ok) {
      throw new Error(
        `Unable to get response for status: ${response.status} and ${response.message}`
      );
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

async function postRequest(url, data) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: requestHeader,
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      let errData = await response.json();
      throw new Error(
        `Unable to getting response for HTTP status: ${response.status} and code : ${errData.error.code} and message : ${errData.error.message}`
      );
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export const userLogin = (password) => {
  // For URL
  let url = `${import.meta.env.VITE_LOGIN_API_URL
    }/workflows/17e32218cd2245e5bc4d6cba2a310fea/triggers/When_a_HTTP_request_is_received/paths/invoke`;
  url = `${url}?api-version=${APP_CONST.API_VERSION}`;
  url = `${url}&sp=${APP_CONST.SP}`;
  url = `${url}&sv=${APP_CONST.SV}`;
  url = `${url}&sig=RU8cs4RLoVpwPgQki6AFjn1UfSZNrG1b2zsucPuaLAU`;
  // For Data
  let data = {};
  data.password = password;
  // Call end point
  return postRequest(url, data);
};

export const getDevices = (userInfo) => {
  // For URL
  let url = `${import.meta.env.VITE_DEVICE_API_URL
    }/workflows//9f8fbd63b01b4778b1e7721d3738c5d1/triggers/When_a_HTTP_request_is_received/paths/invoke`;
  url = `${url}?api-version=${APP_CONST.API_VERSION}`;
  url = `${url}&sp=${APP_CONST.SP}`;
  url = `${url}&sv=${APP_CONST.SV}`;
  url = `${url}&sig=LGwyUa9yif7tRD4QNPsxBOFlJ_bbwSvir9hYnsIHwoI`;
  url = `${url}&orgName=${userInfo.orgName}`;
  url = `${url}&authToken=${userInfo.token}`;
  // Call end point
  return getRequest(url);
};

export const getSensorData = (userInfo) => {
  // For URL
  let url = `${import.meta.env.VITE_GET_SENSOR_API_URL
    }/workflows/06f427a8821a480299756c737b774c60/triggers/When_a_HTTP_request_is_received/paths/invoke`;
  url = `${url}?api-version=${APP_CONST.API_VERSION}`;
  url = `${url}&sp=${APP_CONST.SP}`;
  url = `${url}&sv=${APP_CONST.SV}`;
  url = `${url}&sig=wRTuMv158QzmYIxy3B-fc9lvAb8S83QTbnwR-PZQL14`;
  url = `${url}&orgName=${userInfo.orgName}`;
  url = `${url}&authToken=${userInfo.token}`;
  url = `${url}&dateStart=${moment().subtract(7, "days").format("YYYY-MM-DD")}`;
  url = `${url}&dateEnd=${moment().format("YYYY-MM-DD")}`;
  // Call end point
  return getRequest(url);
};

export const getAdvisorySettingData = (userInfo) => {
  // For URL
  let url = `${import.meta.env.VITE_SET_ADV_API_URL
    }/workflows/86ea5a4f3b8543f39308cba0e6a34afd/triggers/When_a_HTTP_request_is_received/paths/invoke`;
  url = `${url}?api-version=${APP_CONST.API_VERSION}`;
  url = `${url}&sp=${APP_CONST.SP}`;
  url = `${url}&sv=${APP_CONST.SV}`;
  url = `${url}&sig=wGSuCPj2oqpTrxzWsiD5R1zHKemHaNkDt4JsXIRmWUM`;
  url = `${url}&orgName=${userInfo.orgName}`;
  url = `${url}&authToken=${userInfo.token}`;
  console.log("Constructed URL:", url); // Log the URL
  // Call end point
  return getRequest(url);
};

export const getParameters = (userInfo) => {
  let url = `${import.meta.env.VITE_GET_PARAM_API_URL
    }/workflows/af8858ba45c141d9a134be3243dc1d97/triggers/When_a_HTTP_request_is_received/paths/invoke`;
  url = `${url}?api-version=${APP_CONST.API_VERSION}`;
  url = `${url}&sp=${APP_CONST.SP}`;
  url = `${url}&sv=${APP_CONST.SV}`;
  url = `${url}&sig=c00G615RA6SgbvHtlOr4QamzmiEkwZ7zoB62sy2XUw4`;
  url = `${url}&orgName=${userInfo.orgName}`;
  url = `${url}&authToken=${userInfo.token}`;
  console.log("Constructed URL:", url); // Log the URL
  // Call end point
  return getRequest(url);
};

// src/helper/web-service.js
export const getAdvisorySettings = (userInfo) => {
  // For URL
  let url = `${import.meta.env.VITE_GET_ADV_API_URL
    }/workflows/f9721efd19cd43d88b6c210f7e6d6285/triggers/When_a_HTTP_request_is_received/paths/invoke`;
  url = `${url}?api-version=${APP_CONST.API_VERSION}`;
  url = `${url}&sp=${APP_CONST.SP}`;
  url = `${url}&sv=${APP_CONST.SV}`;
  url = `${url}&sig=zIC4PONUSiOh6jeutZWHmcRqiNXOzpeB_GthG2fZhjY`;
  url = `${url}&orgName=${userInfo.orgName}`;
  url = `${url}&authToken=${userInfo.token}`;
  console.log("Constructed URL:", url); // Log the URL
  // Call end point
  return getRequest(url);
};

export const setAdvisorySettings = (userInfo) => {
  let url = `${import.meta.env.VITE_SET_ADV_SETTINGS_API_URL
    }/workflows/fae611fcbcdc4cd69a01623fda100949/triggers/When_a_HTTP_request_is_received/paths/invoke`;
  url = `${url}?api-version=${APP_CONST.API_VERSION}`;
  url = `${url}&sp=${APP_CONST.SP}`;
  url = `${url}&sv=${APP_CONST.SV}`;
  url = `${url}&sig=8g_Xyrx6xGhAfN8tSF3Sr6dLkpR9oqJ9a2tJXcc-CHg`;
  url = `${url}&orgName=${userInfo.orgName}`;
  url = `${url}&authToken=${userInfo.token}`;
  console.log("Constructed URL:", url); // Log the URL
  return url;
};

export const getMinMaxAdvisorySettings = (userInfo) => {
  let url = `${import.meta.env.VITE_GET_PARAM_API_URL
    }/workflows/af8858ba45c141d9a134be3243dc1d97/triggers/When_a_HTTP_request_is_received/paths/invoke`;
  url = `${url}?api-version=${APP_CONST.API_VERSION}`;
  url = `${url}&sp=${APP_CONST.SP}`;
  url = `${url}&sv=${APP_CONST.SV}`;
  url = `${url}&sig=c00G615RA6SgbvHtlOr4QamzmiEkwZ7zoB62sy2XUw4`;
  url = `${url}&orgName=${userInfo.orgName}`;
  url = `${url}&authToken=${userInfo.token}`;
  console.log("Constructed URL:", url); // Log the URL
  return url;
};

export const getValveSettings = (userInfo) => {
  let url = `${import.meta.env.VITE_GET_VALVE_API_URL
    }/workflows/1222197568d24a4d90e07180c61d2907/triggers/When_a_HTTP_request_is_received/paths/invoke`;
  url = `${url}?api-version=${APP_CONST.API_VERSION}`;
  url = `${url}&sp=${APP_CONST.SP}`;
  url = `${url}&sv=${APP_CONST.SV}`;
  url = `${url}&sig=Tba8OM_7F0OvTdtweTCI3c3os1G9WaP0ZVxr9EgrvCI`;
  url = `${url}&orgName=${userInfo.orgName}`;
  url = `${url}&authToken=${userInfo.token}`;
  console.log("Valve Settings URL:", url); // Log the URL
  return url;
};

export const setValveSettings = (userInfo) => {
  let url = `${import.meta.env.VITE_SET_VALVE_API_URL
    }/workflows/c4db9b21ccab4107aebc33f6adc8c554/triggers/When_a_HTTP_request_is_received/paths/invoke`;
  url = `${url}?api-version=${APP_CONST.API_VERSION}`;
  url = `${url}&sp=${APP_CONST.SP}`;
  url = `${url}&sv=${APP_CONST.SV}`;
  url = `${url}&sig=X3w4DptdQ1OUPsKeOFd4_9A3OGpQ7Iq6W3jm4IYJJ3E`;
  url = `${url}&orgName=${userInfo.orgName}`;
  url = `${url}&authToken=${userInfo.token}`;
  console.log("Valve Settings URL:", url); // Log the URL
  return url;
};

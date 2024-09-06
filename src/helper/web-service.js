import { APP_CONST } from "./application-constant";

const requestHeader = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

async function getRequest(url) {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: requestHeader
        });
        if (!response.ok) {
            throw new Error(`Unable to get response for status: ${response.status} and ${response.message}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }

}

async function postRequest(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: requestHeader,
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            let errData = await response.json();
            throw new Error(`Unable to getting response for HTTP status: ${response.status} and code : ${errData.error.code} and message : ${errData.error.message}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }

}


export const userLogin = (password) => {
    // For URL
    let url = `${APP_CONST.BASE_URL}/a7a8d8d6738544fcb1a5114f65016d37/triggers/When_a_HTTP_request_is_received/paths/invoke`;
    url = `${url}?api-version=${APP_CONST.API_VERSION}`;
    url = `${url}&sp=${APP_CONST.SP}`;
    url = `${url}&sv=${APP_CONST.SV}`;
    url = `${url}&sig=lZFE7D0zcKIbjxv--8wXAEW76BQLELEMHR-nxt-snXA`;
    // For Data
    let data = {};
    data.password = password;
    // Call end point
    return postRequest(url, data);
};

export const getDevices = (userInfo) => {
    // For URL
    let url = `${APP_CONST.BASE_URL}/9f8fbd63b01b4778b1e7721d3738c5d1/triggers/When_a_HTTP_request_is_received/paths/invoke`;
    url = `${url}?api-version=${APP_CONST.API_VERSION}`;
    url = `${url}&sp=${APP_CONST.SP}`;
    url = `${url}&sv=${APP_CONST.SV}`;
    url = `${url}&sig=LGwyUa9yif7tRD4QNPsxBOFlJ_bbwSvir9hYnsIHwoI`;
    url = `${url}&orgName=${userInfo.orgName}`;
    url = `${url}&authToken=${userInfo.token}`;
    // Call end point
    return getRequest(url);
}

export const getSensorData = (userInfo) => {
    // For URL
    let url = `https://prod-00.australiaeast.logic.azure.com:443/workflows/06f427a8821a480299756c737b774c60/triggers/When_a_HTTP_request_is_received/paths/invoke`;
    url = `${url}?api-version=${APP_CONST.API_VERSION}`;
    url = `${url}&sp=${APP_CONST.SP}`;
    url = `${url}&sv=${APP_CONST.SV}`;
    url = `${url}&sig=wRTuMv158QzmYIxy3B-fc9lvAb8S83QTbnwR-PZQL14`;
    url = `${url}&orgName=${userInfo.orgName}`;
    url = `${url}&authToken=${userInfo.token}`;
    // Call end point
    return getRequest(url);
}
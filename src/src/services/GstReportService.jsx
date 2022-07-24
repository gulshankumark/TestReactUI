import Config from '../config.js';
import { handleResponse } from '../helpers/handle-response';
import { authHeader } from '../helpers/auth-header';

export const GstReportService = {
    GetGstr1ReportForCompany,
    GetGstr1Report,
    GridFillData
};

function GetGstr1ReportForCompany(startDate, endDate, companyId, gst) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ startDate, endDate, companyId })
    };
    return fetch(`${Config.SERVER_URL}/GstReport/GetGstr1ReportForCompany`, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.blob();
            }
            else {
                return response.text().then(t => {
                    return Promise.reject(JSON.parse(t));
                })
            }
        })
        .then(blob => {
            var today = new Date();
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            //a.setAttribute('href', 'data:text/plain;UTF-8');
            a.href = url;
            a.download = `returns_${formatDate(today)}_R1_${gst}_offline.xlsx`;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove();  //afterwards we remove the element again   
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}

function GetGstr1Report(startDate, endDate, gst) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ startDate, endDate })
    };
    return fetch(`${Config.SERVER_URL}/GstReport/GetGstr1Report`, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.blob();
            }
            else {
                return response.text().then(t => {
                    return Promise.reject(JSON.parse(t));
                })
            }
        })
        .then(blob => {
            var today = new Date();
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            //a.setAttribute('href', 'data:text/plain;UTF-8');
            a.href = url;
            a.download = `returns_${formatDate(today)}_R1_${gst}_offline.xlsx`;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove();  //afterwards we remove the element again   
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}

function GridFillData(fromDate, toDate) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ fromDate, toDate })
    };
    return fetch(`${Config.SERVER_URL}/GstReport/GridFillData`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response;
        });
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}
function formatDate(date) {
    return `${padTo2Digits(date.getDate())}${padTo2Digits(date.getMonth() + 1)}${date.getFullYear()}`;
}

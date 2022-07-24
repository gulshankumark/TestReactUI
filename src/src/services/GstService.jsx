import Config from '../config.js';
import { handleResponse } from '../helpers/handle-response';
import { authHeader } from '../helpers/auth-header';

export const GstService = {
    getGstUsers,
    getGstLocations,
    getB2bInvoices,
    GetB2bAllInvoices,
    startSession,
    authenticate,
    getB2bInvoicesAdmin,
    GetB2bAllInvoicesAdmin,
    startSessionAdmin,
    authenticateAdmin,
};

function getGstUsers() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    }
    
    return fetch(`${Config.SERVER_URL}/gst/GetGstUsers`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response.gstUsers;
        });
}

function getGstLocations() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    }
    
    return fetch(`${Config.SERVER_URL}/gst/getgstlocations`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response.locations;
        });
}

function authenticate(otp, transactionCode) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ otp, transactionCode })
    }

    return fetch(`${Config.SERVER_URL}/gst/authenticate`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response;
        });
}

function authenticateAdmin(companyId, otp, transactionCode) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ companyId, otp, transactionCode })
    }

    return fetch(`${Config.SERVER_URL}/gst/authenticateadmin`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response;
        });
}

function startSession() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    }
    
    return fetch(`${Config.SERVER_URL}/gst/startsession`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response;
        });
}

function startSessionAdmin(companyId) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ companyId })
    }

    return fetch(`${Config.SERVER_URL}/gst/startsessionadmin`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response;
        });
}

function getB2bInvoices(transactionCode, month) {
    const returnPeriod = new Date(month + '-21');
    console.log(returnPeriod);
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ transactionCode, returnPeriod })
    }

    return fetch(`${Config.SERVER_URL}/gst/getb2binvoices`, requestOptions)
        .then(response => {
            console.log(response);
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

            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            //a.setAttribute('href', 'data:text/plain;UTF-8');
            a.href = url;
            a.download = `GST_B2b_${month}.pdf`;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove();  //afterwards we remove the element again   
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}

function getB2bInvoicesAdmin(companyId, transactionCode, month) {
    const returnPeriod = new Date(month + '-21');
    console.log(returnPeriod);
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ companyId, transactionCode, returnPeriod })
    }

    return fetch(`${Config.SERVER_URL}/gst/getb2binvoicesadmin`, requestOptions)
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

            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            //a.setAttribute('href', 'data:text/plain;UTF-8');
            a.href = url;
            a.download = `GST_B2b_${companyId}_${month}.pdf`;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove();  //afterwards we remove the element again   
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}

function GetB2bAllInvoices(transactionCode, month) {
    const returnPeriod = new Date(month + '-21');
    console.log(returnPeriod);
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ transactionCode, returnPeriod })
    }

    return fetch(`${Config.SERVER_URL}/gst/GetB2bAllInvoices`, requestOptions)
        .then(response => {
            console.log(response);
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

            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            //a.setAttribute('href', 'data:text/plain;UTF-8');
            a.href = url;
            a.download = `GST_B2bALL_${month}.pdf`;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove();  //afterwards we remove the element again   
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}

function GetB2bAllInvoicesAdmin(companyId, transactionCode, month) {
    const returnPeriod = new Date(month + '-21');
    console.log(returnPeriod);
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ companyId, transactionCode, returnPeriod })
    }

    return fetch(`${Config.SERVER_URL}/gst/GetB2bAllInvoicesAdmin`, requestOptions)
        .then(response => {
            console.log(response);
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

            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            //a.setAttribute('href', 'data:text/plain;UTF-8');
            a.href = url;
            a.download = `GST_B2bALL_${companyId}_${month}.pdf`;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove();  //afterwards we remove the element again   
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}
import Config from '../config';
import { handleResponse } from '../helpers/handle-response';
import { authHeader } from '../helpers/auth-header';

export const TrialBalanceService = {
    getTrialBalance,
    DownloadTrailBalanceReport
};


function getTrialBalance(fromDate,toDate) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body:JSON.stringify({fromDate,toDate})
    };

    return fetch(`${Config.SERVER_URL}/TrialBalance/GetTrialBalance`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response.trialBalanceData;
        });}

function DownloadTrailBalanceReport(startDate,endDate) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            startDate,
            endDate
        })
    };
    return fetch(`${Config.SERVER_URL}/TrialBalance/DownloadTrialBalance`, requestOptions)
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
            a.download = `Ledger_Report.pdf`;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove();  //afterwards we remove the element again   
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}
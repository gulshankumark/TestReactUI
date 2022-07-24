import Config from '../config';
import { handleResponse } from '../helpers/handle-response';
import { authHeader, authUploadHeader } from '../helpers/auth-header';

export const MultiplePrintService = {    
    DownloadJournalContraPrint,
    DownloadSalesInvoicePrint,      
    DownloadPaymentPrint,
    DownloadReciptPrint,
    DownloadMoneyPrint
};



function DownloadJournalContraPrint(startDate, endDate) {

    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            startDate,
            endDate
        })
    };
    return fetch(`${Config.SERVER_URL}/MultiplePrint/DownloadJournalContraPrint`, requestOptions)

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
            a.download = `Invoice_${"JournalContra"}.pdf`;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove();  //afterwards we remove the element again   
        })
        .catch((error) => {
            return Promise.reject(error);
        });

}

function DownloadSalesInvoicePrint(startDate, endDate) {

    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            startDate,
            endDate
        })
    };
    return fetch(`${Config.SERVER_URL}/MultiplePrint/DownloadSalesInvoicePrint`, requestOptions)

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
            a.download = `Invoice_${"SalesInvoice"}.pdf`;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove();  //afterwards we remove the element again   
        })
        .catch((error) => {
            return Promise.reject(error);
        });

}



function DownloadPaymentPrint(startDate, endDate) {

    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            startDate,
            endDate
        })
    };
    return fetch(`${Config.SERVER_URL}/MultiplePrint/DownloadPaymentPrint`, requestOptions)

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
            a.download = `Invoice_${"PaymentPrint"}.pdf`;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove();  //afterwards we remove the element again   
        })
        .catch((error) => {
            return Promise.reject(error);
        });

}

function DownloadReciptPrint(startDate, endDate) {

    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            startDate,
            endDate
        })
    };
    return fetch(`${Config.SERVER_URL}/MultiplePrint/DownloadReciptPrint`, requestOptions)

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
            a.download = `Invoice_${"PaymentPrint"}.pdf`;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove();  //afterwards we remove the element again   
        })
        .catch((error) => {
            return Promise.reject(error);
        });

}

function DownloadMoneyPrint(startDate, endDate) {

    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            startDate,
            endDate
        })
    };
    return fetch(`${Config.SERVER_URL}/MultiplePrint/DownloadMoneyPrint`, requestOptions)

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
            a.download = `Invoice_${"PaymentPrint"}.pdf`;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove();  //afterwards we remove the element again   
        })
        .catch((error) => {
            return Promise.reject(error);
        });

}
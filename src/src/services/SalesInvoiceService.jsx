import Config from '../config';
import { handleResponse } from '../helpers/handle-response';
import { authHeader, authUploadHeader } from '../helpers/auth-header';
import * as moment from 'moment';

export const SalesInvoiceService = {
    CreateSalesInvoice,
    DownloadSalesInvoice,
    getSalesInvoices,
    DownSalesInvoiceReports,
    DownSalesInvoiceExcleReports
};

function getSalesInvoices(startDate, endDate) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ startDate, endDate })
    };
    return fetch(`${Config.SERVER_URL}/SalesInvoice/GetSalesInvoices`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response.salesInvoices;
        });
}

function CreateSalesInvoice(isAliasName, invoiceDateTime, invoiceNumber, remarks, gstin, isAddressModified,
    address, countryID, stateID, pincode, billedToLedgerId, particulars, bankAccounts
) {

    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            isAliasName,
            invoiceDateTime,
            invoiceNumber,
            remarks,
            gstin,
            isAddressModified,
            address,
            countryID,
            stateID,
            pincode,
            billedToLedgerId,
            particulars,
            bankAccounts
        })
    };
    return fetch(`${Config.SERVER_URL}/Transaction/AddSalesTransaction`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response;
        });
}

function DownloadSalesInvoice(id, salesInvoiceNumber) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            id
        })
    };
    return fetch(`${Config.SERVER_URL}/SalesInvoice/DownloadSalesInvoices`, requestOptions)
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
            a.download = `Invoice_${salesInvoiceNumber}.pdf`;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove();  //afterwards we remove the element again   
        })
        .catch((error) => {
            return Promise.reject(error);
        });

}

function DownSalesInvoiceReports(StartDate, EndDate) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ StartDate, EndDate })
    };

    return fetch(`${Config.SERVER_URL}/SalesInvoice/DownloadSalesesInvoiceReport`, requestOptions)
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
            a.download = `SalesInvoice_${moment(StartDate).format('DD_MM_YYYY')}_To_${moment(EndDate).format('DD_MM_YYYY')}.pdf`;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove();  //afterwards we remove the element again
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}

function DownSalesInvoiceExcleReports(StartDate, EndDate) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ StartDate, EndDate })
    };
    return fetch(`${Config.SERVER_URL}/SalesInvoice/DownloadSalesInvoiceExcleReport`, requestOptions)
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
            a.download = `SalesInvoice_${moment(StartDate).format('DD_MM_YYYY')}_To_${moment(EndDate).format('DD_MM_YYYY')}.xlsx`;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove();  //afterwards we remove the element again
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}
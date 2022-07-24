import Config from '../config';
import { handleResponse } from '../helpers/handle-response';
import { authHeader, authUploadHeader } from '../helpers/auth-header';
import * as moment from 'moment';

export const ProformaInvoiceService = {
    CreateProformaInvoice,
    GetProformaInvoice,
    DownloadProformaInvoice
};
function GetProformaInvoice(startDate, endDate) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ startDate, endDate })
    };
    return fetch(`${Config.SERVER_URL}/ProformaInvoice/GetProformaInvoices`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response.proformaInvoices;
        });
}

function CreateProformaInvoice(invoiceDateTime, isAliasName, invoiceNumber, remarks, gstin, isAddressModified,
    address, countryID, stateID, pincode, billedToLedgerId,particulars, bankAccounts) {

    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            invoiceDateTime,
            isAliasName,
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
    return fetch(`${Config.SERVER_URL}/ProformaInvoice/AddProformaInvoice`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response;
        });
}

function DownloadProformaInvoice(id, salesInvoiceNumber) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            id
        })
    };
    return fetch(`${Config.SERVER_URL}/ProformaInvoice/DownlodeProformaInvoice`, requestOptions)
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
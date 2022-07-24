import Config from '../config';
import { handleResponse } from '../helpers/handle-response';
import { authHeader } from '../helpers/auth-header';

export const DualTransactionService = {
    AddDualTransaction,
    GetDualTransactions,
    DownlodeDualTransactionInvoice
};
function AddDualTransaction(
    date,
    voucherType,
    invoiceNumber,
    narration,
    paidToReceivedByLedgerId,
    ledgerHeads,
    adjDeductions,
    paymentReceiptModes
) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            date,
            voucherType,
            invoiceNumber,
            narration,
            paidToReceivedByLedgerId,
            ledgerHeads,
            adjDeductions,
            paymentReceiptModes
        })
    };
    return fetch(`${Config.SERVER_URL}/DualTransaction/AddDualTransaction`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response;
        });
}

function GetDualTransactions(startDate, endDate) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ startDate, endDate })
    };
    return fetch(`${Config.SERVER_URL}/DualTransaction/GetDualTransactions`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response.data;
        });
}
function DownlodeDualTransactionInvoice(invoiceNumber) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            invoiceNumber
        })
    };
    
    return fetch(`${Config.SERVER_URL}/DualTransaction/DownlodeDualTransactions`, requestOptions)
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
            a.download = `DualTransactioinInvoice_${invoiceNumber}.pdf`;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove();  //afterwards we remove the element again   
        })
        .catch((error) => {
            return Promise.reject(error);
        });

}
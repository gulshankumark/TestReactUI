import Config from '../config';
import { handleResponse } from '../helpers/handle-response';
import { authHeader, authUploadHeader } from '../helpers/auth-header';
import * as moment from 'moment';

export const PaymentReceiptService = {
    CreatePaymentReceipt,
    GetModeOfPayment,
    GetTransactionType,
    GetPaymentReceipts,
    DownloadPaymentReceipts,
    DownloadPaymentReceiptsReport,
    DownloadMoneyReceipts
};

function CreatePaymentReceipt(VoucherType, Date, ModeOfPaymentId, TransactionModeId, TransactionDetails, Narration, LedgerDetails,InvoiceNumber) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            VoucherType,
            Date,
            ModeOfPaymentId,
            TransactionModeId,
            TransactionDetails,
            Narration,
            LedgerDetails,
            InvoiceNumber
        })
    };
    return fetch(`${Config.SERVER_URL}/PaymentReceipt/AddPaymentReceipt`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response;
        });
}

function GetModeOfPayment() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${Config.SERVER_URL}/PaymentReceipt/GetModeOfPayment`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response.modeOfPayments;
        });
}

function GetTransactionType() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${Config.SERVER_URL}/PaymentReceipt/GetTransactionMode`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response.transactionMode;
        });
}

function GetPaymentReceipts(StartDate, EndDate) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            StartDate,
            EndDate
        })
    };
    return fetch(`${Config.SERVER_URL}/PaymentReceipt/GetPaymentReceipts`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response.paymentReceiptData;
        });
}
function DownloadPaymentReceipts(id, voucherNumber) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            id
        })
    };
    return fetch(`${Config.SERVER_URL}/PaymentReceipt/DownloadPaymentReceipts`, requestOptions)
        .then((response) => {
            if (response.ok) {
                return response.blob();
            } else {
                return response.text().then((t) => {
                    return Promise.reject(JSON.parse(t));
                });
            }
        })
        .then((blob) => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            //a.setAttribute('href', 'data:text/plain;UTF-8');
            a.href = url;
            a.download = `Invoice_${voucherNumber}.pdf`;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove(); //afterwards we remove the element again
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}

function DownloadPaymentReceiptsReport(startDate, endDate) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            startDate,
            endDate
        })
    };
    return fetch(`${Config.SERVER_URL}/PaymentReceipt/DownloadPaymentReceiptsReport`, requestOptions)
        .then((response) => {
            if (response.ok) {
                return response.blob();
            } else {
                return response.text().then((t) => {
                    return Promise.reject(JSON.parse(t));
                });
            }
        })
        .then((blob) => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            //a.setAttribute('href', 'data:text/plain;UTF-8');
            a.href = url;
            a.download = `PaymentReceiveReport_${moment(startDate).format('DD_MM_YYYY')}_To_${moment(endDate).format('DD_MM_YYYY')}.pdf`;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove(); //afterwards we remove the element again
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}
function DownloadMoneyReceipts( id) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            id
        })
    };
    return fetch(`${Config.SERVER_URL}/PaymentReceipt/DownloadMoneyReceipts`, requestOptions)
        .then((response) => {
            if (response.ok) {
                return response.blob();
            } else {
                return response.text().then((t) => {
                    return Promise.reject(JSON.parse(t));
                });
            }
        })
        .then((blob) => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = `MoneyReceipt_${"2022"}.pdf`;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove(); //afterwards we remove the element again
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}

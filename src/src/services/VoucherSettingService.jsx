import Config from '../config';
import { handleResponse } from '../helpers/handle-response';
import { authHeader } from '../helpers/auth-header';

export const VoucherSettingService = {
    getVoucherSetting,
    updateVoucherSetting,
    salesInvoiceSettingType,
    paymentVoucherSettingType,
    receiptVoucherSettingType,
    journalVoucherSettingType,
    dualTransactionPaymentSettingType,
    dualTransactionReceiptSettingType,
    proformaInvoiceSettingType
};

function dualTransactionReceiptSettingType() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${Config.SERVER_URL}/voucherSettings/DualTransactionReceiptSettingType`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response;
        });
}

function dualTransactionPaymentSettingType() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${Config.SERVER_URL}/voucherSettings/DualTransactionPaymentSettingType`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response;
        });
}

function salesInvoiceSettingType() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${Config.SERVER_URL}/voucherSettings/SalesInvoiceSettingType`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response;
        });
}
function proformaInvoiceSettingType() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${Config.SERVER_URL}/voucherSettings/ProformaInvoiceSettingType`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response;
        });
}

function paymentVoucherSettingType() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${Config.SERVER_URL}/voucherSettings/PaymentVoucherSettingType`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response;
        });
}

function receiptVoucherSettingType() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${Config.SERVER_URL}/voucherSettings/ReceiptVoucherSettingType`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response;
        });
}

function journalVoucherSettingType() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${Config.SERVER_URL}/voucherSettings/JournalVoucherSettingType`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response;
        });
}

function getVoucherSetting() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${Config.SERVER_URL}/voucherSettings/getVoucherSettings`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response.voucherSettingsEntities;
        });
}

function updateVoucherSetting(settings) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ settings })
    };

    return fetch(`${Config.SERVER_URL}/voucherSettings/EditVoucherSettings`, requestOptions)
        .then(handleResponse)
        .then((response) => {});
}

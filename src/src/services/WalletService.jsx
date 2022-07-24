import Config from '../config.js';
import { handleResponse } from '../helpers/handle-response';
import { authHeader } from '../helpers/auth-header';

export const WalletService = {
    getAllWallets,
    getWalletInfo,
    addWalletInfo,
    updateBalance,
    getBbscServices,
    getPaymentHash,
    updatePaymentStatus,
    getUsersForWallet,
};

function getUsersForWallet() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    }

    return fetch(`${Config.SERVER_URL}/wallet/getUsersForWallet`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response.users;
        });
}

function updatePaymentStatus(txnStatus, txnMessage, id, hash, mode, error_Message, bankCode, net_Amount_Debit, status, isConsentPayment, error, addedOn,
    encryptedPaymentId, bank_Ref_Num, unmappedStatus, payuMoneyId, mihPayId, giftCardIssued, field1, cardNum, amount_Split, pG_TYPE,
    name_On_Card) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            id, hash, mode, error_Message, bankCode, net_Amount_Debit, status, isConsentPayment, error, addedOn,
            encryptedPaymentId, bank_Ref_Num, unmappedStatus, payuMoneyId, mihPayId, giftCardIssued, field1, cardNum, amount_Split, pG_TYPE,
            name_On_Card, txnStatus, txnMessage
        })
    }

    return fetch(`${Config.SERVER_URL}/payment/UpdatePaymentStatus`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response;
        });
}

function getPaymentHash(amount, surl, furl) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ amount, surl, furl })
    }

    return fetch(`${Config.SERVER_URL}/payment/getpaymenthash`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response;
        });
}

function getAllWallets() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    }

    return fetch(`${Config.SERVER_URL}/wallet/getallwallets`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response;
        });
}

function getBbscServices() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    }

    return fetch(`${Config.SERVER_URL}/wallet/getbbscservices`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response;
        });
}

function getWalletInfo() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    }

    return fetch(`${Config.SERVER_URL}/wallet/getwalletinfo`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response;
        });
}

function addWalletInfo(email) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ email })
    }

    return fetch(`${Config.SERVER_URL}/wallet/addwalletinfo`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response;
        });
}

function updateBalance(walletId, amount, isCredit, bbscService, description) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ walletId, amount, isCredit, bbscService, description })
    }

    return fetch(`${Config.SERVER_URL}/wallet/updatebalance`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response;
        });
}
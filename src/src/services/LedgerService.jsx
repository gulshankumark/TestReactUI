import Config from '../config';
import { handleResponse } from '../helpers/handle-response';
import { authHeader, authUploadHeader } from '../helpers/auth-header';

export const LedgerService = {
    createLedger,
    UpdateLedger,
    getSections,
    getNatureOfPersonEntities,
    getGstRates,
    getAccountTypes,
    getBalanceTypes,
    getLedgers,
    getContraLedgers,
    getLedger,
    getSalesInvoices,
    getParticularLedgers,
    getBankAccountLedgers,
    getLedgerReport,
    DownloadLedgerReport
};

function getLedgerReport(startDate, endDate, ledgerId) {

    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ startDate, endDate, ledgerId })
    };

    return fetch(`${Config.SERVER_URL}/Ledger/GetLedgerReport`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response;
        });


}

function createLedger(
    name,
    aliasName,
    groupId,
    billWise,
    address,
    stateId,
    pincode,
    pan,
    gstin,
    natureOfPersonId,
    activePaymentOrReceiptMode,
    gstApplicable,
    gstRateId,
    reserveCharge,
    sacCode,
    quantityApplicable,
    tdsApplicable,
    tcsApplicable,
    contactPerson,
    designation,
    mobileNumber,
    phoneNumber,
    whatsappNumber,
    emailId,
    accountNumber,
    accountNature,
    ifsc,
    bankName,
    micr,
    branch,
    openingBalance,
    balanceType,
    effectiveFrom
) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            name,
            aliasName,
            groupId,
            billWise,
            address,
            stateId,
            pincode,
            pan,
            gstin,
            natureOfPersonId,
            activePaymentOrReceiptMode,
            gstApplicable,
            gstRateId,
            reserveCharge,
            sacCode,
            quantityApplicable,
            tdsApplicable,
            tcsApplicable,
            contactPerson,
            designation,
            mobileNumber,
            phoneNumber,
            whatsappNumber,
            emailId,
            accountNumber,
            accountNature,
            ifsc,
            bankName,
            micr,
            branch,
            openingBalance,
            balanceType,
            effectiveFrom
        })
    };

    return fetch(`${Config.SERVER_URL}/Ledger/CreateLedger`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response;
        });
}

function UpdateLedger(
    LedgerId,
    AddressId,
    Name,
    AliasName,
    GroupId,
    Address,
    StateId,
    Pincode,
    Pan,
    Gstin,
    QuantityApplicable,
    ContactPerson,
    Designation,
    MobileNumber,
    PhoneNumber,
    WhatsappNumber,
    EmailId,
    AccountNumber,
    AccountNature,
    openingBalance,
    balanceType,
    ledgerEffectiveFrom
) {

    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            LedgerId,
            GroupId,
            Name,
            AliasName,
            Address,
            AddressId,
            StateId,
            Pincode,
            Pan,
            Gstin,
            QuantityApplicable,
            ContactPerson,
            Designation,
            MobileNumber,
            PhoneNumber,
            WhatsappNumber,
            EmailId,
            AccountNumber,
            AccountNature,
            balanceType,
            openingBalance,
            ledgerEffectiveFrom
        })
    };
    return fetch(`${Config.SERVER_URL}/Ledger/UpdateLedger`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response;
        });
}

function getSections(accountGroupId) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ accountGroupId })
    };

    return fetch(`${Config.SERVER_URL}/Ledger/GetSectionsToEnable`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response;
        });
}

function getNatureOfPersonEntities() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${Config.SERVER_URL}/Ledger/GetNatureOfPerson`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response.natureOfPersonEntities;
        });
}

function getGstRates() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${Config.SERVER_URL}/Ledger/GetGstRates`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response.gstRateEntities;
        });
}

function getAccountTypes() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${Config.SERVER_URL}/Ledger/GetAccountTypes`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response.accountTypeEntities;
        });
}

function getBalanceTypes() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${Config.SERVER_URL}/Ledger/GetBalanceTypes`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response.balanceTypeEntities;
        });
}

function getLedgers() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${Config.SERVER_URL}/Ledger/GetLedgers`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response.ledgerRoot;
        });
}

function getContraLedgers() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return fetch(`${Config.SERVER_URL}/Ledger/GetContraLedgers`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            console.log(response);
            return response.ledgerRoot;
        });
}

function getLedger(ledgerId) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ ledgerId })
    };

    return fetch(`${Config.SERVER_URL}/Ledger/GetLedger`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            console.log(response);
            return response.ledgerEntity;
        });
}

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

function getParticularLedgers() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${Config.SERVER_URL}/Ledger/GetParticularLedgers`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response.ledgerRoot;
        });
}

function getBankAccountLedgers() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${Config.SERVER_URL}/Ledger/GetBankAccountLedgers`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response.ledgerRoot;
        });
}

function DownloadLedgerReport(startDate, endDate, ledgerId, ledgerName) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            startDate,
            endDate,
            ledgerId
        })
    };
    return fetch(`${Config.SERVER_URL}/Ledger/DownloadLedgerReport`, requestOptions)
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
            a.download = `LedgerReport_${ledgerName}.pdf`;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove();  //afterwards we remove the element again
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}

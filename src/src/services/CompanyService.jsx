import Config from '../config';
import { handleResponse } from '../helpers/handle-response';
import { authHeader, authUploadHeader } from '../helpers/auth-header';

export const CompanyService = {
    getCompanyPan,
    getCompanies,
    updateCompany,
    getCompanyDetails,
    getCountry,
    getState,
    getRoundOffFactors
};

function getRoundOffFactors() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${Config.SERVER_URL}/company/getRoundOffFactors`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response.roundOffFactors;
        });
}

function getCompanyPan() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${Config.SERVER_URL}/company/getPan`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response.pan;
        });
}

function getCompanies() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${Config.SERVER_URL}/company/getcompanies`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response.companies;
        });
}

function getCompanyDetails() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${Config.SERVER_URL}/company/GetCompanyDetails`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response;
        });
}

///////////////Change by Bapi Dutta
function updateCompany(
    companyName,
    address,
    aliasName,
    mailingName,
    countryId,
    stateId,
    pincode,
    phoneNo,
    mobileno,
    whatsappno,
    website,
    pan,
    isGstApplicable,
    gstnumber,
    gstUserName,
    gstStateCode,
    gstapplicablefrom,
    isTdsApplicable,
    tinNumber,
    tdsapplicablefrom
) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            companyName,
            address,
            aliasName,
            mailingName,
            countryId,
            stateId,
            pincode,
            phoneNo,
            mobileno,
            whatsappno,
            website,
            pan,
            isGstApplicable,
            gstnumber,
            gstUserName,
            gstStateCode,
            gstapplicablefrom,
            isTdsApplicable,
            tinNumber,
            tdsapplicablefrom
        })
    };

    return fetch(`${Config.SERVER_URL}/company/UpdateCompany`, requestOptions)
        .then(handleResponse)
        .then((response) => {});
}

function getCountry() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${Config.SERVER_URL}/Location/GetCountries`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response.countries;
        });
}
function getState(countryID) {
    var CountryId = countryID.value;
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ CountryId })
    };

    return fetch(`${Config.SERVER_URL}/Location/GetStates`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response.states;
        });
}

import Config from '../config';
import { handleResponse } from '../helpers/handle-response';
import { authHeader } from '../helpers/auth-header';

export const DashboardService = {
    GetLiquidFundLedgers,
    GetDayBook,
    GetProfitLoss,
    GetSundryDebtorsCreditorsSummary
};


function GetLiquidFundLedgers() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${Config.SERVER_URL}/Dashboard/GetLiquidFundLedgers`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response.ledgerRoot;
        });
}

function GetDayBook() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${Config.SERVER_URL}/Dashboard/GetDayBook`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response.data;
        });
}


function GetProfitLoss() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${Config.SERVER_URL}/Dashboard/GetProfitLoss`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response;
        });
}

function GetSundryDebtorsCreditorsSummary() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${Config.SERVER_URL}/Dashboard/GetSundryDebtorsCreditorsSummary`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response.data;
        });
}
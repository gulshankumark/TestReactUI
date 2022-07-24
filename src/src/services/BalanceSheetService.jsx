import Config from '../config';
import { handleResponse } from '../helpers/handle-response';
import { authHeader } from '../helpers/auth-header';

export const BalanceSheetService = {
    getBalanceSheet
};

function getBalanceSheet(fromDate, toDate) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ fromDate, toDate })
    };

    return fetch(`${Config.SERVER_URL}/BalanceSheet/GetBalanceSheet`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response.balanceSheetData;
        });
}

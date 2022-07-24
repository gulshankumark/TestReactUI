import Config from '../config';
import { handleResponse } from '../helpers/handle-response';
import { authHeader } from '../helpers/auth-header';

export const ProfitLossService = {
    getProfitLoss
};

function getProfitLoss(fromDate, toDate) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ fromDate, toDate })
    };

    return fetch(`${Config.SERVER_URL}/ProfitLoss/GetProfitLoss`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response.profitLossData;
        });
}

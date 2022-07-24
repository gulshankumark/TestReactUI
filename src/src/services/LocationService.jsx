import Config from '../config';
import { handleResponse } from '../helpers/handle-response';
import { authHeader, authUploadHeader } from '../helpers/auth-header';

export const LocationService = {
    getCountry,
    getStates,
    getStateCountry
};

function getStateCountry(stateId) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ stateId })

    };

    return fetch(`${Config.SERVER_URL}/Location/GetStateCountry`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response;
        });
}

function getCountry() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${Config.SERVER_URL}/Location/GetCountries`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response.countries;
        });
}

function getStates(countryId) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ countryId })

    };

    return fetch(`${Config.SERVER_URL}/Location/GetStates`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response.states;
        });
}
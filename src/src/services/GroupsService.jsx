import Config from '../config';
import { handleResponse } from '../helpers/handle-response';
import { authHeader } from '../helpers/auth-header';

export const GroupsService = {
    getAccountGroups,
    saveAccountGroups,
    updateAccountGroup,
};

function updateAccountGroup(id, name, description) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ id, name, description })
    };

    return fetch(`${Config.SERVER_URL}/AccountGroup/UpdateAccountGroup`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response;
        });
}

function getAccountGroups() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${Config.SERVER_URL}/AccountGroup/GetAccountGroups`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response.accountGroupRoot;
        });
}
function saveAccountGroups(name, ParentGroupId, description) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ name, description, ParentGroupId })
    };

    return fetch(`${Config.SERVER_URL}/AccountGroup/CreateAccountGroup`, requestOptions)
        .then(handleResponse)
        .then(response => {
        });
}
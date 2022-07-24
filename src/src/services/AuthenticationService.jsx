import { BehaviorSubject } from 'rxjs';
import Config from '../config.js';
import { handleResponse } from '../helpers/handle-response';
import { authHeader } from '../helpers/auth-header';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const AuthenticationService = {
    superAdmin: "SuperAdmin",
    admin: "Admin",
    clientAdmin: "ClientAdmin",
    clientUser: "ClientUser",
    login,
    logout,
    checkUsername,
    changePassword,
    createUserWithCompany,
    createUser,
    GetLiquidFundLedgers,
    getGroups,
    getRoles,
    getFeesFrequency,
    getServices,
    getClientServices,
    getUserDetails,
    resetPassword,
    forgotPassword,
    editUser,
    addGroup,
    addService,
    getAdminUsersOnly,
    getClientUsersOnly,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() { return currentUserSubject.value }
};

function getAdminUsersOnly() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    }

    return fetch(`${Config.SERVER_URL}/auth/getonlyadminusers`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response.users;
        });
}

function getClientUsersOnly() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    }

    return fetch(`${Config.SERVER_URL}/auth/getonlyclientusers`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response.users;
        });
}

function getUserDetails(email) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ email })
    };

    return fetch(`${Config.SERVER_URL}/auth/getuserdetails`, requestOptions)
        .then(handleResponse)
        .then(retVal => {
            return retVal;
        });
}

function editUser(fullName, company, email, phoneNumber, address, departmentEmail, departmentPhoneNumber, country, state, pan, tan, gstin, fees, feesFrequencyId, hasGroup, groupId, services) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ fullName, company, email, phoneNumber, address, departmentEmail, departmentPhoneNumber, country, state, pan, tan, gstin, fees, feesFrequencyId, hasGroup, groupId, services })
    };

    return fetch(`${Config.SERVER_URL}/auth/updateuser`, requestOptions)
        .then(handleResponse)
        .then(retVal => {
            return retVal;
        });
}

function addService(serviceName, serviceDescription) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ serviceName, serviceDescription })
    };

    return fetch(`${Config.SERVER_URL}/auth/addService`, requestOptions)
        .then(handleResponse)
        .then(retVal => {
            return retVal.result;
        });
}

function addGroup(groupName) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ groupName })
    };

    return fetch(`${Config.SERVER_URL}/auth/addGroup`, requestOptions)
        .then(handleResponse)
        .then(retVal => {
            return retVal.result;
        });
}

function forgotPassword(userName) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName })
    };

    return fetch(`${Config.SERVER_URL}/auth/forgetpassword`, requestOptions)
        .then(handleResponse)
        .then(retVal => {
            return retVal;
        });
}

function resetPassword(userName, token, newPassword, confirmNewPassword) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, token, newPassword, confirmNewPassword })
    };

    return fetch(`${Config.SERVER_URL}/auth/resetpassword`, requestOptions)
        .then(handleResponse)
        .then(retVal => {
            return retVal;
        });
}

function login(userName, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, password })
    };

    return fetch(`${Config.SERVER_URL}/auth/login`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);
            return user;
        });
}

function getGroups() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${Config.SERVER_URL}/auth/getgroups`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response.groups;
        });
}

function getRoles() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${Config.SERVER_URL}/auth/getroles`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response.allRoles;
        });
}

function getFeesFrequency() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${Config.SERVER_URL}/auth/getfeesfrequency`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response.feesFrequencies;
        });
}

function getServices() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${Config.SERVER_URL}/auth/getservices`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response.services;
        });
}

function getClientServices(email) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ email })
    };

    return fetch(`${Config.SERVER_URL}/auth/getservicesforuser`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response.services;
        });
}

function changePassword(oldPassword, newPassword, confirmPassword) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ oldPassword, newPassword, confirmPassword })
    };

    return fetch(`${Config.SERVER_URL}/auth/changepassword`, requestOptions)
        .then(handleResponse)
        .then(response => {
        });
}

function checkUsername(userName) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ userName })
    };

    return fetch(`${Config.SERVER_URL}/auth/checkuserexists`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response;
        });
}

function createUserWithCompany(fullName, userName, email, password, confirmPassword, phoneNumber, role, companyName, pan, address, countryId, stateId,pincode,roundOffFactorId) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ fullName, userName, email, password, confirmPassword, phoneNumber, role, companyName, address, pan, address, countryId, stateId,pincode,roundOffFactorId })
    };

    return fetch(`${Config.SERVER_URL}/auth/registerwithnewcompany`, requestOptions)
        .then(handleResponse)
        .then(response => {
        });
}

function createUser(fullName, userName, password, confirmPassword, phoneNumber, role, companyId) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ fullName, userName, password, confirmPassword, phoneNumber, role, companyId })
    };

    return fetch(`${Config.SERVER_URL}/auth/registeruser`, requestOptions)
        .then(handleResponse)
        .then(response => {
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}


function GetLiquidFundLedgers() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${Config.SERVER_URL}/Dashboard/GetLiquidFundLedgers`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response.groups;
        });
}

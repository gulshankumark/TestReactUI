import Config from '../config.js';
import { handleResponse } from '../helpers/handle-response';
import { authHeader } from '../helpers/auth-header';

export const TaskService = {
    getTasks,
    getTaskDetails,
    addTask,
    addImmediateTask,
    addComment,
    changeStatus,
    cancelTask,
    getTaskBasics
};

function cancelTask(taskId, cancellationReason) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ taskId, cancellationReason })
    }

    return fetch(`${Config.SERVER_URL}/task/canceltask`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response.status;
        });
}

function changeStatus(taskId) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ taskId })
    }

    return fetch(`${Config.SERVER_URL}/task/updatestatus`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response.status;
        });
}

function addComment(taskId, comment) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ taskId, comment })
    }

    return fetch(`${Config.SERVER_URL}/task/addcomment`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response.status;
        });
}

function addTask(taskName, description, startDateTime, endDateTime, assignedToUserEmail, taskForClientEmail, serviceId) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ taskName, description, startDateTime, endDateTime, assignedToUserEmail, taskForClientEmail, serviceId })
    }

    return fetch(`${Config.SERVER_URL}/task/createtask`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response;
        });
}

function addImmediateTask(taskName, description, startDateTime, endDateTime, taskForClientEmail, serviceId) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ taskName, description, startDateTime, endDateTime, taskForClientEmail, serviceId })
    }

    return fetch(`${Config.SERVER_URL}/task/createtaskandcomplete`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response;
        });
}

function getTasks(adminUserEmails, clientEmails, statusId, taskName, taskDescription) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ adminUserEmails, clientEmails, statusId, taskName, taskDescription })
    }

    return fetch(`${Config.SERVER_URL}/task/gettasks`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response;
        });
}

function getTaskDetails(taskId) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ taskId })
    }

    return fetch(`${Config.SERVER_URL}/task/gettaskdetails`, requestOptions)
        .then(handleResponse)
        .then(response => {
            return response;
        });
}

function getTaskBasics() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    }

    return fetch(`${Config.SERVER_URL}/task/getaggregatedtasks`, requestOptions)
        .then(handleResponse)
        .then(response => {
            console.log(response);
            return response;
        });
}
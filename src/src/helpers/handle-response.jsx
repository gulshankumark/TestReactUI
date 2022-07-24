import { AuthenticationService } from '../services/AuthenticationService';

export function handleResponse(response) {
    return response.text().then(text => {
        if (!response.ok || !response.status == 201) {
            if ([401, 403].indexOf(response.status) !== -1) {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                AuthenticationService.logout();
                window.location.reload(true);
            }

            const error = text;
            return Promise.reject(error);
        }

        const data = text && JSON.parse(text);
        if(!data.isSuccess){
            return Promise.reject(data.message);
        }        
        return data;
    });
}
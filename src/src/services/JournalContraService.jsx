import Config from '../config';
import { handleResponse } from '../helpers/handle-response';
import { authHeader } from '../helpers/auth-header';
import * as moment from 'moment';

export const JournalContraService = {
    AddJournalContra,
    GetJournalContras,
    DownloadJournalContras,
    DownJournalContraReports
};

function AddJournalContra(VoucherType, Date, Narration, Particulars, InvoiceNumber) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            VoucherType,
            Date,
            Narration,
            Particulars,
            InvoiceNumber
        })
    };
    return fetch(`${Config.SERVER_URL}/JournalContra/AddJournalContra`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response;
        });
}

function GetJournalContras(StartDate, EndDate) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ StartDate, EndDate })
    };

    return fetch(`${Config.SERVER_URL}/JournalContra/GetJournalContras`, requestOptions)
        .then(handleResponse)
        .then((response) => {
            return response.journalContraEntities;
        });
}

function DownloadJournalContras(id, voucherNumber) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({
            id
        })
    };
    return fetch(`${Config.SERVER_URL}/JournalContra/DownloadJournalContras`, requestOptions)
        .then((response) => {
            if (response.ok) {
                return response.blob();
            } else {
                return response.text().then((t) => {
                    return Promise.reject(JSON.parse(t));
                });
            }
        })
        .then((blob) => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            //a.setAttribute('href', 'data:text/plain;UTF-8');
            a.href = url;
            a.download = `Invoice_${voucherNumber}.pdf`;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove(); //afterwards we remove the element again
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}

function DownJournalContraReports(StartDate, EndDate) {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ StartDate, EndDate })
    };

    return fetch(`${Config.SERVER_URL}/JournalContra/DownloadJournalContrasReport`, requestOptions)
        .then((response) => {
            if (response.ok) {
                return response.blob();
            } else {
                return response.text().then((t) => {
                    return Promise.reject(JSON.parse(t));
                });
            }
        })
        .then((blob) => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            //a.setAttribute('href', 'data:text/plain;UTF-8');

            a.href = url;
            a.download = `JournalContraReport_${moment(StartDate).format('DD_MM_YYYY')}_To_${moment(EndDate).format('DD_MM_YYYY')}.pdf`;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove(); //afterwards we remove the element again
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}

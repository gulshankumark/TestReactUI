import React from 'react';

export const GstGridCell = {
    NumberCellRender,
    FromCellRender,
    ToCellRender,
    TotallNumberCellRender,
    CancleRender,
    NetIssueRender
};
function NumberCellRender(cellData) {
    return (
        <div>
            {cellData.data.num.map((docIssueData) => (
                <li>{docIssueData.num}</li>
            ))}
        </div>
    );
}

function FromCellRender(cellData) {
    return (
        <div>
            {cellData.data.from.map((docIssueData) => (
                <li>{docIssueData.from}</li>
            ))}
        </div>
    );
}

function ToCellRender(cellData) {
    return (
        <div>
            {cellData.data.to.map((docIssueData) => (
                <li>{docIssueData.to}</li>
            ))}
        </div>
    );
}

function TotallNumberCellRender(cellData) {
    return (
        <div>
            {cellData.data.totnum.map((docIssueData) => (
                <li>{docIssueData.totnum}</li>
            ))}
        </div>
    );
}

function CancleRender(cellData) {
    return (
        <div>
            {cellData.data.cancel.map((docIssueData) => (
                <li>{docIssueData.cancel}</li>
            ))}
        </div>
    );
}

function NetIssueRender(cellData) {
    return (
        <div>
            {cellData.data.netIssue.map((docIssueData) => (
                <li>{docIssueData.netIssue}</li>
            ))}
        </div>
    );
}
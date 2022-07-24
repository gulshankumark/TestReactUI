import React from 'react';

export default function DiffLedgerName(cellData) {
    return (
        <ul>
            {cellData.data.ledgerDetails.map((gp) => (
                <li>{gp.ledgerName}</li>
            ))}
        </ul>
    );
}

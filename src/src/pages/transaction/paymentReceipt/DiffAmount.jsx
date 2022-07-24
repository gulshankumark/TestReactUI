import React from 'react';

export default function DiffAmount(cellData) {
    return (
        <ul>
            {cellData.data.ledgerDetails.map((gp) => (
                <li>{gp.amount}</li>
            ))}
        </ul>
    );
}

import React from 'react';

export default function CreditAmount(cellData) {
     return <div>{cellData.data && cellData.data.CreditAmount.map((gp) => <div>{gp.creditAmount}</div>)}</div>;
}

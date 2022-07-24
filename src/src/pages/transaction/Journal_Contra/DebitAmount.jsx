import React from 'react';

export default function DebitAmount(cellData) {

    return <div>{cellData.data && cellData.data.DebitAmount.map((gp) => <div>{gp.debitAmount}</div>)}</div>;
}

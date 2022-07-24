import React from 'react';

export const LedgersName = {
    // const styles = {
    //     italic: { fontStyle: 'italic' }

    Ledger,
    DebitAmount,
    CreditAmount
};
function Ledger(cellData) {
    return (
        <div>
            <div><b>{cellData.data.PartyNameTop}</b></div>
            {cellData.data &&
                cellData.data.ledgersData.map((gp) => (
                    <div>
                        {gp.ledgersName}

                        {/* <span style={styles.italic}> */}
                        {/* {gp.narration} */}
                        {/* </span> */}
                        {/* {gp.narration} */}
                    </div>
                ))}
            <div><b>{cellData.data.PartyNameButtom}</b></div>
            
            <div>{cellData.data.ladgerNarration}</div>
        </div>
    );
}

function DebitAmount(cellData) {
    return (
    <div>
        <div>{cellData.data.topAmountDebit}</div>
        {cellData.data && cellData.data.debitAmount.map((gp) => 
            <div>
                {gp.debitAmount}
            </div>
        )}
        <div>{cellData.data.buttomAmountDebit}</div>
    </div>);
}

function CreditAmount(cellData) {
    return (
    <div>
        <div>{cellData.data.topAmountCredit}</div>
        {cellData.data && cellData.data.creditAmount.map((gp) => 
            <div>
                {gp.creditAmount}
            </div>
        )}
        <div>{cellData.data.buttomAmountCredit}</div>
    </div>);
}

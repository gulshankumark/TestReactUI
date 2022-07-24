import React from 'react';

export default function LedgersName(cellData) {

    const styles = {
        italic: { fontStyle: 'italic' }

    };
    return <ul>
        {cellData.data && cellData.data.Ledgers.map((gp) =>
            <li>{gp.ledgersName}
                <br />

                <span style={styles.italic}>{gp.narration}</span>
                {/* {gp.narration} */}
            </li>
        )}</ul>;
}

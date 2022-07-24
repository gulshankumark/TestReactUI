import React, { useState } from 'react';

export default function DifferenceDescribtion(cellData) {
    const styles = {
        italic: { fontStyle: 'italic' }
    };
    return (
        <ul>
            {cellData.data.Description.map((gp) => (
                <li>
                    {gp.particularDetails}
                    {gp.count == cellData.data.Description.length &&  (
                        <div style={styles.italic}>{cellData.data.narration ?  cellData.data.narration:''}</div>
                    )}
                    
                </li>
            ))}
        </ul>
    );
}

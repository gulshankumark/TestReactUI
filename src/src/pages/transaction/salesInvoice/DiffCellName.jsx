import { data } from 'jquery';
import React from 'react';
import { Tooltip,OverlayTrigger} from 'react-bootstrap';


export default function DiffCellName(cellData) {

    
    const styles = {
        italic: { fontStyle: 'italic' }
    };

    
   

    return (
      
       
        <ul>
        
        
            {cellData.data.Pname.map((gp) => (
                <li>
                    {gp.name}
                    {/*<br />*/}
                   {/* <div style={styles.italic}>{gp.narration ? (gp.narration.length > 20 ? gp.narration.substring(0, 25) + '...' : gp.narration) : ''}</div>*/}
      
                </li>
            ))}
        </ul>
    );
}

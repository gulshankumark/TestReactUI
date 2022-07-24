import React from 'react';


export default function DiffCellAmount(cellData)
{
  return (
    
    <ul>
      {cellData.data.Pname.map(gp=> (
        <li>{gp.taxableAmount} <br/>
        {/*{gp.narration!=null?<br/>:""}*/}
        </li>

      ))}
    </ul>
  );
}
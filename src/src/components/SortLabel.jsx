import React, { useState } from 'react';



const SortingIcon = ({ direction }) => (
  <span
    className={`oi oi-arrow-thick-${direction === 'asc' ? 'top' : 'bottom'}`}
    style={{ fontSize: '12px', paddingLeft: '5px' }}
  />
);

const SortLabel = ({ onSort, children, direction }) => (
  <button
    type="button"
    className="btn btn-light btn-sm"
    onClick={onSort}
  >
    {children}
    {(direction && <SortingIcon direction={direction} />)}
  </button>
);
export default SortLabel;
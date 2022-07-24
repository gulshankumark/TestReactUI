import React from "react";


const Modaltwo = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div onClick={onClose} className='overlay'>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className='modalContainer'
      >
        <div className='modalRight'>
          <p className='closeBtn' onClick={onClose}>
            <b>X</b>
          </p>
          <div className='content'>
            <p>Thanks for Contacting us</p>
            <h1>TransWonders</h1>
            <p>Our team Members will contact with you withing 2 to 3 days at business hours</p>
          </div>
          <div className='btnContainer'>
            <button
              onClick={onClose}
              className='btnPrimary'>
              <span className='bold'>Close</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Modaltwo;

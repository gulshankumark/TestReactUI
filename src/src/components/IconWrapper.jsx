import * as React from 'react';
const IconWrapper = (props) => {
    return props.icon ?<div className={props.icon}></div> : null;
};
export default IconWrapper;
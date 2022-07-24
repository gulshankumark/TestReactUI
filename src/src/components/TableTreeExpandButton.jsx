import * as React from "react";
import IconWrapper from './IconWrapper';
import { Button } from 'react-bootstrap';

const TableTreeExpandButton = ({
    visible,
    expanded,
    classes,
    onToggle,
    className,
    ...restProps
}) => (
    <Button
        className={`btn-light btn-sm ${className}`}
        style={{ "backgroundColor": "transparent", "width": "3em" }}
        disabled={visible ? false : true}
        onClick={(e) => {
            e.stopPropagation();
            onToggle();
        }}
        tabIndex={0}
        {...restProps}
    >
        {visible && (expanded ? <IconWrapper icon="feather icon-chevron-down" /> : <IconWrapper icon="feather icon-chevron-right" />)}
    </Button>
);

export default TableTreeExpandButton;
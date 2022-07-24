import React from 'react';
export const CustomSwitch = React.forwardRef((props, ref) => {

    const {
        enabled = true,
        defaultChecked = false,
        checked = false,
        name,
        onChange,
        id,
        text,
        value = ""
    } = props

    return (
        <>
            <div className="switch d-inline m-r-10">
                <input type="checkbox" disabled={!enabled} id={id} checked={checked} defaultChecked={defaultChecked} name={name} onChange={onChange} value={value} />
                <label className="cr form-label" htmlFor={name}></label>
            </div>
            <label >&nbsp;&nbsp;{text}</label>
        </>
    )
})

export const CustomGroupSwitch = React.forwardRef((props, ref) => {

    const {
        name,
        onChange,
        values
    } = props

    return (
        <>
            {values.map(x => {
                return <CustomSwitch name={name} onChange={onChange} text={x.name} value={x.id} />
            })}
        </>
    )
})
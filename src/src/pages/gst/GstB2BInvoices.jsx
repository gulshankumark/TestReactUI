import React, { Component } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Config from '../../config';
import { AuthenticationService } from '../../services/AuthenticationService';
import { GstService } from '../../services/GstService';
import TableTreeExpandButton from '../../components/TableTreeExpandButton';
//import SortLabel from '../../components/SortLabel';
import { TreeDataState, CustomTreeData, SortingState, IntegratedSorting, } from '@devexpress/dx-react-grid';
//import { EditingState } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, TableTreeColumn, TableEditRow } from '@devexpress/dx-react-grid-bootstrap4';
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';

class GetB2bInvoices extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            loadGrid: false,

            invoices: [],

            gridColumns: [
                { name: 'gstin', title: 'Gstin' },
                { name: 'invoiceNumber', title: 'Inv Number' },
                { name: 'gstInvoiceDate', title: 'Inv Date' },
                { name: 'totalValue', title: 'Inv Value' },
                { name: 'gstLocation', title: 'Place of supply' },
                { name: 'reverseCharge', title: 'Reverse Charge' },
                { name: 'invoiceType', title: 'Invoice Type' },
                { name: 'rate', title: 'Rate' },
                { name: 'taxableValue', title: 'Taxable Value' },
                { name: 'igst', title: 'IGST' },
                { name: 'cgst', title: 'CGST' },
                { name: 'sgst', title: 'SGST' },
                { name: 'cess', title: 'Cess' },
            ]
        };

        var currentUser = AuthenticationService.currentUserValue;
        if (!currentUser) {
            this.props.history.push(Config.signInPath);
            return;
        }

        if (
            !(
                currentUser.role == AuthenticationService.superAdmin ||
                currentUser.role == AuthenticationService.admin ||
                currentUser.role == AuthenticationService.clientAdmin
            )
        ) {
            AuthenticationService.logout();
            this.props.history.push(Config.signInPath);
        }
    }

    componentDidMount() {
        if (!AuthenticationService.currentUserValue || !AuthenticationService.currentUserValue.isSuperAdmin) {
            this.props.history.push(Config.signInPath);
        }
    }

    getChildRows = (row, rootRows) => {
        const childRows = rootRows.filter(r => r.parentId === (row ? row.id : null));
        return childRows.length ? childRows : null;
    };

    render() {
        return (<>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Get B2b Invoices</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Formik
                                initialValues={{
                                    gstin: '',
                                    returnPeriod: '',
                                    data: JSON.stringify(this.state.data)
                                }}
                                validationSchema={Yup.object().shape({
                                    gstin: Yup.string().required('This field is required')
                                })}
                                onSubmit={({ gstin, returnPeriod }, { setStatus, setSubmitting }) => {
                                    setStatus();
                                    const d = new Date(returnPeriod + '-21');
                                    console.log(d);
                                    // GstService.getB2bInvoices(gstin, returnPeriod)
                                    //     .then(
                                    //         response => {
                                    //             console.log(response);
                                    //             this.setState({ data: JSON.stringify(response.data) });
                                    //             // invoices: response, loadGrid: true
                                    //             setSubmitting(false);

                                    //         },
                                    //         error => {
                                    //             setSubmitting(false);
                                    //             setStatus(error);
                                    //         }
                                    //     );
                                }}
                                render={({ errors, status, touched, isSubmitting }) => (
                                    <>
                                        <Form>
                                            <div className="form-row">
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="gstin">Gstin</label>
                                                    <Field name="gstin" type="text" className={'form-control' + (errors.gstin && touched.gstin ? ' is-invalid' : '')} />
                                                    <ErrorMessage name="gstin" component="div" className="invalid-feedback" />
                                                </div>
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="returnPeriod">Return Period</label>
                                                    <Field name="returnPeriod" type="month" className={'form-control' + (errors.returnPeriod && touched.returnPeriod ? ' is-invalid' : '')} />
                                                    <ErrorMessage name="returnPeriod" component="div" className="invalid-feedback" />
                                                </div>
                                            </div>
                                            <div className="form-group ">
                                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Add Group</button>
                                                {isSubmitting &&
                                                    <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                                }
                                            </div>
                                            {this.state.data &&
                                                <div className="form-row">
                                                    <div className="form-group col-md-12">
                                                        <label htmlFor="data">Data</label>
                                                        <Field component="textarea" readonly={true} rows="4" value={this.state.data}></Field>
                                                        {/* <Field name="data" readonly={true} type="text" className={'form-control' + (errors.data && touched.data ? ' is-invalid' : '')} /> */}
                                                        <ErrorMessage name="data" component="div" className="invalid-feedback" />
                                                    </div>
                                                </div>
                                            }
                                            {status &&
                                                <div className={'alert alert-danger'}>{status}</div>
                                            }
                                        </Form>
                                        {
                                            this.state.loadGrid &&
                                            <Grid
                                                rows={this.state.invoices}
                                                columns={this.state.gridColumns}>
                                                {/* <EditingState
                                        
                                         /> */}
                                                <TreeDataState />
                                                {/* <SortingState defaultSorting={[{columnName:'name',direction:'asc'}]}
                                       
                                        /> */}
                                                <IntegratedSorting />
                                                <CustomTreeData
                                                    getChildRows={this.getChildRows}
                                                />
                                                <Table

                                                />
                                                <TableHeaderRow
                                                //  allowSorting 
                                                //  showSortingControls
                                                //  sortLabelComponent={SortLabel}

                                                />
                                                <TableEditRow />
                                                {/* <TableEditColumn
                                              showAddCommand
                                              showEditCommand
                                              showDeleteCommand
                                             /> */}
                                                <TableTreeColumn for="name"
                                                    expandButtonComponent={TableTreeExpandButton} />

                                            </Grid>
                                        }
                                    </>
                                )}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>);
    }
};
export default GetB2bInvoices;
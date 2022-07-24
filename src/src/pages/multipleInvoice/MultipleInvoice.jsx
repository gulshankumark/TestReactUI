import React, { Component } from 'react';
import { Row, Col, Card, Dropdown, Button,CloseButton} from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';
import Config from '../../config';
import { AuthenticationService } from '../../services/AuthenticationService';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';
import Select from 'react-select';
import * as moment from 'moment';
import 'react-block-ui/style.css';
import { MultiplePrintService } from '../../services/MultiplePrintService';
import * as Yup from 'yup';
import Spinner from '../../components/Spinner';

const Payment = 'Payment';

class MultipleInvoice extends Component {
    constructor(props) {
        super(props);

        this.state = {
            buttonText: 'Multiple Print',
            startDate: '',
            endDate: '',
            loading: false,
            alert: false
        };

        this.DownloadPrint = this.DownloadPrint.bind(this);
        this.startDate = this.startDate.bind(this);
        this.endDate = this.endDate.bind(this);
        this.close=this.close.bind(this);

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
    }
    startDate(e) {
        this.setState({ startDate: e.target.value });
    }
    endDate(e) {
        this.setState({ endDate: e.target.value });
    }
    DownloadPrint(e) {
        this.setState({ alert: false });
        this.setState({ buttonText: e })
    }
    close(e){
        this.setState({ alert: false });
    }
    render() {
        return (
            <>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h5">Multiple Print</Card.Title>
                                {this.state.alert &&
                                    <Alert variant="warning">
                                        <CloseButton variant="warning" onClick={this.close} />
                                        Choose Option Which You Should be Download
                                    </Alert>
                                }

                            </Card.Header>
                        </Card>


                        <Formik
                            enableReinitialize
                            initialValues={{
                                startDate: this.state.startDate,
                                endDate: this.state.endDate,
                            }}
                            validationSchema={Yup.object().shape({

                            })}
                            onSubmit={(
                                {
                                    startDate,
                                    endDate
                                },
                                { setStatus, setSubmitting }
                            ) => {
                                setStatus();

                                if (this.state.buttonText == 'Payment') {
                                    this.setState({ loading: true });
                                    MultiplePrintService.DownloadPaymentPrint(startDate, endDate).then(
                                        (response) => {
                                            this.setState({ loading: false });
                                            setSubmitting(false);
                                            
                                            return response;
                                        },
                                        (error) => {
                                            this.setState({ loading: false });
                                            setSubmitting(false);
                                            
                                        }
                                    );
                                }
                                else if (this.state.buttonText == 'Recipt') {
                                    this.setState({ loading: true });
                                    MultiplePrintService.DownloadReciptPrint(startDate, endDate).then(
                                        (response) => {
                                            this.setState({ loading: false });
                                            setSubmitting(false);
                                            
                                            return response;
                                        },
                                        (error) => {
                                            this.setState({ loading: false });
                                            setSubmitting(false);
                                            
                                        }
                                    );
                                }
                                else if (this.state.buttonText == 'MoneyRecipt') {
                                    this.setState({ loading: true });
                                    MultiplePrintService.DownloadMoneyPrint(startDate, endDate).then(
                                        (response) => {
                                            this.setState({ loading: false });
                                            setSubmitting(false);
                                            
                                            return response;
                                        },
                                        (error) => {
                                            this.setState({ loading: false });
                                            setSubmitting(false);
                                            
                                        }
                                    );
                                }
                                
                                else if (this.state.buttonText == 'JournalContra') { 
                                    this.setState({ alert: false });                                  
                                    this.setState({ loading: true });
                                    MultiplePrintService.DownloadJournalContraPrint(startDate, endDate).then(
                                        (response) => {
                                            this.setState({ loading: false });
                                            setSubmitting(false);
                                            
                                            return response;
                                        },
                                        (error) => {
                                            this.setState({ loading: false });
                                            setSubmitting(false);
                                            
                                        }
                                    );
                                    
                                }
                                else if (this.state.buttonText == 'SalesInvoice') {
                                    this.setState({ alert: false });
                                    this.setState({ loading: true });
                                    MultiplePrintService.DownloadSalesInvoicePrint(startDate, endDate).then(
                                        (response) => {
                                            this.setState({ loading: false });
                                            setSubmitting(false);
                                            return response;
                                        },
                                        (error) => {
                                            this.setState({ loading: false });
                                            setSubmitting(false);
                                            
                                            
                                        }
                                    );
                                }
                                else {
                                    this.setState({ alert: true });
                                    setSubmitting(false);
                                }

                                
                                // SalesInvoiceService.CreateSalesInvoice(

                                // ).then(
                                //     (response) => {
                                //         const { from } = this.props.location.state || {
                                //             from: { pathname: '/app/salesInvoice/SalesInvoice' }
                                //         };
                                //         this.props.history.push(from);
                                //     },
                                //     (error) => {
                                //         setSubmitting(false);
                                //         setStatus(error);
                                //     }
                                // );
                            }}
                            render={({ values, errors, status, touched, isSubmitting }) => (


                                <Form>
                                    <Card>
                                        {this.state.loading && <Spinner />}
                                        {!this.state.loading &&
                                            <Card.Header>

                                                <Dropdown>
                                                    <Button variant="success">{this.state.buttonText}</Button>
                                                    <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />
                                                    <Dropdown.Menu>                                                        
                                                        <Dropdown.Item onClick={() => this.DownloadPrint('Payment')}>Payment</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => this.DownloadPrint('Recipt')}>Recipt</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => this.DownloadPrint('MoneyRecipt')}>MoneyRecipt Print</Dropdown.Item>
                                                        <Dropdown.Item onClick={() => this.DownloadPrint('JournalContra')}>Journal Contra</Dropdown.Item>                                                        
                                                        <Dropdown.Item onClick={() => this.DownloadPrint('SalesInvoice')}>Sales Invoice</Dropdown.Item>
                                                        
                                                    </Dropdown.Menu>
                                                </Dropdown>

                                                <br />
                                                <div className='row'>
                                                    <div className='col-md-3'>
                                                        <label htmlFor="journalInvoiceNumber">Start Date</label>
                                                        <Field
                                                            name="startDate"
                                                            type="date"
                                                            onChange={this.startDate}
                                                            className={
                                                                'form-control' +
                                                                (errors.startDate && touched.StartDate
                                                                    ? ' is-invalid'
                                                                    : '')
                                                            }
                                                        />
                                                        <ErrorMessage
                                                            name="StartDate"
                                                            component="div"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>
                                                    <div className='col-md-3'>
                                                        <label htmlFor="endDate">End Date</label>
                                                        <Field
                                                            name="endDate"
                                                            type="date"
                                                            onChange={this.endDate}
                                                            className={
                                                                'form-control' +
                                                                (errors.endDate && touched.endDate
                                                                    ? ' is-invalid'
                                                                    : '')
                                                            }
                                                        />
                                                        <ErrorMessage
                                                            name="endDate"
                                                            component="div"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>
                                                </div>


                                            </Card.Header>
                                        }
                                        {!this.state.loading &&
                                            <Card.Body>
                                                <div className="form-group ">
                                                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                                        Print
                                                    </button>
                                                    {isSubmitting && (
                                                        <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                                    )}
                                                </div>
                                                {status && <div className={'alert alert-danger'}>{status}</div>}

                                            </Card.Body>
                                        }

                                    </Card>

                                </Form>

                            )}
                        />




                    </Col>
                </Row>
            </>
        );
    }
}
export default MultipleInvoice;

import React, { Component } from 'react';
import { Row, Col, Card, Button, Badge } from 'react-bootstrap';
import Config from '../../config';
import { AuthenticationService } from '../../services/AuthenticationService';
import { GstReportService } from '../../services/GstReportService';
import Buttonn from 'devextreme-react/button';

class ViewGstr1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: '',
            endDate: '',
            countB2B: 0,
            countB2C: 0,
            countExportsInvoice: 0,
            countB2COthers: 0,
            countNillRatedSupplies: 0,
            countCreditDebitRegistered: 0,
            countCreditDebitUnRegistered: 0,
            countTAXLiability: 0,
            countAdjustment11B: 0,
            countHSN: 0,
            countDocumentIssued: 0,
        };
        // redirect to login if not logged in
        this.B2B = this.B2B.bind(this);
        this.B2C = this.B2C.bind(this);
        this.ExportsInvoice = this.ExportsInvoice.bind(this);
        this.B2COthers = this.B2COthers.bind(this);
        this.NillRatedSupplies = this.NillRatedSupplies.bind(this);
        this.CreditDebitRegistered = this.CreditDebitRegistered.bind(this);
        this.CreditDebitUnRegistered = this.CreditDebitUnRegistered.bind(this);
        this.TAXLiability = this.TAXLiability.bind(this);
        this.Adjustment11B = this.Adjustment11B.bind(this);
        this.HSN = this.HSN.bind(this);
        this.DocumentIssued = this.DocumentIssued.bind(this);
        this.RedirectPage = this.RedirectPage.bind(this);
        this.CountData = this.CountData.bind(this);

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
        var startDate = this.props.location.state && this.props.location.state.startDate;
        var endDate = this.props.location.state && this.props.location.state.endDate;
        this.setState({
            startDate: startDate,
            endDate: endDate
        });

        GstReportService.GridFillData(startDate, endDate).then(response => {
            this.CountData(response.data);
        });
    }
    CountData(gstr1) {
        this.setState({
            countB2B: gstr1.b2B.length,
            countB2C: gstr1.b2Cs.length,
            countDocumentIssued: gstr1.docIssue.docDet.length,
            countHSN: gstr1.hsn.data.length,
            countNillRatedSupplies: gstr1.nil.inv.length
        });
    }
    B2B() {
        var data = {
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            status: 'B2B'
        };
        this.props.history.push({ pathname: '/app/gst/Gstr1Details', state: data });
    }
    B2C() {      
        var data = {
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            status: 'B2C'
        };
        this.props.history.push({ pathname: '/app/gst/Gstr1Details', state: data });
    }
    ExportsInvoice() {
        this.props.history.push('/app/gst/Gstr1Details');
        this.props.history.push({ pathname: '/app/gst/Gstr1Details', state: { status: 'ExportsInvoice' } });
    }
    B2COthers() {
        this.props.history.push('/app/gst/Gstr1Details');
        this.props.history.push({ pathname: '/app/gst/Gstr1Details', state: { status: 'B2COthers' } });
    }
    NillRatedSupplies() {
        var data = {
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            status: 'NillRatedSupplies'
        };
        this.props.history.push({ pathname: '/app/gst/Gstr1Details', state: data });        
    }
    CreditDebitRegistered() {
        this.props.history.push('/app/gst/Gstr1Details');
        this.props.history.push({ pathname: '/app/gst/Gstr1Details', state: { status: 'CreditDebitRegistered' } });
    }
    CreditDebitUnRegistered() {
        this.props.history.push('/app/gst/Gstr1Details');
        this.props.history.push({ pathname: '/app/gst/Gstr1Details', state: { status: 'CreditDebitUnRegistered' } });
    }
    TAXLiability() {
        this.props.history.push('/app/gst/Gstr1Details');
        this.props.history.push({ pathname: '/app/gst/Gstr1Details', state: { status: 'TAXLiability' } });
    }
    Adjustment11B() {
        this.props.history.push('/app/gst/Gstr1Details');
        this.props.history.push({ pathname: '/app/gst/Gstr1Details', state: { status: 'Adjustment11B' } });
    }
    HSN() {
        var data = {
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            status: 'HSN'
        };
        this.props.history.push({ pathname: '/app/gst/Gstr1Details', state: data });         
    }
    DocumentIssued() {
        var data = {
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            status: 'DocumentIssued'
        };
        this.props.history.push({ pathname: '/app/gst/Gstr1Details', state: data });        
    }

    RedirectPage() {
        const { from } = this.props.location.state || { from: { pathname: '/app/gst/Gstr' } };
        this.props.history.push(from);
    }
    render() {
        return (
            <>
                <Card>
                    <Card.Header>
                        <Card.Title as="h5">Record Details</Card.Title>
                        {/* {this.state.showhidebackButton == undefined && ( */}
                        <Buttonn className="float-right" type="success" text="Back" onClick={this.RedirectPage}></Buttonn>
                        {/* )} */}
                    </Card.Header>
                </Card>
                <Row>
                    <Col className='col-md-4'>
                        <Card style={{ width: '24rem' }}>
                            <Card.Body>
                                <Card.Title>4A,4B,6B,6C-B2B,SEZ,DE,Invoices</Card.Title>
                                <hr></hr>

                                <Button onClick={this.B2B}>
                                    View Report - <Badge bg="info">{this.state.countB2B}</Badge>
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col className='col-md-4'>
                        <Card style={{ width: '24rem' }}>
                            <Card.Body>
                                <Card.Title>5A-B2C(Large) Invoices</Card.Title>
                                <hr></hr>
                                <Button variant="primary" onClick={this.B2C}>
                                    View Report - <Badge bg="info">{this.state.countB2C}</Badge>
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col className='col-md-4'>
                        <Card style={{ width: '24rem' }}>
                            <Card.Body>
                                <Card.Title>6A-Exports Invoice</Card.Title>
                                <hr></hr>
                                <Button variant="primary" onClick={this.ExportsInvoice}>
                                    View Report - <Badge bg="info">0</Badge>
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>



                <Row>
                    <Col>
                        <Card style={{ width: '24rem' }}>
                            <Card.Body>
                                <Card.Title>7-B2C(Others)</Card.Title>
                                <hr></hr>
                                <Button variant="primary" onClick={this.B2COthers}>
                                    View Report - <Badge bg="info">0</Badge>
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card style={{ width: '24rem' }}>
                            <Card.Body>
                                <Card.Title>8A,8B,8C,8D- Nill Rated Supplies</Card.Title>
                                <hr></hr>
                                <Button variant="primary" onClick={this.NillRatedSupplies}>
                                    View Report - <Badge bg="info">{this.state.countNillRatedSupplies}</Badge>
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card style={{ width: '24rem' }}>
                            <Card.Body>
                                <Card.Title>9B - Credit/Debit Notes(Registered)</Card.Title>
                                <hr></hr>
                                <Button variant="primary" onClick={this.CreditDebitRegistered}>
                                    View Report - <Badge bg="info">0</Badge>
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card style={{ width: '24rem' }}>
                            <Card.Body>
                                <Card.Title>9B - Credit/Debit Notes(UnRegistered)</Card.Title>
                                <hr></hr>
                                <Button variant="primary" onClick={this.CreditDebitUnRegistered}>
                                    View Report - <Badge bg="info">0</Badge>
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card style={{ width: '24rem' }}>
                            <Card.Body>
                                <Card.Title>11A(1),11A(2)-TAX Liability(Advances Received)</Card.Title>
                                <hr></hr>
                                <Button variant="primary" onClick={this.TAXLiability}>
                                    View Report - <Badge bg="info">0</Badge>
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card style={{ width: '24rem' }}>
                            <Card.Body>
                                <Card.Title>11B(1),11B(2) Adjustment of Advances</Card.Title>
                                <hr></hr>
                                <Button variant="primary" onClick={this.Adjustment11B}>
                                    View Report - <Badge bg="info">0</Badge>
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card style={{ width: '24rem' }}>
                            <Card.Body>
                                <Card.Title>12-HSN-Wise Summary of outward supplies</Card.Title>
                                <hr></hr>
                                <Button variant="primary" onClick={this.HSN}>
                                    View Report - <Badge bg="info">{this.state.countHSN}</Badge>
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card style={{ width: '24rem' }}>
                            <Card.Body>
                                <Card.Title>Document Issued</Card.Title>
                                <hr></hr>
                                <Button variant="primary" onClick={this.DocumentIssued}>
                                    View Report - <Badge bg="info">{this.state.countDocumentIssued}</Badge>
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col></Col>
                </Row>
            </>
        );
    }
}
export default ViewGstr1;

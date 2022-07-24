import React, { Component } from 'react';
import Select from 'react-select';
import { Row, Col, Card } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import BlockUi from 'react-block-ui';
import * as Yup from 'yup';
import 'react-block-ui/style.css';
import { Modal, ModalHeader, ModalBody, ModalFooter, Container } from 'reactstrap';
import Config from '../../../config';
import { AuthenticationService } from '../../../services/AuthenticationService';
import { LedgerService } from '../../../services/LedgerService';
import { JournalContraService } from '../../../services/JournalContraService';
import { VoucherSettingService } from '../../../services/VoucherSettingService';
import { FcPlus } from 'react-icons/fc';
import { BsXSquareFill } from 'react-icons/bs';
import CreateLedger from '../../ledger/CreateLedger';

import DataGrid, {
    TotalItem,
    Summary,
    RequiredRule,
    Column,
    Editing,
    Popup,
    Paging,
    Lookup,
    Form as FormDG
} from 'devextreme-react/data-grid';
import { Item } from 'devextreme-react/form';
import themes from 'devextreme/ui/themes';
import 'devextreme-react/text-area';
import { string } from 'yup/lib/locale';
import { Button } from 'devextreme-react/button';

import { DateBox } from 'devextreme-react';
import * as moment from 'moment';

class CreateJournal extends React.Component {
    constructor(props) {
        super(props);
        //this.dataSource = countries.getWeakData();
        this.state = {
            VoucherType: [
                { value: 'Journal', label: 'Journal' },
                { value: 'Contra', label: 'Contra' }
            ],
            Type: [
                { name: 'CR', id: 1 },
                { name: 'DR', id: 2 }
            ],
            particulars: [],
            contraAllLedgers: [],
            credit: true,
            debit: true,
            alert: false,
            position: '',
            narration: '',
            typeCheck: false,

            Voucherty: '',
            date: moment().format('MM/DD/YYYY'),
            isModalVisible: false,
            type: ''
        };
        var currentUser = AuthenticationService.currentUserValue;
        this.setCellValue = this.setCellValue.bind(this);
        this.typeChanges = this.typeChanges.bind(this);
        this.OnAddRow = this.OnAddRow.bind(this);
        this.onValueChanged1 = this.onValueChanged1.bind(this);
        this.RedirectPage = this.RedirectPage.bind(this);
        this.onClickChange = this.onClickChange.bind(this);
        this.onEditionStart = this.onEditionStart.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        // this.onShowing=this.onShowing.bind(this);
        // redirect to login if not logged in
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
        this.setState({ debit: true, credit: true });

        VoucherSettingService.journalVoucherSettingType().then((response) => {
            this.setState({ showInvoiceNumber: response ? !response.isAutomatic : true });
        });
    }

    onTextChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    setCellValue(newData, value, currentRowData) {
        newData.VoucherType = value;
        newData.Type = '';
        this.setState({ Voucherty: newData.value, particulars: [] });

        if (newData.value == 'Journal') {
            LedgerService.getLedgers().then((ledgers) => {
                var ret = [];
                ledgers.map((ledger) => {
                    ret.push({ name: ledger.name, id: ledger.id });
                });
                this.setState({ contraAllLedgers: ret, type: 'Journal' });
            });
        }
        if (newData.value == 'Contra') {
            LedgerService.getContraLedgers().then((ledgers) => {
                var ret = [];
                ledgers.map((ledger) => {
                    ret.push({ name: ledger.name, id: ledger.id });
                });
                this.setState({ contraAllLedgers: ret, type: 'Contra' });
            });
        }
    }
    onValueChanged1(e) {
        this.setState({ date: e.value });
    }
    onEditionStart(e) {
        if (e.data.CreditAmount != null) {
            this.setState({ credit: false, debit: true, typeCheck: true });
        }
        if (e.data.DebitAmount != null) {
            this.setState({ debit: false, credit: true, typeCheck: true });
        }
    }
    typeChanges(newData, value, currentRowData) {
        newData.Type = value;
        newData.CreditAmunt = null;
        newData.DebitAmount = null;
        newData.Particulars = null;
        if (value == 1) {
            this.setState({ debit: true, credit: false });
        }
        if (value == 2) {
            this.setState({ credit: true, debit: false });
        }
    }

    OnAddRow(e) {
        this.setState({ credit: true, debit: true, typeCheck: false });
    }

    // totalDebitAmount(){

    //     var DebitAmountdata=this.state && this.state.DebitAmount;
    //     if(DebitAmountdata!=null || DebitAmountdata!=undefined){
    //         var data2=DebitAmountdata.toString();
    //     }
    //     data2="0";
    //     return  data2;
    // }
    // totalCreditAmount(){

    //     var CreditAmountData=this.state && this.state.CreditAmount
    //     var data1=CreditAmountData.toString();
    //     return data1;
    // }

    RedirectPage() {
        const { from } = this.props.location.state || { from: { pathname: '/app/Journal_Contra/JournalView' } };
        this.props.history.push(from);
    }
    onClickChange(e) {
        var id = 1;
        if (e == 'AddLedger') {
            var page = <CreateLedger id={id} />;
            this.setState({ renderPages: page, isModalVisible: true });
        } else if (e == 'onClose') {
            if (this.state.type == 'Journal') {
                LedgerService.getLedgers().then((ledgers) => {
                    var ret = [];
                    ledgers.map((ledger) => {
                        ret.push({ name: ledger.name, id: ledger.id });
                    });
                    this.setState({ contraAllLedgers: ret });
                });
            }
            if (this.state.type == 'Contra') {
                LedgerService.getContraLedgers().then((ledgers) => {
                    var ret = [];
                    ledgers.map((ledger) => {
                        ret.push({ name: ledger.name, id: ledger.id });
                    });
                    this.setState({ contraAllLedgers: ret, type: 'Contra' });
                });
            }

            this.setState({ isModalVisible: false });
        }
    }
    render() {
        return (
            <>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h5">Create Journal</Card.Title>
                                <Button className="float-right" type="success" text="Back" onClick={this.RedirectPage}></Button>
                            </Card.Header>
                        </Card>

                        <Formik
                            enableReinitialize
                            initialValues={{
                                narration: this.state.narration,
                                particulars: this.state.particulars,
                                Voucherty: this.state.Voucherty,
                                date: this.state.date,
                                showInvoiceNumber: this.state.showInvoiceNumber,
                                journalInvoiceNumber: this.state.journalInvoiceNumber
                            }}
                            validationSchema={Yup.object().shape({
                                narration: Yup.string().required('This field is required').nullable(true),
                                journalInvoiceNumber: Yup.string().when('showInvoiceNumber', {
                                    is: true,
                                    then: Yup.string().test('len', 'Invoice number is required', (val) => val && val.length > 0)
                                }),
                                particulars: Yup.array()
                                    .of(Yup.object().shape({ Particular: Yup.number() }))
                                    .min(2, 'Atleast two particular is required')
                                    .required('Atleast two particular is required')
                            })}
                            onSubmit={({ Voucherty, date, narration, particulars, journalInvoiceNumber }, { setStatus, setSubmitting }) => {
                                setStatus();

                                var ParticularsDetails = [];
                                this.state.particulars.map((item) => {
                                    var type = this.state.Type.find((v) => v.id === item.Type);

                                    var creditAmount = item && item.CreditAmount;
                                    var debitAmount = item && item.DebitAmount;

                                    var amount;
                                    if (creditAmount != null) {
                                        amount = parseFloat(creditAmount);
                                    } else if (debitAmount != null) {
                                        amount = parseFloat(debitAmount);
                                    }
                                    var balanceType = '';
                                    if (type.name == 'CR') {
                                        balanceType = 'Credit';
                                    } else if (type.name == 'DR') {
                                        balanceType = 'Debit';
                                    }
                                    var particularsData = {
                                        ledgerId: item.Particulars,
                                        amount: amount,
                                        balanceType: balanceType
                                    };
                                    ParticularsDetails.push(particularsData);
                                });
                                JournalContraService.AddJournalContra(
                                    Voucherty,
                                    date,
                                    narration,
                                    ParticularsDetails,
                                    journalInvoiceNumber
                                ).then(
                                    (response) => {
                                        const { from } = this.props.location.state || {
                                            from: { pathname: '/app/Journal_Contra/JournalView' }
                                        };
                                        this.props.history.push(from);
                                    },
                                    (error) => {
                                        setSubmitting(false);
                                        setStatus(error);
                                    }
                                );
                            }}
                            render={({ values, errors, status, touched, isSubmitting }) => (
                                <BlockUi tag="div" blocking={this.state.blocking}>
                                    <Form>
                                        <Card className={errors.particulars && touched.particulars ? 'invalid-card' : ''}>
                                            {/* {this.state.alert && (
                                            //     <Modal isOpen={this.state.isModalVisible}>
                                            //                 <ModalHeader>Update</ModalHeader>
                                            //                 <ModalBody>
                                            //                     <div>

                                            //                         <div className="form-row">
                                            //                             <div className="form-group col-md-12">
                                            //                                 <label htmlFor="modalText">this Filed can't  be Update.click OK for Reload}</label>
                                            //                             </div>

                                            //                             <div className="form-group col-md-6">
                                            //                                 <button
                                            //                                     type="submit"
                                            //                                     className="btn btn-secondary"
                                            //                                     onClick={this.reload}
                                            //                                 >
                                            //                                 Ok
                                            //                                 </button>
                                            //                             </div>

                                            //                         </div>

                                            //                     </div>
                                            //                 </ModalBody>
                                            //     </Modal>
                                            // )}
                                            */}
                                            <Card.Header></Card.Header>
                                            <Card.Body>
                                                <div className="row">
                                                    <label htmlFor="date">Date:</label>

                                                    <div className="col-md-2">
                                                        <DateBox
                                                            id="Datebox1"
                                                            name="dataBox1"
                                                            onValueChanged={this.onValueChanged1}
                                                            placeholder="Date"
                                                            showClearButton={true}
                                                            useMaskBehavior={true}
                                                            type="date"
                                                            displayFormat="dd/MM/yyyy"
                                                            defaultValue={this.state.date}
                                                        />
                                                    </div>

                                                    <label htmlFor="date">VoucherType:</label>
                                                    <div className="col-md-3">
                                                        <Select
                                                            options={this.state.VoucherType}
                                                            onChange={this.setCellValue}
                                                            placeholder="Select VoucherType"
                                                        />
                                                    </div>

                                                    <FcPlus
                                                        style={{ marginLeft: '10px' }}
                                                        size={20}
                                                        onClick={() => this.onClickChange('AddLedger')}
                                                    />
                                                    <label htmlFor="AddLedger">Create Ledger</label>

                                                    {this.state.showInvoiceNumber && (
                                                        <div className="form-group col-md-5">
                                                            <label htmlFor="journalInvoiceNumber">Invoice Number</label>
                                                            <Field
                                                                name="journalInvoiceNumber"
                                                                type="text"
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.journalInvoiceNumber && touched.journalInvoiceNumber
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="journalInvoiceNumber"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                <React.Fragment>
                                                    <DataGrid
                                                        dataSource={this.state.particulars}
                                                        keyExpr="ID"
                                                        showBorders={true}
                                                        onSaved={this.OnAddRow}
                                                        repaintChangesOnly={true}
                                                        onEditingStart={this.onEditionStart}
                                                    >
                                                        <Paging enabled={false} />
                                                        <Editing mode="popup" allowUpdating={true} allowAdding={true} allowDeleting={true}>
                                                            <Popup title="Create Journal" showTitle={true} width={700} height={525} />
                                                            <FormDG>
                                                                <Item itemType="group" colCount={2} colSpan={2}>
                                                                    <Item dataField="Type" colSpan={2} disabled={this.state.typeCheck} />
                                                                    <Item dataField="Particulars" colSpan={2} />
                                                                    <Item dataField="DebitAmount" disabled={this.state.debit} />
                                                                    <Item dataField="CreditAmount" disabled={this.state.credit} />
                                                                </Item>
                                                            </FormDG>
                                                        </Editing>

                                                        <Column dataField="Type" setCellValue={this.typeChanges}>
                                                            <Lookup dataSource={this.state.Type} valueExpr="id" displayExpr="name"></Lookup>
                                                            <RequiredRule />
                                                        </Column>
                                                        <Column dataField="Particulars" caption="Particulars/Ledgers">
                                                            <Lookup
                                                                dataSource={this.state.contraAllLedgers}
                                                                valueExpr="id"
                                                                displayExpr="name"
                                                            ></Lookup>
                                                            <RequiredRule />
                                                        </Column>
                                                        <Column dataField="DebitAmount" alignment="left"></Column>
                                                        <Column dataField="CreditAmount" alignment="right"></Column>
                                                        <Summary recalculateWhileEditing={true}>
                                                            <TotalItem
                                                                column="DebitAmount"
                                                                summaryType="sum"
                                                                displayFormat="Total Debit Amount: {0}"
                                                            />
                                                            <TotalItem
                                                                column="CreditAmount"
                                                                summaryType="sum"
                                                                displayFormat="Total Credit Amount: {0}"
                                                            />
                                                        </Summary>
                                                    </DataGrid>
                                                </React.Fragment>

                                                {errors.particulars && touched.particulars && (
                                                    <>
                                                        <div className={'invalid-array'}>Atleast two Ledger is required</div>
                                                    </>
                                                )}

                                                <br />
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="narration">Narration</label>
                                                    <Field
                                                        name="narration"
                                                        type="text"
                                                        className={
                                                            'form-control' + (errors.narration && touched.narration ? ' is-invalid' : '')
                                                        }
                                                    />
                                                    <ErrorMessage name="narration" component="div" className="invalid-feedback" />
                                                </div>
                                            </Card.Body>
                                        </Card>

                                        <div className="form-group ">
                                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                                Create Journal
                                            </button>
                                            {isSubmitting && (
                                                <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                            )}
                                        </div>
                                        {status && <div className={'alert alert-danger'}>{status}</div>}
                                        {/*<p>
                                            <pre>{JSON.stringify(errors, null, 2)}</pre>
                                        </p>
                                        <p>
                                            <pre>{JSON.stringify(values, null, 2)}</pre>
                                         </p> */}
                                    </Form>
                                </BlockUi>
                            )}
                        />

                        {this.state.isModalVisible && (
                            <Modal
                                isOpen={this.state.isModalVisible}
                                size="lg"
                                style={{ maxWidth: '1000px', width: '100%' }}
                                backdrop="static"
                            >
                                <div className="ModelHeader">
                                    {' '}
                                    <div style={{ textAlign: 'right', marginRight: '2px', marginTop: '3px' }}>
                                        <BsXSquareFill color="red" size={30} onClick={() => this.onClickChange('onClose')} />
                                    </div>
                                </div>
                                <ModalBody>{this.state.renderPages}</ModalBody>
                            </Modal>
                        )}
                    </Col>
                </Row>
            </>
        );
    }
}
export default CreateJournal;

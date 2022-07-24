import React, { Component } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import Select from 'react-select';
import { Modal, ModalHeader, ModalBody, ModalFooter, Container } from 'reactstrap';
import { Formik, Field, Form, ErrorMessage, yupToFormErrors } from 'formik';
import * as moment from 'moment';
import * as Yup from 'yup';
import Config from '../../config';
import { CustomSwitch } from '../../components/CustomSwitch';
import { AuthenticationService } from '../../services/AuthenticationService';
import { VoucherSettingService } from '../../services/VoucherSettingService';
import { LedgerService } from '../../services/LedgerService';
import { BsXSquareFill } from 'react-icons/bs';
import { FcPlus } from 'react-icons/fc';
import CreateLedger from '../ledger/CreateLedger';

class VoucherSettings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            companyId: '',
            id: '',
            ledgerId: '',
            bankDetails: {},
            repeatingPeriodList: [
                { label: 'Never', value: 1 },
                { label: 'Weekly', value: 2 },
                { label: 'Monthly', value: 3 },
                { label: 'Yearly', value: 4 }
            ],
            // gTAuto: false,
            // gTStartingNum: 0,
            // gTWidthOfNumericPart: 0,
            // gTPrefillWithZero: false,
            // gTEffectiveFrom: null,
            // gTRestartingNum: 0,
            // gTRepeatingPeriod: { label: 'Never', value: 1 },
            // gTPrefixEffectiveFrom: null,
            // gTPrefix: '',
            // gTSuffixEffectiveFrom: null,
            // gTSuffix: '',

            // dTAuto: false,
            // dTStartingNum: 0,
            // dTWidthOfNumericPart: 0,
            // dTPrefillWithZero: false,
            // dTEffectiveFrom: null,
            // dTRestartingNum: 0,
            // dTRepeatingPeriod: { label: 'Never', value: 1 },
            // dTPrefixEffectiveFrom: null,
            // dTPrefix: '',
            // dTSuffixEffectiveFrom: null,
            // dTSuffix: '',

            rVAuto: false,
            rVStartingNum: 1,
            rVWidthOfNumericPart: 1,
            rVPrefillWithZero: false,
            rVEffectiveFrom: '',
            rVRestartingNum: 1,
            rVRepeatingPeriod: { label: 'Never', value: 1 },
            rVPrefixEffectiveFrom: '',
            rVPrefix: '',
            rVSuffixEffectiveFrom: '',
            rVSuffix: '',

            pVAuto: false,
            pVStartingNum: 1,
            pVWidthOfNumericPart: 1,
            pVPrefillWithZero: false,
            pVEffectiveFrom: '',
            pVRestartingNum: 1,
            pVRepeatingPeriod: { label: 'Never', value: 1 },
            pVPrefixEffectiveFrom: '',
            pVPrefix: '',
            pVSuffixEffectiveFrom: '',
            pVSuffix: '',

            dtReceiptAuto: false,
            dtReceiptStartingNum: 1,
            dtReceiptWidthOfNumericPart: 1,
            dtReceiptPrefillWithZero: false,
            dtReceiptEffectiveFrom: '',
            dtReceiptRestartingNum: 1,
            dtReceiptRepeatingPeriod: { label: 'Never', value: 1 },
            dtReceiptPrefixEffectiveFrom: '',
            dtReceiptPrefix: '',
            dtReceiptSuffixEffectiveFrom: '',
            dtReceiptSuffix: '',

            dtPaymentAuto: false,
            dtPaymentStartingNum: 1,
            dtPaymentWidthOfNumericPart: 1,
            dtPaymentPrefillWithZero: false,
            dtPaymentEffectiveFrom: '',
            dtPaymentRestartingNum: 1,
            dtPaymentRepeatingPeriod: { label: 'Never', value: 1 },
            dtPaymentPrefixEffectiveFrom: '',
            dtPaymentPrefix: '',
            dtPaymentSuffixEffectiveFrom: '',
            dtPaymentSuffix: '',

            jVAuto: false,
            jVStartingNum: 1,
            jVWidthOfNumericPart: 1,
            jVPrefillWithZero: false,
            jVEffectiveFrom: '',
            jVRestartingNum: 1,
            jVRepeatingPeriod: { label: 'Never', value: 1 },
            jVPrefixEffectiveFrom: '',
            jVPrefix: '',
            jVSuffixEffectiveFrom: '',
            jVSuffix: '',

            sInAuto: false,
            sInStartingNum: 1,
            sInWidthOfNumericPart: 1,
            sInPrefillWithZero: false,
            sInEffectiveFrom: '',
            sInRestartingNum: 1,
            sInRepeatingPeriod: { label: 'Never', value: 1 },
            sInPrefixEffectiveFrom: '',
            sInPrefix: '',
            sInSuffixEffectiveFrom: '',
            sInSuffix: '',
            ledgers: [],
            bankName: null
        };
        this.onTextChange = this.onTextChange.bind(this);
        this.onCheckBoxChange = this.onCheckBoxChange.bind(this);
        this.onDropDownChange = this.onDropDownChange.bind(this);
        this.onClickChange = this.onClickChange.bind(this);
        this.resetSalesInvoiceSettings = this.resetSalesInvoiceSettings.bind(this);
        this.resetProformaInvoiceSetting=this.resetProformaInvoiceSetting.bind(this);
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
        VoucherSettingService.getVoucherSetting().then((response) => {
            this.setState({
                companyId: response.companyId,
                id: response.id,
                ledgerId: response.ledgerId,
                ledgers: [],
                bankName: null,
                bankDetails: { ...response.settings.bankDetails },

                pVAuto: response.settings.paymentVoucher ? response.settings.paymentVoucher.automatic : false,
                pVStartingNum: response.settings.paymentVoucher ? response.settings.paymentVoucher.startingNumber : 1,
                pVWidthOfNumericPart: response.settings.paymentVoucher ? response.settings.paymentVoucher.widthOfNumericPart : 1,
                pVPrefillWithZero: response.settings.paymentVoucher ? response.settings.paymentVoucher.prefillWithZero : false,
                pVEffectiveFrom:
                    response.settings.paymentVoucher && response.settings.paymentVoucher.effectiveFrom
                        ? moment(response.settings.paymentVoucher.effectiveFrom).format('YYYY-MM-DD')
                        : '',
                pVRestartingNum: response.settings.paymentVoucher ? response.settings.paymentVoucher.restartingNum : 1,
                pVPrefixEffectiveFrom:
                    response.settings.paymentVoucher && response.settings.paymentVoucher.prefixEffectiveFrom
                        ? moment(response.settings.paymentVoucher.prefixEffectiveFrom).format('YYYY-MM-DD')
                        : '',
                pVPrefix:
                    response.settings.paymentVoucher && response.settings.paymentVoucher.prefix
                        ? response.settings.paymentVoucher.prefix
                        : '',
                pVSuffixEffectiveFrom:
                    response.settings.paymentVoucher && response.settings.paymentVoucher.suffixEffectiveFrom
                        ? moment(response.settings.paymentVoucher.suffixEffectiveFrom).format('YYYY-MM-DD')
                        : '',
                pVSuffix:
                    response.settings.paymentVoucher && response.settings.paymentVoucher.suffix
                        ? response.settings.paymentVoucher.suffix
                        : '',
                pVRepeatingPeriod: response.settings.paymentVoucher
                    ? this.state.repeatingPeriodList.find((v) => v.value === response.settings.paymentVoucher.repeatingPeriod)
                    : { label: 'Never', value: 1 },

                jVAuto: response.settings.journalVoucher ? response.settings.journalVoucher.automatic : false,
                jVStartingNum: response.settings.journalVoucher ? response.settings.journalVoucher.startingNumber : 1,
                jVWidthOfNumericPart: response.settings.journalVoucher ? response.settings.journalVoucher.widthOfNumericPart : 1,
                jVPrefillWithZero: response.settings.journalVoucher ? response.settings.journalVoucher.prefillWithZero : false,
                jVEffectiveFrom:
                    response.settings.journalVoucher && response.settings.journalVoucher.effectiveFrom
                        ? moment(response.settings.journalVoucher.effectiveFrom).format('YYYY-MM-DD')
                        : '',
                jVRestartingNum: response.settings.journalVoucher ? response.settings.journalVoucher.restartingNum : 1,
                jVPrefixEffectiveFrom:
                    response.settings.journalVoucher && response.settings.journalVoucher.prefixEffectiveFrom
                        ? moment(response.settings.journalVoucher.prefixEffectiveFrom).format('YYYY-MM-DD')
                        : '',
                jVPrefix:
                    response.settings.journalVoucher && response.settings.journalVoucher.prefix
                        ? response.settings.journalVoucher.prefix
                        : '',
                jVSuffixEffectiveFrom:
                    response.settings.journalVoucher && response.settings.journalVoucher.suffixEffectiveFrom
                        ? moment(response.settings.journalVoucher.suffixEffectiveFrom).format('YYYY-MM-DD')
                        : '',
                jVSuffix:
                    response.settings.journalVoucher && response.settings.journalVoucher.suffix
                        ? response.settings.journalVoucher.suffix
                        : '',
                jVRepeatingPeriod: response.settings.journalVoucher
                    ? this.state.repeatingPeriodList.find((v) => v.value === response.settings.journalVoucher.repeatingPeriod)
                    : { label: 'Never', value: 1 },

                rVAuto: response.settings.receiptVoucher ? response.settings.receiptVoucher.automatic : false,
                rVStartingNum: response.settings.receiptVoucher ? response.settings.receiptVoucher.startingNumber : 1,
                rVWidthOfNumericPart: response.settings.receiptVoucher ? response.settings.receiptVoucher.widthOfNumericPart : 1,
                rVPrefillWithZero: response.settings.receiptVoucher ? response.settings.receiptVoucher.prefillWithZero : false,
                rVEffectiveFrom:
                    response.settings.receiptVoucher && response.settings.receiptVoucher.effectiveFrom
                        ? moment(response.settings.receiptVoucher.effectiveFrom).format('YYYY-MM-DD')
                        : '',
                rVRestartingNum: response.settings.receiptVoucher ? response.settings.receiptVoucher.restartingNum : 1,
                rVPrefixEffectiveFrom:
                    response.settings.receiptVoucher && response.settings.receiptVoucher.prefixEffectiveFrom
                        ? moment(response.settings.receiptVoucher.prefixEffectiveFrom).format('YYYY-MM-DD')
                        : '',
                rVPrefix:
                    response.settings.receiptVoucher && response.settings.receiptVoucher.prefix
                        ? response.settings.receiptVoucher.prefix
                        : '',
                rVSuffixEffectiveFrom:
                    response.settings.receiptVoucher && response.settings.receiptVoucher.suffixEffectiveFrom
                        ? moment(response.settings.receiptVoucher.suffixEffectiveFrom).format('YYYY-MM-DD')
                        : '',
                rVSuffix:
                    response.settings.receiptVoucher && response.settings.receiptVoucher.suffix
                        ? response.settings.receiptVoucher.suffix
                        : '',
                rVRepeatingPeriod: response.settings.receiptVoucher
                    ? this.state.repeatingPeriodList.find((v) => v.value === response.settings.receiptVoucher.repeatingPeriod)
                    : { label: 'Never', value: 1 },

                sInAuto: response.settings.salesInvoice ? response.settings.salesInvoice.automatic : false,
                sInStartingNum: response.settings.salesInvoice ? response.settings.salesInvoice.startingNumber : 1,
                sInWidthOfNumericPart: response.settings.salesInvoice ? response.settings.salesInvoice.widthOfNumericPart : 1,
                sInPrefillWithZero: response.settings.salesInvoice ? response.settings.salesInvoice.prefillWithZero : false,
                sInEffectiveFrom:
                    response.settings.salesInvoice && response.settings.salesInvoice.effectiveFrom
                        ? moment(response.settings.salesInvoice.effectiveFrom).format('YYYY-MM-DD')
                        : '',
                sInRestartingNum: response.settings.salesInvoice ? response.settings.salesInvoice.restartingNum : 1,
                sInPrefixEffectiveFrom:
                    response.settings.salesInvoice && response.settings.salesInvoice.prefixEffectiveFrom
                        ? moment(response.settings.salesInvoice.prefixEffectiveFrom).format('YYYY-MM-DD')
                        : '',
                sInPrefix:
                    response.settings.salesInvoice && response.settings.salesInvoice.prefix ? response.settings.salesInvoice.prefix : '',
                sInSuffixEffectiveFrom:
                    response.settings.salesInvoice && response.settings.salesInvoice.suffixEffectiveFrom
                        ? moment(response.settings.salesInvoice.suffixEffectiveFrom).format('YYYY-MM-DD')
                        : '',
                sInSuffix:
                    response.settings.salesInvoice && response.settings.salesInvoice.suffix ? response.settings.salesInvoice.suffix : '',
                sInRepeatingPeriod: response.settings.salesInvoice
                    ? this.state.repeatingPeriodList.find((v) => v.value === response.settings.salesInvoice.repeatingPeriod)
                    : { label: 'Never', value: 1 },



                    pInAuto: response.settings.proformaInvoice ? response.settings.proformaInvoice.automatic : false,
                pInStartingNum: response.settings.proformaInvoice ? response.settings.proformaInvoice.startingNumber : 1,
                pInWidthOfNumericPart: response.settings.proformaInvoice ? response.settings.proformaInvoice.widthOfNumericPart : 1,
                pInPrefillWithZero: response.settings.proformaInvoice ? response.settings.proformaInvoice.prefillWithZero : false,
                pInEffectiveFrom:
                    response.settings.proformaInvoice && response.settings.proformaInvoice.effectiveFrom
                        ? moment(response.settings.proformaInvoice.effectiveFrom).format('YYYY-MM-DD')
                        : '',
                pInRestartingNum: response.settings.proformaInvoice ? response.settings.proformaInvoice.restartingNum : 1,
                pInPrefixEffectiveFrom:
                    response.settings.proformaInvoice && response.settings.proformaInvoice.prefixEffectiveFrom
                        ? moment(response.settings.proformaInvoice.prefixEffectiveFrom).format('YYYY-MM-DD')
                        : '',
                pInPrefix:
                    response.settings.proformaInvoice && response.settings.proformaInvoice.prefix ? response.settings.proformaInvoice.prefix : '',
                pInSuffixEffectiveFrom:
                    response.settings.proformaInvoice && response.settings.proformaInvoice.suffixEffectiveFrom
                        ? moment(response.settings.proformaInvoice.suffixEffectiveFrom).format('YYYY-MM-DD')
                        : '',
                pInSuffix:
                    response.settings.proformaInvoice && response.settings.proformaInvoice.suffix ? response.settings.proformaInvoice.suffix : '',
                pInRepeatingPeriod: response.settings.proformaInvoice
                    ? this.state.repeatingPeriodList.find((v) => v.value === response.settings.proformaInvoice.repeatingPeriod)
                    : { label: 'Never', value: 1 },



                dtReceiptAuto: response.settings.dualTransactionReceipt ? response.settings.dualTransactionReceipt.automatic : false,
                dtReceiptStartingNum: response.settings.dualTransactionReceipt
                    ? response.settings.dualTransactionReceipt.startingNumber
                    : 1,
                dtReceiptWidthOfNumericPart: response.settings.dualTransactionReceipt
                    ? response.settings.dualTransactionReceipt.widthOfNumericPart
                    : 1,
                dtReceiptPrefillWithZero: response.settings.dualTransactionReceipt
                    ? response.settings.dualTransactionReceipt.prefillWithZero
                    : false,
                dtReceiptEffectiveFrom:
                    response.settings.dualTransactionReceipt && response.settings.dualTransactionReceipt.effectiveFrom
                        ? moment(response.settings.dualTransactionReceipt.effectiveFrom).format('YYYY-MM-DD')
                        : '',
                dtReceiptRestartingNum: response.settings.dualTransactionReceipt
                    ? response.settings.dualTransactionReceipt.restartingNum
                    : 1,
                dtReceiptPrefixEffectiveFrom:
                    response.settings.dualTransactionReceipt && response.settings.dualTransactionReceipt.prefixEffectiveFrom
                        ? moment(response.settings.dualTransactionReceipt.prefixEffectiveFrom).format('YYYY-MM-DD')
                        : '',
                dtReceiptPrefix:
                    response.settings.dualTransactionReceipt && response.settings.dualTransactionReceipt.prefix
                        ? response.settings.dualTransactionReceipt.prefix
                        : '',
                dtReceiptSuffixEffectiveFrom:
                    response.settings.dualTransactionReceipt && response.settings.dualTransactionReceipt.suffixEffectiveFrom
                        ? moment(response.settings.dualTransactionReceipt.suffixEffectiveFrom).format('YYYY-MM-DD')
                        : '',
                dtReceiptSuffix:
                    response.settings.dualTransactionReceipt && response.settings.dualTransactionReceipt.suffix
                        ? response.settings.dualTransactionReceipt.suffix
                        : '',
                dtReceiptRepeatingPeriod: response.settings.dualTransactionReceipt
                    ? this.state.repeatingPeriodList.find((v) => v.value === response.settings.dualTransactionReceipt.repeatingPeriod)
                    : { label: 'Never', value: 1 },

                dtPaymentAuto: response.settings.dualTransactionPayment ? response.settings.dualTransactionPayment.automatic : false,
                dtPaymentStartingNum: response.settings.dualTransactionPayment
                    ? response.settings.dualTransactionPayment.startingNumber
                    : 1,
                dtPaymentWidthOfNumericPart: response.settings.dualTransactionPayment
                    ? response.settings.dualTransactionPayment.widthOfNumericPart
                    : 1,
                dtPaymentPrefillWithZero: response.settings.dualTransactionPayment
                    ? response.settings.dualTransactionPayment.prefillWithZero
                    : false,
                dtPaymentEffectiveFrom:
                    response.settings.dualTransactionPayment && response.settings.dualTransactionPayment.effectiveFrom
                        ? moment(response.settings.dualTransactionPayment.effectiveFrom).format('YYYY-MM-DD')
                        : '',
                dtPaymentRestartingNum: response.settings.dualTransactionPayment
                    ? response.settings.dualTransactionPayment.restartingNum
                    : 1,
                dtPaymentPrefixEffectiveFrom:
                    response.settings.dualTransactionPayment && response.settings.dualTransactionPayment.prefixEffectiveFrom
                        ? moment(response.settings.dualTransactionPayment.prefixEffectiveFrom).format('YYYY-MM-DD')
                        : '',
                dtPaymentPrefix:
                    response.settings.dualTransactionPayment && response.settings.dualTransactionPayment.prefix
                        ? response.settings.dualTransactionPayment.prefix
                        : '',
                dtPaymentSuffixEffectiveFrom:
                    response.settings.dualTransactionPayment && response.settings.dualTransactionPayment.suffixEffectiveFrom
                        ? moment(response.settings.dualTransactionPayment.suffixEffectiveFrom).format('YYYY-MM-DD')
                        : '',
                dtPaymentSuffix:
                    response.settings.dualTransactionPayment && response.settings.dualTransactionPayment.suffix
                        ? response.settings.dualTransactionPayment.suffix
                        : '',
                dtPaymentRepeatingPeriod: response.settings.dualTransactionPayment
                    ? this.state.repeatingPeriodList.find((v) => v.value === response.settings.dualTransactionPayment.repeatingPeriod)
                    : { label: 'Never', value: 1 }
                //DON'T DELETE THE FOLLOWING CODES
                // gTAuto: response.settings.generalTaxInvoice.automatic,
                // gTStartingNum: response.settings.generalTaxInvoice.startingNumber,
                // gTWidthOfNumericPart: response.settings.generalTaxInvoice.widthOfNumericPart,
                // gTPrefillWithZero: response.settings.generalTaxInvoice.prefillWithZero,
                // gTEffectiveFrom: response.settings.generalTaxInvoice.effectiveFrom
                //     ? moment(response.settings.generalTaxInvoice.effectiveFrom).format('YYYY-MM-DD')
                //     : null,
                // gTRestartingNum: response.settings.generalTaxInvoice.restartingNum,
                // gTPrefixEffectiveFrom: !!response.settings.generalTaxInvoice.prefixEffectiveFrom
                //     ? moment(response.settings.generalTaxInvoice.prefixEffectiveFrom).format('YYYY-MM-DD')
                //     : null,
                // gTPrefix: response.settings.generalTaxInvoice.prefix ? response.settings.generalTaxInvoice.prefix : '',
                // gTSuffixEffectiveFrom: !!response.settings.generalTaxInvoice.suffixEffectiveFrom
                //     ? moment(response.settings.generalTaxInvoice.suffixEffectiveFrom).format('YYYY-MM-DD')
                //     : null,
                // gTSuffix: response.settings.generalTaxInvoice.suffix ? response.settings.generalTaxInvoice.suffix : '',
                // gTRepeatingPeriod: this.state.repeatingPeriodList.find(
                //     (v) => v.value === response.settings.generalTaxInvoice.repeatingPeriod
                // ),
                // dTAuto: response.settings.dualTransactionVoucher.automatic,
                // dTStartingNum: response.settings.dualTransactionVoucher.startingNumber,
                // dTWidthOfNumericPart: response.settings.dualTransactionVoucher.widthOfNumericPart,
                // dTPrefillWithZero: response.settings.dualTransactionVoucher.prefillWithZero,
                // dTEffectiveFrom: response.settings.dualTransactionVoucher.effectiveFrom
                //     ? moment(response.settings.dualTransactionVoucher.effectiveFrom).format('YYYY-MM-DD')
                //     : null,
                // dTRestartingNum: response.settings.dualTransactionVoucher.restartingNum,
                // dTPrefixEffectiveFrom: !!response.settings.dualTransactionVoucher.prefixEffectiveFrom
                //     ? moment(response.settings.dualTransactionVoucher.prefixEffectiveFrom).format('YYYY-MM-DD')
                //     : null,
                // dTPrefix: response.settings.dualTransactionVoucher.prefix ? response.settings.dualTransactionVoucher.prefix : '',
                // dTSuffixEffectiveFrom: !!response.settings.dualTransactionVoucher.suffixEffectiveFrom
                //     ? moment(response.settings.dualTransactionVoucher.suffixEffectiveFrom).format('YYYY-MM-DD')
                //     : null,
                // dTSuffix: response.settings.dualTransactionVoucher.suffix ? response.settings.dualTransactionVoucher.suffix : '',
                // dTRepeatingPeriod: this.state.repeatingPeriodList.find(
                //     (v) => v.value === response.settings.dualTransactionVoucher.repeatingPeriod
                // ),
                //DON'T DELETE THE FOLLOWING CODES
            });
        });

        LedgerService.getBankAccountLedgers().then((response) => {
            let formattedData = [];

            response.map((v) => {
                formattedData.push({ label: v.name, value: v.id });
            });

            this.setState({
                ledgers: formattedData
            });

            let selectedBank = formattedData.find((v) => v.value === this.state.bankDetails.bankId);
            this.setState({
                bankName: !!selectedBank ? selectedBank : null
            });
        });
    }

    onTextChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onDropDownChange(value, action) {
        this.setState({ [action.name]: value });
    }

    onCheckBoxChange = (e) => {
        if (e.target.name === 'pVAuto') {
            this.setState({ [e.target.name]: e.target.checked }, () => {
                this.resetPaymentVoucherSettings();
            });
        }
        if (e.target.name === 'rVAuto') {
            this.setState({ [e.target.name]: e.target.checked }, () => {
                this.resetReceiptVoucherSettings();
            });
        }
        if (e.target.name === 'jVAuto') {
            this.setState({ [e.target.name]: e.target.checked }, () => {
                this.resetJournalVoucherSettings();
            });
        }
        if (e.target.name === 'dTAuto') {
            this.setState({ [e.target.name]: e.target.checked }, () => {
                this.resetDualTransactionSettings();
            });
        }
        if (e.target.name === 'gTAuto') {
            this.setState({ [e.target.name]: e.target.checked }, () => {
                this.resetGeneralTaxSettings();
            });
        }
        if (e.target.name === 'sInAuto') {
            this.setState({ [e.target.name]: e.target.checked }, () => {
                this.resetSalesInvoiceSettings();
            });
        } else {
            this.setState({ [e.target.name]: e.target.checked });
        }
        if (e.target.name === 'pInAuto') {
            this.setState({ [e.target.name]: e.target.checked }, () => {
                this.resetProformaInvoiceSetting();
            });
        } else {
            this.setState({ [e.target.name]: e.target.checked });
        }
    };

    onClickChange(e) {
        var id = 1;
        if (e == 'billedToLedgerId') {
            var page = <CreateLedger id={id} />;
            this.setState({ renderPages: page, isModalVisible: true });
        } else if (e == 'onClose') {
            let formattedData = [];

            LedgerService.getBankAccountLedgers().then((response) => {
                let formattedData = [];

                response.map((v) => {
                    formattedData.push({ label: v.name, value: v.id });
                });

                this.setState({
                    ledgers: formattedData
                });

                let selectedBank = formattedData.find((v) => v.value === this.state.settings.bankDetails.bankId);
                this.setState({
                    bankName: selectedBank
                });
            });
            this.setState({ isModalVisible: false });
        }
    }

    resetPaymentVoucherSettings() {
        this.setState({
            pVStartingNum: 1,
            pVWidthOfNumericPart: 1,
            pVPrefillWithZero: false,
            pVEffectiveFrom: '',
            pVRestartingNum: 1,
            pVPrefixEffectiveFrom: '',
            pVPrefix: '',
            pVSuffixEffectiveFrom: '',
            pVSuffix: '',
            pVRepeatingPeriod: { label: 'Never', value: 1 }
        });
    }

    resetReceiptVoucherSettings() {
        this.setState({
            rVStartingNum: 1,
            rVWidthOfNumericPart: 1,
            rVPrefillWithZero: false,
            rVEffectiveFrom: '',
            rVRestartingNum: 1,
            rVPrefixEffectiveFrom: '',
            rVPrefix: '',
            rVSuffixEffectiveFrom: '',
            rVSuffix: '',
            rVRepeatingPeriod: { label: 'Never', value: 1 }
        });
    }

    resetDtPaymentVoucherSettings() {
        this.setState({
            dtPaymentStartingNum: 1,
            dtPaymentWidthOfNumericPart: 1,
            dtPaymentPrefillWithZero: false,
            dtPaymentEffectiveFrom: '',
            dtPaymentRestartingNum: 1,
            dtPaymentPrefixEffectiveFrom: '',
            dtPaymentPrefix: '',
            dtPaymentSuffixEffectiveFrom: '',
            dtPaymentSuffix: '',
            dtPaymentRepeatingPeriod: { label: 'Never', value: 1 }
        });
    }

    resetDtReceiptVoucherSettings() {
        this.setState({
            dtReceiptStartingNum: 1,
            dtReceiptWidthOfNumericPart: 1,
            dtReceiptPrefillWithZero: false,
            dtReceiptEffectiveFrom: '',
            dtReceiptRestartingNum: 1,
            dtReceiptPrefixEffectiveFrom: '',
            dtReceiptPrefix: '',
            dtReceiptSuffixEffectiveFrom: '',
            dtReceiptSuffix: '',
            dtReceiptRepeatingPeriod: { label: 'Never', value: 1 }
        });
    }

    resetJournalVoucherSettings() {
        this.setState({
            jVStartingNum: 1,
            jVWidthOfNumericPart: 1,
            jVPrefillWithZero: false,
            jVEffectiveFrom: '',
            jVRestartingNum: 1,
            jVPrefixEffectiveFrom: '',
            jVPrefix: '',
            jVSuffixEffectiveFrom: '',
            jVSuffix: '',
            jVRepeatingPeriod: { label: 'Never', value: 1 }
        });
    }

    resetSalesInvoiceSettings() {
        this.setState({
            sInStartingNum: 1,
            sInWidthOfNumericPart: 1,
            sInPrefillWithZero: false,
            sInEffectiveFrom: '',
            sInRestartingNum: 1,
            sInPrefixEffectiveFrom: '',
            sInPrefix: '',
            sInSuffixEffectiveFrom: '',
            sInSuffix: '',
            sInRepeatingPeriod: { label: 'Never', value: 1 }
        });
    }
        resetProformaInvoiceSetting() {
            this.setState({
                pInStartingNum: 1,
                pInWidthOfNumericPart: 1,
                pInPrefillWithZero: false,
                pInEffectiveFrom: '',
                pInRestartingNum: 1,
                pInPrefixEffectiveFrom: '',
                pInPrefix: '',
                pInSuffixEffectiveFrom: '',
                pInSuffix: '',
                pInRepeatingPeriod: { label: 'Never', value: 1 }
            });
        

        // resetDualTransactionSettings() {
        //     this.setState({
        //         dTStartingNum: 1,
        //         dTWidthOfNumericPart: 1,
        //         dTPrefillWithZero: false,
        //         dTEffectiveFrom: '',
        //         dTRestartingNum: 1,
        //         dTPrefixEffectiveFrom: '',
        //         dTPrefix: '',
        //         dTSuffixEffectiveFrom: '',
        //         dTSuffix: '',
        //         dTRepeatingPeriod: { label: 'Never', value: 1 }
        //     });
        // }

        // resetGeneralTaxSettings() {
        //     this.setState({
        //         gTStartingNum: 1,
        //         gTWidthOfNumericPart: 1,
        //         gTPrefillWithZero: false,
        //         gTEffectiveFrom: '',
        //         gTRestartingNum: 1,
        //         gTPrefixEffectiveFrom: '',
        //         gTPrefix: '',
        //         gTSuffixEffectiveFrom: '',
        //         gTSuffix: '',
        //         gTRepeatingPeriod: { label: 'Never', value: 1 }
        //     });
        // }
    }

    render() {
        return (
            <>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h4">Voucher Settings</Card.Title>
                            </Card.Header>
                        </Card>

                        <Formik
                            enableReinitialize
                            initialValues={{
                                companyId: this.state.companyId,
                                id: this.state.id,
                                ledgerId: this.state.ledgerId,
                                bankName: this.state.bankName,

                                pVAuto: this.state.pVAuto,
                                pVStartingNum: this.state.pVStartingNum,
                                pVWidthOfNumericPart: this.state.pVWidthOfNumericPart,
                                pVPrefillWithZero: this.state.pVPrefillWithZero,
                                pVEffectiveFrom: this.state.pVEffectiveFrom,
                                pVRestartingNum: this.state.pVRestartingNum,
                                pVRepeatingPeriod: this.state.pVRepeatingPeriod,
                                pVPrefix: this.state.pVPrefix,
                                pVPrefixEffectiveFrom: this.state.pVPrefixEffectiveFrom,
                                pVSuffix: this.state.pVSuffix,
                                pVSuffixEffectiveFrom: this.state.pVSuffixEffectiveFrom,

                                rVAuto: this.state.rVAuto,
                                rVStartingNum: this.state.rVStartingNum,
                                rVWidthOfNumericPart: this.state.rVWidthOfNumericPart,
                                rVPrefillWithZero: this.state.rVPrefillWithZero,
                                rVEffectiveFrom: this.state.rVEffectiveFrom,
                                rVRestartingNum: this.state.rVRestartingNum,
                                rVRepeatingPeriod: this.state.rVRepeatingPeriod,
                                rVPrefix: this.state.rVPrefix,
                                rVPrefixEffectiveFrom: this.state.rVPrefixEffectiveFrom,
                                rVSuffix: this.state.rVSuffix,
                                rVSuffixEffectiveFrom: this.state.rVSuffixEffectiveFrom,

                                dtPaymentAuto: this.state.dtPaymentAuto,
                                dtPaymentStartingNum: this.state.dtPaymentStartingNum,
                                dtPaymentWidthOfNumericPart: this.state.dtPaymentWidthOfNumericPart,
                                dtPaymentPrefillWithZero: this.state.dtPaymentPrefillWithZero,
                                dtPaymentEffectiveFrom: this.state.dtPaymentEffectiveFrom,
                                dtPaymentRestartingNum: this.state.dtPaymentRestartingNum,
                                dtPaymentRepeatingPeriod: this.state.dtPaymentRepeatingPeriod,
                                dtPaymentPrefix: this.state.dtPaymentPrefix,
                                dtPaymentPrefixEffectiveFrom: this.state.dtPaymentPrefixEffectiveFrom,
                                dtPaymentSuffix: this.state.dtPaymentSuffix,
                                dtPaymentSuffixEffectiveFrom: this.state.dtPaymentSuffixEffectiveFrom,

                                dtReceiptAuto: this.state.dtReceiptAuto,
                                dtReceiptStartingNum: this.state.dtReceiptStartingNum,
                                dtReceiptWidthOfNumericPart: this.state.dtReceiptWidthOfNumericPart,
                                dtReceiptPrefillWithZero: this.state.dtReceiptPrefillWithZero,
                                dtReceiptEffectiveFrom: this.state.dtReceiptEffectiveFrom,
                                dtReceiptRestartingNum: this.state.dtReceiptRestartingNum,
                                dtReceiptRepeatingPeriod: this.state.dtReceiptRepeatingPeriod,
                                dtReceiptPrefix: this.state.dtReceiptPrefix,
                                dtReceiptPrefixEffectiveFrom: this.state.dtReceiptPrefixEffectiveFrom,
                                dtReceiptSuffix: this.state.dtReceiptSuffix,
                                dtReceiptSuffixEffectiveFrom: this.state.dtReceiptSuffixEffectiveFrom,

                                jVAuto: this.state.jVAuto,
                                jVStartingNum: this.state.jVStartingNum,
                                jVWidthOfNumericPart: this.state.jVWidthOfNumericPart,
                                jVPrefillWithZero: this.state.jVPrefillWithZero,
                                jVEffectiveFrom: this.state.jVEffectiveFrom,
                                jVRestartingNum: this.state.jVRestartingNum,
                                jVRepeatingPeriod: this.state.jVRepeatingPeriod,
                                jVPrefix: this.state.jVPrefix,
                                jVPrefixEffectiveFrom: this.state.jVPrefixEffectiveFrom,
                                jVSuffix: this.state.jVSuffix,
                                jVSuffixEffectiveFrom: this.state.jVSuffixEffectiveFrom,

                                // DON'T DELETE BELOW CODES AS IT IS FOR FUTURE REFERENCES
                                // dTAuto: this.state.dTAuto,
                                // dTStartingNum: this.state.dTStartingNum,
                                // dTWidthOfNumericPart: this.state.dTWidthOfNumericPart,
                                // dTPrefillWithZero: this.state.dTPrefillWithZero,
                                // dTEffectiveFrom: this.state.dTEffectiveFrom,
                                // dTRestartingNum: this.state.dTRestartingNum,
                                // dTRepeatingPeriod: this.state.dTRepeatingPeriod,
                                // dTPrefix: this.state.dTPrefix,
                                // dTPrefixEffectiveFrom: this.state.dTPrefixEffectiveFrom,
                                // dTSuffix: this.state.dTSuffix,
                                // dTSuffixEffectiveFrom: this.state.dTSuffixEffectiveFrom,

                                // gTAuto: this.state.gTAuto,
                                // gTStartingNum: this.state.gTStartingNum,
                                // gTWidthOfNumericPart: this.state.gTWidthOfNumericPart,
                                // gTPrefillWithZero: this.state.gTPrefillWithZero,
                                // gTEffectiveFrom: this.state.gTEffectiveFrom,
                                // gTRestartingNum: this.state.gTRestartingNum,
                                // gTRepeatingPeriod: this.state.gTRepeatingPeriod,
                                // gTPrefix: this.state.gTPrefix,
                                // gTPrefixEffectiveFrom: this.state.gTPrefixEffectiveFrom,
                                // gTSuffix: this.state.gTSuffix,
                                // gTSuffixEffectiveFrom: this.state.gTSuffixEffectiveFrom,
                                // DON'T DELETE BELOW CODES AS IT IS FOR FUTURE REFERENCES
                                sInAuto: this.state.sInAuto,
                                sInStartingNum: this.state.sInStartingNum,
                                sInWidthOfNumericPart: this.state.sInWidthOfNumericPart,
                                sInPrefillWithZero: this.state.sInPrefillWithZero,
                                sInEffectiveFrom: this.state.sInEffectiveFrom,
                                sInRestartingNum: this.state.sInRestartingNum,
                                sInRepeatingPeriod: this.state.sInRepeatingPeriod,
                                sInPrefix: this.state.sInPrefix,
                                sInPrefixEffectiveFrom: this.state.sInPrefixEffectiveFrom,
                                sInSuffix: this.state.sInSuffix,
                                sInSuffixEffectiveFrom: this.state.sInSuffixEffectiveFrom,

                                pInAuto: this.state.pInAuto,
                                pInStartingNum: this.state.pInStartingNum,
                                pInWidthOfNumericPart: this.state.pInWidthOfNumericPart,
                                pInPrefillWithZero: this.state.pInPrefillWithZero,
                                pInEffectiveFrom: this.state.pInEffectiveFrom,
                                pInRestartingNum: this.state.pInRestartingNum,
                                pInRepeatingPeriod: this.state.pInRepeatingPeriod,
                                pInPrefix: this.state.pInPrefix,
                                pInPrefixEffectiveFrom: this.state.pInPrefixEffectiveFrom,
                                pInSuffix: this.state.pInSuffix,
                                pInSuffixEffectiveFrom: this.state.pInSuffixEffectiveFrom
                            }}
                            validationSchema={Yup.object().shape({
                                bankName: Yup.object()
                                    .shape({
                                        label: Yup.string(),
                                        value: Yup.string()
                                    })
                                    .nullable()
                                    .required('This field is required'),
                                pVStartingNum: Yup.string().when('pVAuto', {
                                    is: true,
                                    then: Yup.string()
                                        .required()
                                        .matches(/^[0-9]+$/, 'Must be only digits')
                                        .min(1, 'Must be exactly 5 digits')
                                        .max(
                                            this.state.pVWidthOfNumericPart,
                                            `Maximum allowed digits are ${this.state.pVWidthOfNumericPart}`
                                        )
                                }),
                                pVWidthOfNumericPart: Yup.number().when('pVAuto', {
                                    is: true,
                                    then: Yup.number().min(1, 'This field is required and must be greater than zero')
                                }),
                                pVRestartingNum: Yup.string().when('pVAuto', {
                                    is: true,
                                    then: Yup.string()
                                        .required()
                                        .matches(/^[0-9]+$/, 'Must be only digits')
                                        .min(1, 'Must be exactly 5 digits')
                                        .max(
                                            this.state.pVWidthOfNumericPart,
                                            `Maximum allowed digits are ${this.state.pVWidthOfNumericPart}`
                                        )
                                }),
                                pVEffectiveFrom: Yup.date()
                                    .nullable()
                                    .transform((curr, orig) => (orig === '' ? null : curr))
                                    .when('pVAuto', {
                                        is: true,
                                        then: Yup.date()
                                            .nullable()
                                            .transform((curr, orig) => (orig === '' ? null : curr))
                                            .required('This field is required')
                                    }),
                                pVPrefix: Yup.string(),
                                pVPrefixEffectiveFrom: Yup.date()
                                    .nullable()
                                    .transform((curr, orig) => (orig === '' ? null : curr))
                                    .when('pVPrefix', (pVPrefix) => {
                                        if (pVPrefix)
                                            return Yup.date()
                                                .nullable()
                                                .transform((curr, orig) => (orig === '' ? null : curr))
                                                .required('Prefix - Effective From is required');
                                    }),
                                pVSuffix: Yup.string(),
                                pVSuffixEffectiveFrom: Yup.date()
                                    .nullable()
                                    .transform((curr, orig) => (orig === '' ? null : curr))
                                    .when('pVSuffix', (pVSuffix) => {
                                        if (!!pVSuffix)
                                            return Yup.date()
                                                .nullable()
                                                .transform((curr, orig) => (orig === '' ? null : curr))
                                                .required('Suffix - Effective From is required');
                                    }),

                                rVStartingNum: Yup.string().when('rVAuto', {
                                    is: true,
                                    then: Yup.string()
                                        .required()
                                        .matches(/^[0-9]+$/, 'Must be only digits')
                                        .min(1, 'Must be exactly 5 digits')
                                        .max(
                                            this.state.rVWidthOfNumericPart,
                                            `Maximum allowed digits are ${this.state.rVWidthOfNumericPart}`
                                        )
                                }),
                                rVWidthOfNumericPart: Yup.number().when('rVAuto', {
                                    is: true,
                                    then: Yup.number().min(1, 'This field is required and must be greater than zero')
                                }),
                                rVRestartingNum: Yup.string().when('rVAuto', {
                                    is: true,
                                    then: Yup.string()
                                        .required()
                                        .matches(/^[0-9]+$/, 'Must be only digits')
                                        .min(1, 'Must be exactly 1 digit')
                                        .max(
                                            this.state.rVWidthOfNumericPart,
                                            `Maximum allowed digits are ${this.state.rVWidthOfNumericPart}`
                                        )
                                }),
                                rVEffectiveFrom: Yup.date()
                                    .nullable()
                                    .transform((curr, orig) => (orig === '' ? null : curr))
                                    .when('rVAuto', {
                                        is: true,
                                        then: Yup.date()
                                            .nullable()
                                            .transform((curr, orig) => (orig === '' ? null : curr))
                                            .required('This field is required')
                                    }),
                                rVPrefix: Yup.string(),
                                rVPrefixEffectiveFrom: Yup.date()
                                    .nullable()
                                    .transform((curr, orig) => (orig === '' ? null : curr))
                                    .when('rVPrefix', (rVPrefix) => {
                                        if (rVPrefix)
                                            return Yup.date()
                                                .nullable()
                                                .transform((curr, orig) => (orig === '' ? null : curr))
                                                .required('Prefix - Effective From is required');
                                    }),
                                rVSuffix: Yup.string(),
                                rVSuffixEffectiveFrom: Yup.date()
                                    .nullable()
                                    .transform((curr, orig) => (orig === '' ? null : curr))
                                    .when('rVSuffix', (rVSuffix) => {
                                        if (!!rVSuffix)
                                            return Yup.date()
                                                .nullable()
                                                .transform((curr, orig) => (orig === '' ? null : curr))
                                                .required('Suffix - Effective From is required');
                                    }),

                                dtPaymentStartingNum: Yup.string().when('dtPaymentAuto', {
                                    is: true,
                                    then: Yup.string()
                                        .required()
                                        .matches(/^[0-9]+$/, 'Must be only digits')
                                        .min(1, 'Must be exactly 5 digits')
                                        .max(
                                            this.state.dtPaymentWidthOfNumericPart,
                                            `Maximum allowed digits are ${this.state.dtPaymentWidthOfNumericPart}`
                                        )
                                }),
                                dtPaymentWidthOfNumericPart: Yup.number().when('dtPaymentAuto', {
                                    is: true,
                                    then: Yup.number().min(1, 'This field is required and must be greater than zero')
                                }),
                                dtPaymentRestartingNum: Yup.string().when('dtPaymentAuto', {
                                    is: true,
                                    then: Yup.string()
                                        .required()
                                        .matches(/^[0-9]+$/, 'Must be only digits')
                                        .min(1, 'Must be exactly 5 digits')
                                        .max(
                                            this.state.dtPaymentWidthOfNumericPart,
                                            `Maximum allowed digits are ${this.state.dtPaymentWidthOfNumericPart}`
                                        )
                                }),
                                dtPaymentEffectiveFrom: Yup.date()
                                    .nullable()
                                    .transform((curr, orig) => (orig === '' ? null : curr))
                                    .when('dtPaymentAuto', {
                                        is: true,
                                        then: Yup.date()
                                            .nullable()
                                            .transform((curr, orig) => (orig === '' ? null : curr))
                                            .required('This field is required')
                                    }),
                                dtPaymentPrefix: Yup.string(),
                                dtPaymentPrefixEffectiveFrom: Yup.date()
                                    .nullable()
                                    .transform((curr, orig) => (orig === '' ? null : curr))
                                    .when('dtPaymentPrefix', (dtPaymentPrefix) => {
                                        if (dtPaymentPrefix)
                                            return Yup.date()
                                                .nullable()
                                                .transform((curr, orig) => (orig === '' ? null : curr))
                                                .required('Prefix - Effective From is required');
                                    }),
                                dtPaymentSuffix: Yup.string(),
                                dtPaymentSuffixEffectiveFrom: Yup.date()
                                    .nullable()
                                    .transform((curr, orig) => (orig === '' ? null : curr))
                                    .when('dtPaymentSuffix', (dtPaymentSuffix) => {
                                        if (!!dtPaymentSuffix)
                                            return Yup.date()
                                                .nullable()
                                                .transform((curr, orig) => (orig === '' ? null : curr))
                                                .required('Suffix - Effective From is required');
                                    }),

                                dtReceiptStartingNum: Yup.string().when('dtReceiptAuto', {
                                    is: true,
                                    then: Yup.string()
                                        .required()
                                        .matches(/^[0-9]+$/, 'Must be only digits')
                                        .min(1, 'Must be exactly 5 digits')
                                        .max(
                                            this.state.dtReceiptWidthOfNumericPart,
                                            `Maximum allowed digits are ${this.state.dtReceiptWidthOfNumericPart}`
                                        )
                                }),
                                dtReceiptWidthOfNumericPart: Yup.number().when('dtReceiptAuto', {
                                    is: true,
                                    then: Yup.number().min(1, 'This field is required and must be greater than zero')
                                }),
                                dtReceiptRestartingNum: Yup.string().when('dtReceiptAuto', {
                                    is: true,
                                    then: Yup.string()
                                        .required()
                                        .matches(/^[0-9]+$/, 'Must be only digits')
                                        .min(1, 'Must be exactly 1 digit')
                                        .max(
                                            this.state.dtReceiptWidthOfNumericPart,
                                            `Maximum allowed digits are ${this.state.dtReceiptWidthOfNumericPart}`
                                        )
                                }),
                                dtReceiptEffectiveFrom: Yup.date()
                                    .nullable()
                                    .transform((curr, orig) => (orig === '' ? null : curr))
                                    .when('dtReceiptAuto', {
                                        is: true,
                                        then: Yup.date()
                                            .nullable()
                                            .transform((curr, orig) => (orig === '' ? null : curr))
                                            .required('This field is required')
                                    }),
                                dtReceiptPrefix: Yup.string(),
                                dtReceiptPrefixEffectiveFrom: Yup.date()
                                    .nullable()
                                    .transform((curr, orig) => (orig === '' ? null : curr))
                                    .when('dtReceiptPrefix', (dtReceiptPrefix) => {
                                        if (dtReceiptPrefix)
                                            return Yup.date()
                                                .nullable()
                                                .transform((curr, orig) => (orig === '' ? null : curr))
                                                .required('Prefix - Effective From is required');
                                    }),
                                dtReceiptSuffix: Yup.string(),
                                dtReceiptSuffixEffectiveFrom: Yup.date()
                                    .nullable()
                                    .transform((curr, orig) => (orig === '' ? null : curr))
                                    .when('dtReceiptSuffix', (dtReceiptSuffix) => {
                                        if (!!dtReceiptSuffix)
                                            return Yup.date()
                                                .nullable()
                                                .transform((curr, orig) => (orig === '' ? null : curr))
                                                .required('Suffix - Effective From is required');
                                    }),

                                jVStartingNum: Yup.string().when('jVAuto', {
                                    is: true,
                                    then: Yup.string()
                                        .required()
                                        .matches(/^[0-9]+$/, 'Must be only digits')
                                        .min(1, 'Must be exactly 5 digits')
                                        .max(
                                            this.state.jVWidthOfNumericPart,
                                            `Maximum allowed digits are ${this.state.jVWidthOfNumericPart}`
                                        )
                                }),
                                jVWidthOfNumericPart: Yup.number().when('jVAuto', {
                                    is: true,
                                    then: Yup.number().min(1, 'This field is required and must be greater than zero')
                                }),
                                jVRestartingNum: Yup.string().when('jVAuto', {
                                    is: true,
                                    then: Yup.string()
                                        .required()
                                        .matches(/^[0-9]+$/, 'Must be only digits')
                                        .min(1, 'Must be exactly 5 digits')
                                        .max(
                                            this.state.jVWidthOfNumericPart,
                                            `Maximum allowed digits are ${this.state.jVWidthOfNumericPart}`
                                        )
                                }),
                                jVEffectiveFrom: Yup.date()
                                    .nullable()
                                    .transform((curr, orig) => (orig === '' ? null : curr))
                                    .when('jVAuto', {
                                        is: true,
                                        then: Yup.date()
                                            .nullable()
                                            .transform((curr, orig) => (orig === '' ? null : curr))
                                            .required('This field is required')
                                    }),
                                jVPrefix: Yup.string(),
                                jVPrefixEffectiveFrom: Yup.date()
                                    .nullable()
                                    .transform((curr, orig) => (orig === '' ? null : curr))
                                    .when('jVPrefix', (jVPrefix) => {
                                        if (jVPrefix)
                                            return Yup.date()
                                                .nullable()
                                                .transform((curr, orig) => (orig === '' ? null : curr))
                                                .required('Prefix - Effective From is required');
                                    }),
                                jVSuffix: Yup.string(),
                                jVSuffixEffectiveFrom: Yup.date()
                                    .nullable()
                                    .transform((curr, orig) => (orig === '' ? null : curr))
                                    .when('jVSuffix', (jVSuffix) => {
                                        if (!!jVSuffix)
                                            return Yup.date()
                                                .nullable()
                                                .transform((curr, orig) => (orig === '' ? null : curr))
                                                .required('Suffix - Effective From is required');
                                    }),
                                // DON'T DELETE BELOW CODES AS IT IS FOR FUTURE REFERENCES
                                // dTStartingNum: Yup.string().when('dTAuto', {
                                //     is: true,
                                //     then: Yup.string()
                                //         .required()
                                //         .matches(/^[0-9]+$/, 'Must be only digits')
                                //         .min(1, 'Must be exactly 5 digits')
                                //         .max(
                                //             this.state.dTWidthOfNumericPart,
                                //             `Maximum allowed digits are ${this.state.dTWidthOfNumericPart}`
                                //         )
                                // }),
                                // dTWidthOfNumericPart: Yup.number().when('dTAuto', {
                                //     is: true,
                                //     then: Yup.number().min(1, 'This field is required and must be greater than zero')
                                // }),
                                // dTRestartingNum: Yup.string().when('dTAuto', {
                                //     is: true,
                                //     then: Yup.string()
                                //         .required()
                                //         .matches(/^[0-9]+$/, 'Must be only digits')
                                //         .min(1, 'Must be exactly 5 digits')
                                //         .max(
                                //             this.state.dTWidthOfNumericPart,
                                //             `Maximum allowed digits are ${this.state.dTWidthOfNumericPart}`
                                //         )
                                // }),
                                // dTEffectiveFrom: Yup.date()
                                //     .nullable()
                                //     .transform((curr, orig) => (orig === '' ? null : curr))
                                //     .when('dTAuto', {
                                //         is: true,
                                //         then: Yup.date()
                                //             .nullable()
                                //             .transform((curr, orig) => (orig === '' ? null : curr))
                                //             .required('This field is required')
                                //     }),
                                // dTPrefix: Yup.string(),
                                // dTPrefixEffectiveFrom: Yup.date()
                                //     .nullable()
                                //     .transform((curr, orig) => (orig === '' ? null : curr))
                                //     .when('dTPrefix', (dTPrefix) => {
                                //         if (dTPrefix)
                                //             return Yup.date()
                                //                 .nullable()
                                //                 .transform((curr, orig) => (orig === '' ? null : curr))
                                //                 .required('Prefix - Effective From is required');
                                //     }),
                                // dTSuffix: Yup.string(),
                                // dTSuffixEffectiveFrom: Yup.date()
                                //     .nullable()
                                //     .transform((curr, orig) => (orig === '' ? null : curr))
                                //     .when('dTSuffix', (dTSuffix) => {
                                //         if (!!dTSuffix)
                                //             return Yup.date()
                                //                 .nullable()
                                //                 .transform((curr, orig) => (orig === '' ? null : curr))
                                //                 .required('Suffix - Effective From is required');
                                //     }),

                                // gTStartingNum: Yup.string().when('gTAuto', {
                                //     is: true,
                                //     then: Yup.string()
                                //         .required()
                                //         .matches(/^[0-9]+$/, 'Must be only digits')
                                //         .min(1, 'Must be exactly 5 digits')
                                //         .max(
                                //             this.state.gTWidthOfNumericPart,
                                //             `Maximum allowed digits are ${this.state.gTWidthOfNumericPart}`
                                //         )
                                // }),
                                // gTWidthOfNumericPart: Yup.number().when('gTAuto', {
                                //     is: true,
                                //     then: Yup.number().min(1, 'This field is required and must be greater than zero')
                                // }),
                                // gTRestartingNum: Yup.string().when('gTAuto', {
                                //     is: true,
                                //     then: Yup.string()
                                //         .required()
                                //         .matches(/^[0-9]+$/, 'Must be only digits')
                                //         .min(1, 'Must be exactly 5 digits')
                                //         .max(
                                //             this.state.gTWidthOfNumericPart,
                                //             `Maximum allowed digits are ${this.state.gTWidthOfNumericPart}`
                                //         )
                                // }),
                                // gTEffectiveFrom: Yup.date()
                                //     .nullable()
                                //     .transform((curr, orig) => (orig === '' ? null : curr))
                                //     .when('gTAuto', {
                                //         is: true,
                                //         then: Yup.date()
                                //             .nullable()
                                //             .transform((curr, orig) => (orig === '' ? null : curr))
                                //             .required('This field is required')
                                //     }),
                                // gTPrefix: Yup.string(),
                                // gTPrefixEffectiveFrom: Yup.date()
                                //     .nullable()
                                //     .transform((curr, orig) => (orig === '' ? null : curr))
                                //     .when('gTPrefix', (gTPrefix) => {
                                //         if (gTPrefix)
                                //             return Yup.date()
                                //                 .nullable()
                                //                 .transform((curr, orig) => (orig === '' ? null : curr))
                                //                 .required('Prefix - Effective From is required');
                                //     }),
                                // gTSuffix: Yup.string(),
                                // gTSuffixEffectiveFrom: Yup.date()
                                //     .nullable()
                                //     .transform((curr, orig) => (orig === '' ? null : curr))
                                //     .when('gTSuffix', (gTSuffix) => {
                                //         if (!!gTSuffix)
                                //             return Yup.date()
                                //                 .nullable()
                                //                 .transform((curr, orig) => (orig === '' ? null : curr))
                                //                 .required('Suffix - Effective From is required');
                                //     }),
                                // DON'T DELETE BELOW CODES AS IT IS FOR FUTURE REFERENCES

                                sInStartingNum: Yup.string().when('sInAuto', {
                                    is: true,
                                    then: Yup.string()
                                        .required()
                                        .matches(/^[0-9]+$/, 'Must be only digits')
                                        .min(1, 'Must be exactly 1 digits')
                                        .max(
                                            this.state.sInWidthOfNumericPart,
                                            `Maximum allowed digits are ${this.state.sInWidthOfNumericPart}`
                                        )
                                }),
                                sInWidthOfNumericPart: Yup.number().when('sInAuto', {
                                    is: true,
                                    then: Yup.number().min(1, 'This field is required and must be greater than zero')
                                }),
                                sInRestartingNum: Yup.string().when('sInAuto', {
                                    is: true,
                                    then: Yup.string()
                                        .required()
                                        .matches(/^[0-9]+$/, 'Must be only digits')
                                        .min(1, 'Must be exactly 5 digits')
                                        .max(
                                            this.state.sInWidthOfNumericPart,
                                            `Maximum allowed digits are ${this.state.sInWidthOfNumericPart}`
                                        )
                                }),
                                sInEffectiveFrom: Yup.date()
                                    .nullable()
                                    .transform((curr, orig) => (orig === '' ? null : curr))
                                    .when('sInAuto', {
                                        is: true,
                                        then: Yup.date()
                                            .nullable()
                                            .transform((curr, orig) => (orig === '' ? null : curr))
                                            .required('This field is required')
                                    }),
                                sInPrefix: Yup.string(),
                                sInPrefixEffectiveFrom: Yup.date()
                                    .nullable()
                                    .transform((curr, orig) => (orig === '' ? null : curr))
                                    .when('sInPrefix', (sInPrefix) => {
                                        if (sInPrefix)
                                            return Yup.date()
                                                .nullable()
                                                .transform((curr, orig) => (orig === '' ? null : curr))
                                                .required('Prefix - Effective From is required');
                                    }),
                                sInSuffix: Yup.string(),
                                sInSuffixEffectiveFrom: Yup.date()
                                    .nullable()
                                    .transform((curr, orig) => (orig === '' ? null : curr))
                                    .when('sInSuffix', (sInSuffix) => {
                                        if (!!sInSuffix)
                                            return Yup.date()
                                                .nullable()
                                                .transform((curr, orig) => (orig === '' ? null : curr))
                                                .required('Suffix - Effective From is required');
                                    })
                            })}
                            onSubmit={(
                                {
                                    pVAuto,
                                    pVStartingNum,
                                    pVWidthOfNumericPart,
                                    pVPrefillWithZero,
                                    pVEffectiveFrom,
                                    pVRestartingNum,
                                    pVRepeatingPeriod,
                                    pVPrefix,
                                    pVPrefixEffectiveFrom,
                                    pVSuffix,
                                    pVSuffixEffectiveFrom,

                                    jVAuto,
                                    jVStartingNum,
                                    jVWidthOfNumericPart,
                                    jVPrefillWithZero,
                                    jVEffectiveFrom,
                                    jVRestartingNum,
                                    jVRepeatingPeriod,
                                    jVPrefix,
                                    jVPrefixEffectiveFrom,
                                    jVSuffix,
                                    jVSuffixEffectiveFrom,

                                    rVAuto,
                                    rVStartingNum,
                                    rVWidthOfNumericPart,
                                    rVPrefillWithZero,
                                    rVEffectiveFrom,
                                    rVRestartingNum,
                                    rVRepeatingPeriod,
                                    rVPrefix,
                                    rVPrefixEffectiveFrom,
                                    rVSuffix,
                                    rVSuffixEffectiveFrom,

                                    dtPaymentAuto,
                                    dtPaymentStartingNum,
                                    dtPaymentWidthOfNumericPart,
                                    dtPaymentPrefillWithZero,
                                    dtPaymentEffectiveFrom,
                                    dtPaymentRestartingNum,
                                    dtPaymentRepeatingPeriod,
                                    dtPaymentPrefix,
                                    dtPaymentPrefixEffectiveFrom,
                                    dtPaymentSuffix,
                                    dtPaymentSuffixEffectiveFrom,

                                    dtReceiptAuto,
                                    dtReceiptStartingNum,
                                    dtReceiptWidthOfNumericPart,
                                    dtReceiptPrefillWithZero,
                                    dtReceiptEffectiveFrom,
                                    dtReceiptRestartingNum,
                                    dtReceiptRepeatingPeriod,
                                    dtReceiptPrefix,
                                    dtReceiptPrefixEffectiveFrom,
                                    dtReceiptSuffix,
                                    dtReceiptSuffixEffectiveFrom,

                                    // DON'T DELETE BELOW CODES AS IT IS FOR FUTURE REFERENCES
                                    // dTAuto,
                                    // dTStartingNum,
                                    // dTWidthOfNumericPart,
                                    // dTPrefillWithZero,
                                    // dTEffectiveFrom,
                                    // dTRestartingNum,
                                    // dTRepeatingPeriod,
                                    // dTPrefix,
                                    // dTPrefixEffectiveFrom,
                                    // dTSuffix,
                                    // dTSuffixEffectiveFrom,
                                    // gTAuto,
                                    // gTStartingNum,
                                    // gTWidthOfNumericPart,
                                    // gTPrefillWithZero,
                                    // gTEffectiveFrom,
                                    // gTRestartingNum,
                                    // gTRepeatingPeriod,
                                    // gTPrefix,
                                    // gTPrefixEffectiveFrom,
                                    // gTSuffix,
                                    // gTSuffixEffectiveFrom,
                                    // DON'T DELETE BELOW CODES AS IT IS FOR FUTURE REFERENCES

                                    sInAuto,
                                    sInStartingNum,
                                    sInWidthOfNumericPart,
                                    sInPrefillWithZero,
                                    sInEffectiveFrom,
                                    sInRestartingNum,
                                    sInRepeatingPeriod,
                                    sInPrefixEffectiveFrom,
                                    sInPrefix,
                                    sInSuffixEffectiveFrom,
                                    sInSuffix,
                                    bankName,

                                    pInAuto,
                                    pInStartingNum,
                                    pInWidthOfNumericPart,
                                    pInPrefillWithZero,
                                    pInEffectiveFrom,
                                    pInRestartingNum,
                                    pInRepeatingPeriod,
                                    pInPrefixEffectiveFrom,
                                    pInPrefix,
                                    pInSuffixEffectiveFrom,
                                    pInSuffix,
                                    

                                },
                                { setStatus, setSubmitting }
                            ) => {
                                setStatus();
                                const voucherSettings = {
                                    bankDetails: { bankId: bankName.value },

                                    // DON'T DELETE BELOW CODES AS IT IS FOR FUTURE REFERENCES
                                    // dualTransactionVoucher: {
                                    //     Automatic: dTAuto,
                                    //     StartingNumber: dTStartingNum,
                                    //     WidthOfNumericPart: dTWidthOfNumericPart,
                                    //     PrefillWithZero: dTPrefillWithZero,
                                    //     EffectiveFrom: dTEffectiveFrom,
                                    //     RestartingNum: dTRestartingNum,
                                    //     RepeatingPeriod: !!dTRepeatingPeriod ? dTRepeatingPeriod.value : 1,
                                    //     Prefix: dTPrefix,
                                    //     PrefixEffectiveFrom: dTPrefixEffectiveFrom,
                                    //     Suffix: dTSuffix,
                                    //     SuffixEffectiveFrom: dTSuffixEffectiveFrom
                                    // },
                                    // generalTaxInvoice: {
                                    //     Automatic: gTAuto,
                                    //     StartingNumber: gTStartingNum,
                                    //     WidthOfNumericPart: gTWidthOfNumericPart,
                                    //     PrefillWithZero: gTPrefillWithZero,
                                    //     EffectiveFrom: gTEffectiveFrom,
                                    //     RestartingNum: gTRestartingNum,
                                    //     RepeatingPeriod: !!gTRepeatingPeriod ? gTRepeatingPeriod.value : 1,
                                    //     Prefix: gTPrefix,
                                    //     PrefixEffectiveFrom: gTPrefixEffectiveFrom,
                                    //     Suffix: gTSuffix,
                                    //     SuffixEffectiveFrom: gTSuffixEffectiveFrom
                                    // },
                                    // DON'T DELETE BELOW CODES AS IT IS FOR FUTURE REFERENCES

                                    journalVoucher: {
                                        Automatic: jVAuto,
                                        StartingNumber: jVStartingNum,
                                        WidthOfNumericPart: jVWidthOfNumericPart,
                                        PrefillWithZero: jVPrefillWithZero,
                                        EffectiveFrom: jVEffectiveFrom,
                                        RestartingNum: jVRestartingNum,
                                        RepeatingPeriod: !!jVRepeatingPeriod ? jVRepeatingPeriod.value : 1,
                                        Prefix: jVPrefix,
                                        PrefixEffectiveFrom: jVPrefixEffectiveFrom,
                                        Suffix: jVSuffix,
                                        SuffixEffectiveFrom: jVSuffixEffectiveFrom
                                    },
                                    paymentVoucher: {
                                        Automatic: pVAuto,
                                        StartingNumber: pVStartingNum,
                                        WidthOfNumericPart: pVWidthOfNumericPart,
                                        PrefillWithZero: pVPrefillWithZero,
                                        EffectiveFrom: pVEffectiveFrom,
                                        RestartingNum: pVRestartingNum,
                                        RepeatingPeriod: !!pVRepeatingPeriod ? pVRepeatingPeriod.value : 1,
                                        Prefix: pVPrefix,
                                        PrefixEffectiveFrom: pVPrefixEffectiveFrom,
                                        Suffix: pVSuffix,
                                        SuffixEffectiveFrom: pVSuffixEffectiveFrom
                                    },
                                    receiptVoucher: {
                                        Automatic: rVAuto,
                                        StartingNumber: rVStartingNum,
                                        WidthOfNumericPart: rVWidthOfNumericPart,
                                        PrefillWithZero: rVPrefillWithZero,
                                        EffectiveFrom: rVEffectiveFrom,
                                        RestartingNum: rVRestartingNum,
                                        RepeatingPeriod: !!rVRepeatingPeriod ? rVRepeatingPeriod.value : 1,
                                        Prefix: rVPrefix,
                                        PrefixEffectiveFrom: rVPrefixEffectiveFrom,
                                        Suffix: rVSuffix,
                                        SuffixEffectiveFrom: rVSuffixEffectiveFrom
                                    },
                                    dualTransactionPayment: {
                                        Automatic: dtPaymentAuto,
                                        StartingNumber: dtPaymentStartingNum,
                                        WidthOfNumericPart: dtPaymentWidthOfNumericPart,
                                        PrefillWithZero: dtPaymentPrefillWithZero,
                                        EffectiveFrom: dtPaymentEffectiveFrom,
                                        RestartingNum: dtPaymentRestartingNum,
                                        RepeatingPeriod: !!dtPaymentRepeatingPeriod ? dtPaymentRepeatingPeriod.value : 1,
                                        Prefix: dtPaymentPrefix,
                                        PrefixEffectiveFrom: dtPaymentPrefixEffectiveFrom,
                                        Suffix: dtPaymentSuffix,
                                        SuffixEffectiveFrom: dtPaymentSuffixEffectiveFrom
                                    },
                                    dualTransactionReceipt: {
                                        Automatic: dtReceiptAuto,
                                        StartingNumber: dtReceiptStartingNum,
                                        WidthOfNumericPart: dtReceiptWidthOfNumericPart,
                                        PrefillWithZero: dtReceiptPrefillWithZero,
                                        EffectiveFrom: dtReceiptEffectiveFrom,
                                        RestartingNum: dtReceiptRestartingNum,
                                        RepeatingPeriod: !!dtReceiptRepeatingPeriod ? dtReceiptRepeatingPeriod.value : 1,
                                        Prefix: dtReceiptPrefix,
                                        PrefixEffectiveFrom: dtReceiptPrefixEffectiveFrom,
                                        Suffix: dtReceiptSuffix,
                                        SuffixEffectiveFrom: dtReceiptSuffixEffectiveFrom
                                    },
                                    salesInvoice: {
                                        Automatic: sInAuto,
                                        StartingNumber: sInStartingNum,
                                        WidthOfNumericPart: sInWidthOfNumericPart,
                                        PrefillWithZero: sInPrefillWithZero,
                                        EffectiveFrom: sInEffectiveFrom,
                                        RestartingNum: sInRestartingNum,
                                        RepeatingPeriod: !!sInRepeatingPeriod ? sInRepeatingPeriod.value : 1,
                                        Prefix: sInPrefix,
                                        PrefixEffectiveFrom: sInPrefixEffectiveFrom,
                                        Suffix: sInSuffix,
                                        SuffixEffectiveFrom: sInSuffixEffectiveFrom
                                    },
                                    proformaInvoice: {
                                        Automatic: pInAuto,
                                        StartingNumber: pInStartingNum,
                                        WidthOfNumericPart: pInWidthOfNumericPart,
                                        PrefillWithZero: pInPrefillWithZero,
                                        EffectiveFrom: pInEffectiveFrom,
                                        RestartingNum: pInRestartingNum,
                                        RepeatingPeriod: !!pInRepeatingPeriod ? pInRepeatingPeriod.value : 1,
                                        Prefix: pInPrefix,
                                        PrefixEffectiveFrom: pInPrefixEffectiveFrom,
                                        Suffix: pInSuffix,
                                        SuffixEffectiveFrom: pInSuffixEffectiveFrom
                                    }
                                };
                                VoucherSettingService.updateVoucherSetting(voucherSettings).then(
                                    (response) => {
                                        const { from } = this.props.location.state || { from: { pathname: '/' } };
                                        this.props.history.push(from);
                                    },
                                    (error) => {
                                        setSubmitting(false);
                                        setStatus(error);
                                    }
                                );
                            }}
                            render={({ values, errors, status, touched, isSubmitting }) => (
                                <Form>
                                    <Card>
                                        <Card.Header>
                                            <Card.Title as="h5">Bank Details</Card.Title>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="form-group col-md-12">
                                                <label htmlFor="bankName">Bank Name </label>
                                                <FcPlus
                                                    style={{ marginLeft: '10px' }}
                                                    size={20}
                                                    onClick={() => this.onClickChange('billedToLedgerId')}
                                                />
                                                <Select
                                                    name="bankName"
                                                    value={this.state.bankName}
                                                    onChange={this.onDropDownChange}
                                                    options={this.state.ledgers}
                                                    classNamePrefix="select"
                                                    className={'form-control' + (errors.bankName && touched.bankName ? ' is-invalid' : '')}
                                                />
                                                <ErrorMessage name="bankName" component="div" className="invalid-feedback" />
                                            </div>
                                        </Card.Body>
                                    </Card>

                                    <Card>
                                        <Card.Header>
                                            <Card.Title as="h5">Payment Voucher</Card.Title>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="form-row">
                                                <div className="form-group col-md-12">
                                                    <CustomSwitch
                                                        checked={this.state.pVAuto}
                                                        name="pVAuto"
                                                        id="pVAuto"
                                                        text="Automatic"
                                                        onChange={this.onCheckBoxChange}
                                                    />
                                                </div>
                                                {this.state.pVAuto === true && (
                                                    <>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="pVStartingNum">Starting Number</label>
                                                            <Field
                                                                name="pVStartingNum"
                                                                type="number"
                                                                min="1"
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.pVStartingNum && touched.pVStartingNum ? ' is-invalid' : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="pVStartingNum"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="pVWidthOfNumericPart">Width Of Numeric Part</label>
                                                            <Field
                                                                name="pVWidthOfNumericPart"
                                                                type="number"
                                                                min="1"
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.pVWidthOfNumericPart && touched.pVWidthOfNumericPart
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="pVWidthOfNumericPart"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <CustomSwitch
                                                                checked={this.state.pVPrefillWithZero}
                                                                name="pVPrefillWithZero"
                                                                id="pVPrefillWithZero"
                                                                text="Prefill With Zero"
                                                                onChange={this.onCheckBoxChange}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="pVEffectiveFrom">Effective From</label>
                                                            <input
                                                                name="pVEffectiveFrom"
                                                                type="date"
                                                                value={this.state.pVEffectiveFrom}
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.pVEffectiveFrom && touched.pVEffectiveFrom ? ' is-invalid' : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="pVEffectiveFrom"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="pVRestartingNum">Restarting Number</label>
                                                            <Field
                                                                name="pVRestartingNum"
                                                                type="number"
                                                                min="1"
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.pVRestartingNum && touched.pVRestartingNum ? ' is-invalid' : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="pVRestartingNum"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="pVRepeatingPeriod">Repeating Period</label>
                                                            <Select
                                                                name="pVRepeatingPeriod"
                                                                onChange={this.onDropDownChange}
                                                                value={this.state.pVRepeatingPeriod}
                                                                options={this.state.repeatingPeriodList}
                                                                classNamePrefix="select"
                                                                className={
                                                                    'form-control' +
                                                                    (errors.pVRepeatingPeriod && touched.pVRepeatingPeriod
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="pVRepeatingPeriod"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="prefix">Prefix</label>
                                                            <Field
                                                                name="pVPrefix"
                                                                type="text"
                                                                onChange={this.onTextChange}
                                                                className={'form-control'}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="pVPrefixEffectiveFrom">Prefix - Effective From</label>
                                                            <input
                                                                name="pVPrefixEffectiveFrom"
                                                                type="date"
                                                                value={this.state.pVPrefixEffectiveFrom}
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.pVPrefixEffectiveFrom && touched.pVPrefixEffectiveFrom
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="pVPrefixEffectiveFrom"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="pVSuffix">Suffix</label>
                                                            <Field
                                                                name="pVSuffix"
                                                                type="text"
                                                                onChange={this.onTextChange}
                                                                className={'form-control'}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="pVSuffixEffectiveFrom">Suffix - Effective From</label>
                                                            <input
                                                                name="pVSuffixEffectiveFrom"
                                                                type="date"
                                                                value={this.state.pVSuffixEffectiveFrom}
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.pVSuffixEffectiveFrom && touched.pVSuffixEffectiveFrom
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="pVSuffixEffectiveFrom"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </Card.Body>
                                    </Card>

                                    <Card>
                                        <Card.Header>
                                            <Card.Title as="h5">Receipt Voucher</Card.Title>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="form-row">
                                                <div className="form-group col-md-12">
                                                    <CustomSwitch
                                                        checked={this.state.rVAuto}
                                                        name="rVAuto"
                                                        id="rVAuto"
                                                        text="Automatic"
                                                        onChange={this.onCheckBoxChange}
                                                    />
                                                </div>
                                                {this.state.rVAuto === true && (
                                                    <>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="rVStartingNum">Starting Number</label>
                                                            <Field
                                                                name="rVStartingNum"
                                                                type="number"
                                                                min="1"
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.rVStartingNum && touched.rVStartingNum ? ' is-invalid' : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="rVStartingNum"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="rVWidthOfNumericPart">Width Of Numeric Part</label>
                                                            <Field
                                                                name="rVWidthOfNumericPart"
                                                                type="number"
                                                                min="1"
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.rVWidthOfNumericPart && touched.rVWidthOfNumericPart
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="rVWidthOfNumericPart"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <CustomSwitch
                                                                checked={this.state.rVPrefillWithZero}
                                                                name="rVPrefillWithZero"
                                                                id="rVPrefillWithZero"
                                                                text="Prefill With Zero"
                                                                onChange={this.onCheckBoxChange}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="rVEffectiveFrom">Effective From</label>
                                                            <input
                                                                name="rVEffectiveFrom"
                                                                type="date"
                                                                value={this.state.rVEffectiveFrom}
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.rVEffectiveFrom && touched.rVEffectiveFrom ? ' is-invalid' : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="rVEffectiveFrom"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="rVRestartingNum">Restarting Number</label>
                                                            <Field
                                                                name="rVRestartingNum"
                                                                type="number"
                                                                min="1"
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.rVRestartingNum && touched.rVRestartingNum ? ' is-invalid' : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="rVRestartingNum"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="rVRepeatingPeriod">Repeating Period</label>
                                                            <Select
                                                                name="rVRepeatingPeriod"
                                                                onChange={this.onDropDownChange}
                                                                value={this.state.rVRepeatingPeriod}
                                                                options={this.state.repeatingPeriodList}
                                                                classNamePrefix="select"
                                                                className={
                                                                    'form-control' +
                                                                    (errors.rVRepeatingPeriod && touched.rVRepeatingPeriod
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="rVRepeatingPeriod"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="prefix">Prefix</label>
                                                            <Field
                                                                name="rVPrefix"
                                                                type="text"
                                                                onChange={this.onTextChange}
                                                                className={'form-control'}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="rVPrefixEffectiveFrom">Prefix - Effective From</label>
                                                            <input
                                                                name="rVPrefixEffectiveFrom"
                                                                type="date"
                                                                value={this.state.rVPrefixEffectiveFrom}
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.rVPrefixEffectiveFrom && touched.rVPrefixEffectiveFrom
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="rVPrefixEffectiveFrom"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="rVSuffix">Suffix</label>
                                                            <Field
                                                                name="rVSuffix"
                                                                type="text"
                                                                onChange={this.onTextChange}
                                                                className={'form-control'}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="rVSuffixEffectiveFrom">Suffix - Effective From</label>
                                                            <input
                                                                name="rVSuffixEffectiveFrom"
                                                                type="date"
                                                                value={this.state.rVSuffixEffectiveFrom}
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.rVSuffixEffectiveFrom && touched.rVSuffixEffectiveFrom
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="rVSuffixEffectiveFrom"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </Card.Body>
                                    </Card>

                                    <Card>
                                        <Card.Header>
                                            <Card.Title as="h5">Dual Transaction Payment Voucher</Card.Title>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="form-row">
                                                <div className="form-group col-md-12">
                                                    <CustomSwitch
                                                        checked={this.state.dtPaymentAuto}
                                                        name="dtPaymentAuto"
                                                        id="dtPaymentAuto"
                                                        text="Automatic"
                                                        onChange={this.onCheckBoxChange}
                                                    />
                                                </div>
                                                {this.state.dtPaymentAuto === true && (
                                                    <>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="dtPaymentStartingNum">Starting Number</label>
                                                            <Field
                                                                name="dtPaymentStartingNum"
                                                                type="number"
                                                                min="1"
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.dtPaymentStartingNum && touched.dtPaymentStartingNum
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="dtPaymentStartingNum"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="dtPaymentWidthOfNumericPart">Width Of Numeric Part</label>
                                                            <Field
                                                                name="dtPaymentWidthOfNumericPart"
                                                                type="number"
                                                                min="1"
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.dtPaymentWidthOfNumericPart &&
                                                                    touched.dtPaymentWidthOfNumericPart
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="dtPaymentWidthOfNumericPart"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <CustomSwitch
                                                                checked={this.state.dtPaymentPrefillWithZero}
                                                                name="dtPaymentPrefillWithZero"
                                                                id="dtPaymentPrefillWithZero"
                                                                text="Prefill With Zero"
                                                                onChange={this.onCheckBoxChange}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="dtPaymentEffectiveFrom">Effective From</label>
                                                            <input
                                                                name="dtPaymentEffectiveFrom"
                                                                type="date"
                                                                value={this.state.dtPaymentEffectiveFrom}
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.dtPaymentEffectiveFrom && touched.dtPaymentEffectiveFrom
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="dtPaymentEffectiveFrom"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="dtPaymentRestartingNum">Restarting Number</label>
                                                            <Field
                                                                name="dtPaymentRestartingNum"
                                                                type="number"
                                                                min="1"
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.dtPaymentRestartingNum && touched.dtPaymentRestartingNum
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="dtPaymentRestartingNum"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="dtPaymentRepeatingPeriod">Repeating Period</label>
                                                            <Select
                                                                name="dtPaymentRepeatingPeriod"
                                                                onChange={this.onDropDownChange}
                                                                value={this.state.dtPaymentRepeatingPeriod}
                                                                options={this.state.repeatingPeriodList}
                                                                classNamePrefix="select"
                                                                className={
                                                                    'form-control' +
                                                                    (errors.dtPaymentRepeatingPeriod && touched.dtPaymentRepeatingPeriod
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="dtPaymentRepeatingPeriod"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="prefix">Prefix</label>
                                                            <Field
                                                                name="dtPaymentPrefix"
                                                                type="text"
                                                                onChange={this.onTextChange}
                                                                className={'form-control'}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="dtPaymentPrefixEffectiveFrom">Prefix - Effective From</label>
                                                            <input
                                                                name="dtPaymentPrefixEffectiveFrom"
                                                                type="date"
                                                                value={this.state.dtPaymentPrefixEffectiveFrom}
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.dtPaymentPrefixEffectiveFrom &&
                                                                    touched.dtPaymentPrefixEffectiveFrom
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="dtPaymentPrefixEffectiveFrom"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="dtPaymentSuffix">Suffix</label>
                                                            <Field
                                                                name="dtPaymentSuffix"
                                                                type="text"
                                                                onChange={this.onTextChange}
                                                                className={'form-control'}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="dtPaymentSuffixEffectiveFrom">Suffix - Effective From</label>
                                                            <input
                                                                name="dtPaymentSuffixEffectiveFrom"
                                                                type="date"
                                                                value={this.state.dtPaymentSuffixEffectiveFrom}
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.dtPaymentSuffixEffectiveFrom &&
                                                                    touched.dtPaymentSuffixEffectiveFrom
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="dtPaymentSuffixEffectiveFrom"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </Card.Body>
                                    </Card>

                                    <Card>
                                        <Card.Header>
                                            <Card.Title as="h5">Dual Transaction Receipt Voucher</Card.Title>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="form-row">
                                                <div className="form-group col-md-12">
                                                    <CustomSwitch
                                                        checked={this.state.dtReceiptAuto}
                                                        name="dtReceiptAuto"
                                                        id="dtReceiptAuto"
                                                        text="Automatic"
                                                        onChange={this.onCheckBoxChange}
                                                    />
                                                </div>
                                                {this.state.dtReceiptAuto === true && (
                                                    <>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="dtReceiptStartingNum">Starting Number</label>
                                                            <Field
                                                                name="dtReceiptStartingNum"
                                                                type="number"
                                                                min="1"
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.dtReceiptStartingNum && touched.dtReceiptStartingNum
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="dtReceiptStartingNum"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="dtReceiptWidthOfNumericPart">Width Of Numeric Part</label>
                                                            <Field
                                                                name="dtReceiptWidthOfNumericPart"
                                                                type="number"
                                                                min="1"
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.dtReceiptWidthOfNumericPart &&
                                                                    touched.dtReceiptWidthOfNumericPart
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="dtReceiptWidthOfNumericPart"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <CustomSwitch
                                                                checked={this.state.dtReceiptPrefillWithZero}
                                                                name="dtReceiptPrefillWithZero"
                                                                id="dtReceiptPrefillWithZero"
                                                                text="Prefill With Zero"
                                                                onChange={this.onCheckBoxChange}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="dtReceiptEffectiveFrom">Effective From</label>
                                                            <input
                                                                name="dtReceiptEffectiveFrom"
                                                                type="date"
                                                                value={this.state.dtReceiptEffectiveFrom}
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.dtReceiptEffectiveFrom && touched.dtReceiptEffectiveFrom
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="dtReceiptEffectiveFrom"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="dtReceiptRestartingNum">Restarting Number</label>
                                                            <Field
                                                                name="dtReceiptRestartingNum"
                                                                type="number"
                                                                min="1"
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.dtReceiptRestartingNum && touched.dtReceiptRestartingNum
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="dtReceiptRestartingNum"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="dtReceiptRepeatingPeriod">Repeating Period</label>
                                                            <Select
                                                                name="dtReceiptRepeatingPeriod"
                                                                onChange={this.onDropDownChange}
                                                                value={this.state.dtReceiptRepeatingPeriod}
                                                                options={this.state.repeatingPeriodList}
                                                                classNamePrefix="select"
                                                                className={
                                                                    'form-control' +
                                                                    (errors.dtReceiptRepeatingPeriod && touched.dtReceiptRepeatingPeriod
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="dtReceiptRepeatingPeriod"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="prefix">Prefix</label>
                                                            <Field
                                                                name="dtReceiptPrefix"
                                                                type="text"
                                                                onChange={this.onTextChange}
                                                                className={'form-control'}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="dtReceiptPrefixEffectiveFrom">Prefix - Effective From</label>
                                                            <input
                                                                name="dtReceiptPrefixEffectiveFrom"
                                                                type="date"
                                                                value={this.state.dtReceiptPrefixEffectiveFrom}
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.dtReceiptPrefixEffectiveFrom &&
                                                                    touched.dtReceiptPrefixEffectiveFrom
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="dtReceiptPrefixEffectiveFrom"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="dtReceiptSuffix">Suffix</label>
                                                            <Field
                                                                name="dtReceiptSuffix"
                                                                type="text"
                                                                onChange={this.onTextChange}
                                                                className={'form-control'}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="dtReceiptSuffixEffectiveFrom">Suffix - Effective From</label>
                                                            <input
                                                                name="dtReceiptSuffixEffectiveFrom"
                                                                type="date"
                                                                value={this.state.dtReceiptSuffixEffectiveFrom}
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.dtReceiptSuffixEffectiveFrom &&
                                                                    touched.dtReceiptSuffixEffectiveFrom
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="dtReceiptSuffixEffectiveFrom"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </Card.Body>
                                    </Card>

                                    <Card>
                                        <Card.Header>
                                            <Card.Title as="h5">Journal Voucher</Card.Title>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="form-row">
                                                <div className="form-group col-md-12">
                                                    <CustomSwitch
                                                        checked={this.state.jVAuto}
                                                        name="jVAuto"
                                                        id="jVAuto"
                                                        text="Automatic"
                                                        onChange={this.onCheckBoxChange}
                                                    />
                                                </div>
                                                {this.state.jVAuto === true && (
                                                    <>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="jVStartingNum">Starting Number</label>
                                                            <Field
                                                                name="jVStartingNum"
                                                                type="number"
                                                                min="1"
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.jVStartingNum && touched.jVStartingNum ? ' is-invalid' : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="jVStartingNum"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="jVWidthOfNumericPart">Width Of Numeric Part</label>
                                                            <Field
                                                                name="jVWidthOfNumericPart"
                                                                type="number"
                                                                min="1"
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.jVWidthOfNumericPart && touched.jVWidthOfNumericPart
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="jVWidthOfNumericPart"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <CustomSwitch
                                                                checked={this.state.jVPrefillWithZero}
                                                                name="jVPrefillWithZero"
                                                                id="jVPrefillWithZero"
                                                                text="Prefill With Zero"
                                                                onChange={this.onCheckBoxChange}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="jVEffectiveFrom">Effective From</label>
                                                            <input
                                                                name="jVEffectiveFrom"
                                                                type="date"
                                                                value={this.state.jVEffectiveFrom}
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.jVEffectiveFrom && touched.jVEffectiveFrom ? ' is-invalid' : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="jVEffectiveFrom"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="jVRestartingNum">Restarting Number</label>
                                                            <Field
                                                                name="jVRestartingNum"
                                                                type="number"
                                                                min="1"
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.jVRestartingNum && touched.jVRestartingNum ? ' is-invalid' : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="jVRestartingNum"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="jVRepeatingPeriod">Repeating Period</label>
                                                            <Select
                                                                name="jVRepeatingPeriod"
                                                                onChange={this.onDropDownChange}
                                                                value={this.state.jVRepeatingPeriod}
                                                                options={this.state.repeatingPeriodList}
                                                                classNamePrefix="select"
                                                                className={
                                                                    'form-control' +
                                                                    (errors.jVRepeatingPeriod && touched.jVRepeatingPeriod
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="jVRepeatingPeriod"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="prefix">Prefix</label>
                                                            <Field
                                                                name="jVPrefix"
                                                                type="text"
                                                                onChange={this.onTextChange}
                                                                className={'form-control'}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="jVPrefixEffectiveFrom">Prefix - Effective From</label>
                                                            <input
                                                                name="jVPrefixEffectiveFrom"
                                                                type="date"
                                                                value={this.state.jVPrefixEffectiveFrom}
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.jVPrefixEffectiveFrom && touched.jVPrefixEffectiveFrom
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="jVPrefixEffectiveFrom"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="jVSuffix">Suffix</label>
                                                            <Field
                                                                name="jVSuffix"
                                                                type="text"
                                                                onChange={this.onTextChange}
                                                                className={'form-control'}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="jVSuffixEffectiveFrom">Suffix - Effective From</label>
                                                            <input
                                                                name="jVSuffixEffectiveFrom"
                                                                type="date"
                                                                value={this.state.jVSuffixEffectiveFrom}
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.jVSuffixEffectiveFrom && touched.jVSuffixEffectiveFrom
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="jVSuffixEffectiveFrom"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </Card.Body>
                                    </Card>

                                    {/* <Card>
                                        <Card.Header>
                                            <Card.Title as="h5">Dual Transaction Voucher</Card.Title>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="form-row">
                                                <div className="form-group col-md-12">
                                                    <CustomSwitch
                                                        checked={this.state.dTAuto}
                                                        name="dTAuto"
                                                        id="dTAuto"
                                                        text="Automatic"
                                                        onChange={this.onCheckBoxChange}
                                                    />
                                                </div>
                                                {this.state.dTAuto === true && (
                                                    <>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="dTStartingNum">Starting Number</label>
                                                            <Field
                                                                name="dTStartingNum"
                                                                type="number"
                                                                min="1"
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.dTStartingNum && touched.dTStartingNum ? ' is-invalid' : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="dTStartingNum"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="dTWidthOfNumericPart">Width Of Numeric Part</label>
                                                            <Field
                                                                name="dTWidthOfNumericPart"
                                                                type="number"
                                                                min="1"
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.dTWidthOfNumericPart && touched.dTWidthOfNumericPart
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="dTWidthOfNumericPart"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <CustomSwitch
                                                                checked={this.state.dTPrefillWithZero}
                                                                name="dTPrefillWithZero"
                                                                id="dTPrefillWithZero"
                                                                text="Prefill With Zero"
                                                                onChange={this.onCheckBoxChange}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="dTEffectiveFrom">Effective From</label>
                                                            <input
                                                                name="dTEffectiveFrom"
                                                                type="date"
                                                                value={this.state.dTEffectiveFrom}
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.dTEffectiveFrom && touched.dTEffectiveFrom ? ' is-invalid' : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="dTEffectiveFrom"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="dTRestartingNum">Restarting Number</label>
                                                            <Field
                                                                name="dTRestartingNum"
                                                                type="number"
                                                                min="1"
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.dTRestartingNum && touched.dTRestartingNum ? ' is-invalid' : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="dTRestartingNum"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="dTRepeatingPeriod">Repeating Period</label>
                                                            <Select
                                                                name="dTRepeatingPeriod"
                                                                onChange={this.onDropDownChange}
                                                                value={this.state.dTRepeatingPeriod}
                                                                options={this.state.repeatingPeriodList}
                                                                classNamePrefix="select"
                                                                className={
                                                                    'form-control' +
                                                                    (errors.dTRepeatingPeriod && touched.dTRepeatingPeriod
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="dTRepeatingPeriod"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="prefix">Prefix</label>
                                                            <Field
                                                                name="dTPrefix"
                                                                type="text"
                                                                onChange={this.onTextChange}
                                                                className={'form-control'}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="dTPrefixEffectiveFrom">Prefix - Effective From</label>
                                                            <input
                                                                name="dTPrefixEffectiveFrom"
                                                                type="date"
                                                                value={this.state.dTPrefixEffectiveFrom}
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.dTPrefixEffectiveFrom && touched.dTPrefixEffectiveFrom
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="dTPrefixEffectiveFrom"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="dTSuffix">Suffix</label>
                                                            <Field
                                                                name="dTSuffix"
                                                                type="text"
                                                                onChange={this.onTextChange}
                                                                className={'form-control'}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="dTSuffixEffectiveFrom">Suffix - Effective From</label>
                                                            <input
                                                                name="dTSuffixEffectiveFrom"
                                                                type="date"
                                                                value={this.state.dTSuffixEffectiveFrom}
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.dTSuffixEffectiveFrom && touched.dTSuffixEffectiveFrom
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="dTSuffixEffectiveFrom"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                    <Card>
                                        <Card.Header>
                                            <Card.Title as="h5">General Tax Invoice</Card.Title>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="form-row">
                                                <div className="form-group col-md-12">
                                                    <CustomSwitch
                                                        checked={this.state.gTAuto}
                                                        name="gTAuto"
                                                        id="gTAuto"
                                                        text="Automatic"
                                                        onChange={this.onCheckBoxChange}
                                                    />
                                                </div>
                                                {this.state.gTAuto === true && (
                                                    <>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="gTStartingNum">Starting Number</label>
                                                            <Field
                                                                name="gTStartingNum"
                                                                type="number"
                                                                min="1"
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.gTStartingNum && touched.gTStartingNum ? ' is-invalid' : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="gTStartingNum"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="gTWidthOfNumericPart">Width Of Numeric Part</label>
                                                            <Field
                                                                name="gTWidthOfNumericPart"
                                                                type="number"
                                                                min="1"
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.gTWidthOfNumericPart && touched.gTWidthOfNumericPart
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="gTWidthOfNumericPart"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <CustomSwitch
                                                                checked={this.state.gTPrefillWithZero}
                                                                name="gTPrefillWithZero"
                                                                id="gTPrefillWithZero"
                                                                text="Prefill With Zero"
                                                                onChange={this.onCheckBoxChange}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="gTEffectiveFrom">Effective From</label>
                                                            <input
                                                                name="gTEffectiveFrom"
                                                                type="date"
                                                                value={this.state.gTEffectiveFrom}
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.gTEffectiveFrom && touched.gTEffectiveFrom ? ' is-invalid' : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="gTEffectiveFrom"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="gTRestartingNum">Restarting Number</label>
                                                            <Field
                                                                name="gTRestartingNum"
                                                                type="number"
                                                                min="1"
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.gTRestartingNum && touched.gTRestartingNum ? ' is-invalid' : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="gTRestartingNum"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="gTRepeatingPeriod">Repeating Period</label>
                                                            <Select
                                                                name="gTRepeatingPeriod"
                                                                onChange={this.onDropDownChange}
                                                                value={this.state.gTRepeatingPeriod}
                                                                options={this.state.repeatingPeriodList}
                                                                classNamePrefix="select"
                                                                className={
                                                                    'form-control' +
                                                                    (errors.gTRepeatingPeriod && touched.gTRepeatingPeriod
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="gTRepeatingPeriod"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="prefix">Prefix</label>
                                                            <Field
                                                                name="gTPrefix"
                                                                type="text"
                                                                onChange={this.onTextChange}
                                                                className={'form-control'}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="gTPrefixEffectiveFrom">Prefix - Effective From</label>
                                                            <input
                                                                name="gTPrefixEffectiveFrom"
                                                                type="date"
                                                                value={this.state.gTPrefixEffectiveFrom}
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.gTPrefixEffectiveFrom && touched.gTPrefixEffectiveFrom
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="gTPrefixEffectiveFrom"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="gTSuffix">Suffix</label>
                                                            <Field
                                                                name="gTSuffix"
                                                                type="text"
                                                                onChange={this.onTextChange}
                                                                className={'form-control'}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="gTSuffixEffectiveFrom">Suffix - Effective From</label>
                                                            <input
                                                                name="gTSuffixEffectiveFrom"
                                                                type="date"
                                                                value={this.state.gTSuffixEffectiveFrom}
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.gTSuffixEffectiveFrom && touched.gTSuffixEffectiveFrom
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="gTSuffixEffectiveFrom"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </Card.Body>
                                    </Card> */}

                                    <Card>
                                        <Card.Header>
                                            <Card.Title as="h5">Sales Invoice</Card.Title>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="form-row">
                                                <div className="form-group col-md-12">
                                                    <CustomSwitch
                                                        checked={this.state.sInAuto}
                                                        name="sInAuto"
                                                        id="sInAuto"
                                                        text="Automatic"
                                                        onChange={this.onCheckBoxChange}
                                                    />
                                                </div>
                                                {this.state.sInAuto === true && (
                                                    <>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="sInStartingNum">Starting Number</label>
                                                            <Field
                                                                name="sInStartingNum"
                                                                type="number"
                                                                min="1"
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.sInStartingNum && touched.sInStartingNum ? ' is-invalid' : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="sInStartingNum"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="sInWidthOfNumericPart">Width Of Numeric Part</label>
                                                            <Field
                                                                name="sInWidthOfNumericPart"
                                                                type="number"
                                                                min="1"
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.sInWidthOfNumericPart && touched.sInWidthOfNumericPart
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="sInWidthOfNumericPart"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <CustomSwitch
                                                                checked={this.state.sInPrefillWithZero}
                                                                name="sInPrefillWithZero"
                                                                id="sInPrefillWithZero"
                                                                text="Prefill With Zero"
                                                                onChange={this.onCheckBoxChange}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="sInEffectiveFrom">Effective From</label>
                                                            <input
                                                                name="sInEffectiveFrom"
                                                                type="date"
                                                                value={this.state.sInEffectiveFrom}
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.sInEffectiveFrom && touched.sInEffectiveFrom
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="sInEffectiveFrom"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="sInRestartingNum">Restarting Number</label>
                                                            <Field
                                                                name="sInRestartingNum"
                                                                type="number"
                                                                min="1"
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.sInRestartingNum && touched.sInRestartingNum
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="sInRestartingNum"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="sInRepeatingPeriod">Repeating Period</label>
                                                            <Select
                                                                name="sInRepeatingPeriod"
                                                                onChange={this.onDropDownChange}
                                                                value={this.state.sInRepeatingPeriod}
                                                                options={this.state.repeatingPeriodList}
                                                                classNamePrefix="select"
                                                                className={
                                                                    'form-control' +
                                                                    (errors.sInRepeatingPeriod && touched.sInRepeatingPeriod
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="sInRepeatingPeriod"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="prefix">Prefix</label>
                                                            <Field
                                                                name="sInPrefix"
                                                                type="text"
                                                                onChange={this.onTextChange}
                                                                className={'form-control'}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="sInPrefixEffectiveFrom">Prefix - Effective From</label>
                                                            <input
                                                                name="sInPrefixEffectiveFrom"
                                                                type="date"
                                                                value={this.state.sInPrefixEffectiveFrom}
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.sInPrefixEffectiveFrom && touched.sInPrefixEffectiveFrom
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="sInPrefixEffectiveFrom"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="sInSuffix">Suffix</label>
                                                            <Field
                                                                name="sInSuffix"
                                                                type="text"
                                                                onChange={this.onTextChange}
                                                                className={'form-control'}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="sInSuffixEffectiveFrom">Suffix - Effective From</label>
                                                            <input
                                                                name="sInSuffixEffectiveFrom"
                                                                type="date"
                                                                value={this.state.sInSuffixEffectiveFrom}
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.sInSuffixEffectiveFrom && touched.sInSuffixEffectiveFrom
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="sInSuffixEffectiveFrom"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </Card.Body>
                                    </Card>

                                    <Card>
                                        <Card.Header>
                                            <Card.Title as="h5">Proforma Invoice</Card.Title>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="form-row">
                                                <div className="form-group col-md-12">
                                                    <CustomSwitch
                                                        checked={this.state.pInAuto}
                                                        name="pInAuto"
                                                        id="pInAuto"
                                                        text="Automatic"
                                                        onChange={this.onCheckBoxChange}
                                                    />
                                                </div>
                                                {this.state.pInAuto === true && (
                                                    <>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="sInStartingNum">Starting Number</label>
                                                            <Field
                                                                name="sInStartingNum"
                                                                type="number"
                                                                min="1"
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.pInStartingNum && touched.pInStartingNum ? ' is-invalid' : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="pInStartingNum"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="pInWidthOfNumericPart">Width Of Numeric Part</label>
                                                            <Field
                                                                name="pInWidthOfNumericPart"
                                                                type="number"
                                                                min="1"
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.pInWidthOfNumericPart && touched.pInWidthOfNumericPart
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="pInWidthOfNumericPart"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <CustomSwitch
                                                                checked={this.state.pInPrefillWithZero}
                                                                name="pInPrefillWithZero"
                                                                id="pInPrefillWithZero"
                                                                text="Prefill With Zero"
                                                                onChange={this.onCheckBoxChange}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="pInEffectiveFrom">Effective From</label>
                                                            <input
                                                                name="pInEffectiveFrom"
                                                                type="date"
                                                                value={this.state.pInEffectiveFrom}
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.pInEffectiveFrom && touched.pInEffectiveFrom
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="pInEffectiveFrom"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="pInRestartingNum">Restarting Number</label>
                                                            <Field
                                                                name="pInRestartingNum"
                                                                type="number"
                                                                min="1"
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.pInRestartingNum && touched.pInRestartingNum
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="pInRestartingNum"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="pInRepeatingPeriod">Repeating Period</label>
                                                            <Select
                                                                name="pInRepeatingPeriod"
                                                                onChange={this.onDropDownChange}
                                                                value={this.state.pInRepeatingPeriod}
                                                                options={this.state.repeatingPeriodList}
                                                                classNamePrefix="select"
                                                                className={
                                                                    'form-control' +
                                                                    (errors.pInRepeatingPeriod && touched.pInRepeatingPeriod
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="pInRepeatingPeriod"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="prefix">Prefix</label>
                                                            <Field
                                                                name="pInPrefix"
                                                                type="text"
                                                                onChange={this.onTextChange}
                                                                className={'form-control'}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="pInPrefixEffectiveFrom">Prefix - Effective From</label>
                                                            <input
                                                                name="pInPrefixEffectiveFrom"
                                                                type="date"
                                                                value={this.state.pInPrefixEffectiveFrom}
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.pInPrefixEffectiveFrom && touched.pInPrefixEffectiveFrom
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="pInPrefixEffectiveFrom"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="pInSuffix">Suffix</label>
                                                            <Field
                                                                name="pInSuffix"
                                                                type="text"
                                                                onChange={this.onTextChange}
                                                                className={'form-control'}
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="pInSuffixEffectiveFrom">Suffix - Effective From</label>
                                                            <input
                                                                name="pInSuffixEffectiveFrom"
                                                                type="date"
                                                                value={this.state.pInSuffixEffectiveFrom}
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.pInSuffixEffectiveFrom && touched.pInSuffixEffectiveFrom
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="pInSuffixEffectiveFrom"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </Card.Body>
                                    </Card>

                                    <div className="form-group ">
                                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                            Update
                                        </button>
                                        {isSubmitting && (
                                            <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                        )}
                                    </div>
                                    {status && <div className={'alert alert-danger'}>{status}</div>}
                                    <p>
                                        <pre>{JSON.stringify(errors, null, 2)}</pre>
                                    </p>
                                    <p>
                                        <pre>{JSON.stringify(values, null, 2)}</pre>
                                    </p>
                                </Form>
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

export default VoucherSettings;

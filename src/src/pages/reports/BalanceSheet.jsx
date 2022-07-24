import React, { Component } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import Config from '../../config';
import { AuthenticationService } from '../../services/AuthenticationService';
import { BalanceSheetService } from '../../services/BalanceSheetService';
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';
import TreeList, { Column, SearchPanel, Editing } from 'devextreme-react/tree-list';
import { CheckBox } from 'devextreme-react';
import { Button } from 'devextreme-react/button';
import 'devextreme/dist/css/dx.light.css';
import * as moment from 'moment';
import { DateBox } from 'devextreme-react';

const allowedPageSizes = [5, 10, 20];

class BalanceSheet extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hasError: false,
            errorMsg: '',
            autoExpand: false,
            loadGrid: false,
            rows: [],
            fromDate: moment().subtract('2', 'months').format('MM/DD/YYYY'),
            toDate: moment().format('MM/DD/YYYY')
        };

        var currentUser = AuthenticationService.currentUserValue;
        if (!currentUser) {
            this.props.history.push(Config.signInPath);
            return;
        }
        this.onAutoExpandAllChanged = this.onAutoExpandAllChanged.bind(this);
        this.reload = this.reload.bind(this);
        this.onValueChanged1 = this.onValueChanged1.bind(this);
        this.onValueChanged2 = this.onValueChanged2.bind(this);
        this.searchByDate = this.searchByDate.bind(this);
        this.formatSummary = this.formatSummary.bind(this);
    }

    componentDidMount() {
        BalanceSheetService.getBalanceSheet(this.state.fromDate, this.state.toDate).then((x) => {
            this.formatSummary(x);
        });
    }

    onAutoExpandAllChanged() {
        if (this.state.autoExpand == false) {
            this.setState({ autoExpand: true });
        } else {
            this.setState({ autoExpand: false });
        }
    }

    reload() {
        window.location.reload();
    }

    onValueChanged1(e) {
        this.setState({ fromDate: e.value });
    }

    onValueChanged2(e) {
        this.setState({ toDate: e.value });
    }

    searchByDate() {
        if (Date.parse(this.state.fromDate, 'dd/MM/yyyy') > Date.parse(this.state.toDate, 'dd/MM/yyyy')) {
            this.setState({ hasError: true, errorMsg: 'Start Date cannot be larger than End Date' });
            return;
        }
        BalanceSheetService.getBalanceSheet(
            moment(this.state.fromDate).format('YYYY/MM/DD'),
            moment(this.state.toDate).format('YYYY/MM/DD')
        ).then((x) => {
            this.setState({ hasError: false, errorMsg: '' });
            this.formatSummary(x);
        });
    }

    formatSummary(x) {
        this.setState({ rows: x, loadGrid: true });
    }

    render() {
        return (
            <>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h5">Balance Sheet</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <div className="row">
                                    <div className="col-md-2">
                                        <DateBox
                                            id="Datebox1"
                                            name="dataBox1"
                                            onValueChanged={this.onValueChanged1}
                                            defaultValue={this.state.fromDate}
                                            placeholder="From"
                                            showClearButton={true}
                                            useMaskBehavior={true}
                                            type="date"
                                            displayFormat="dd/MM/yyyy"
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <DateBox
                                            id="Datebox2"
                                            onValueChanged={this.onValueChanged2}
                                            defaultValue={this.state.toDate}
                                            placeholder="To"
                                            showClearButton={true}
                                            useMaskBehavior={true}
                                            type="date"
                                            displayFormat="dd/MM/yyyy"
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <Button type="success" text="Go" onClick={this.searchByDate} />
                                    </div>
                                    <div className={'col-md-6 option'}>
                                        <CheckBox
                                            text="Expand All Groups"
                                            value={this.state.autoExpand}
                                            onValueChanged={this.onAutoExpandAllChanged}
                                        />
                                    </div>
                                    {this.state.hasError && <div className={'alert alert-danger'}>{this.state.errorMsg}</div>}
                                </div>
                                <div className="form-row ">
                                    {this.state.loadGrid && (
                                        <TreeList
                                            columnAutoWidth={true}
                                            showRowLines={true}
                                            rootValue={0}
                                            showBorders={true}
                                            dataSource={this.state.rows}
                                            autoExpandAll={this.state.autoExpand}
                                            keyExpr="groupId"
                                            parentIdExpr="parentId"
                                        >
                                            <SearchPanel visible={true} width={250} />
                                            <Column dataField="name" />
                                            {/* <Column dataField="openingBalance" />
                                            <Column dataField="debit" />
                                            <Column dataField="credit" /> */}
                                            <Column dataField="closingBalance" />
                                        </TreeList>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }
}
export default BalanceSheet;

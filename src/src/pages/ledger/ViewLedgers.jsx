import React, { Component } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import Config from '../../config';
import { AuthenticationService } from '../../services/AuthenticationService';
import { LedgerService } from '../../services/LedgerService';
import DataGrid, {Pager, Editing, Column, ColumnFixing, Paging, SearchPanel, Summary, TotalItem, GroupItem, SortByGroupSummaryInfo } from 'devextreme-react/data-grid';
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';
import { Button } from 'devextreme-react/button';

class ViewLedgers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loadGrid: false,
            rowdata: [],
            isModalVisible: false,
            showEditCommand: false,
            totalSumOpen: '',
            totalSumCurrent: '',



        };

        var currentUser = AuthenticationService.currentUserValue;
        if (!currentUser) {
            this.props.history.push(Config.signInPath);
            return;
        }
        this.Edit = this.Edit.bind(this);
        this.RedirectPage = this.RedirectPage.bind(this);
        this.customizeDataOpen = this.customizeDataOpen.bind(this);
        this.customizeDataCurrent = this.customizeDataCurrent.bind(this);
        
    }

    componentDidMount() {
        LedgerService.getLedgers().then((x) => {
            console.log(x);
            this.leadgersGroups(x);
        });
    }

    getChildRows = (row, rootRows) => {
        const childRows = rootRows.filter((r) => r.parentId === (row ? row.id : null));
        return childRows.length ? childRows : null;
    };

    leadgersGroups(leadgers) {
        // console.log(accGroups);
        let totalOpenCradit = 0.0;
        let totalOpenDebit = 0.0;
        let totalOpenSum;

        let totalCurrentCradit = 0.0;
        let totalCurrentDebit = 0.0;
        let totalCurrentSum;

        let arr = [];
        leadgers.map((group) => {

            var currentBal;
            var opBal;

            //------------OpeningBlance
            if (group.balanceType.name == 'Credit') {
                totalOpenCradit = totalOpenCradit + parseFloat(group.openingBalance);
                totalCurrentCradit = totalCurrentCradit + parseFloat(group.currentBalance);

            }
            else if (group.balanceType.name == 'Debit') {
                totalOpenDebit = totalOpenDebit + parseFloat(group.openingBalance);
                totalCurrentDebit = totalCurrentDebit + parseFloat(group.currentBalance);


            }
            //----------CurrentBlance
            // if (group.balanceType.name == 'Credit') {
            //     totalCurrentCradit = totalCurrentCradit + parseFloat(group.currentBalance);
            // }
            // else if (group.balanceType.name == 'Debit') {
            //     totalCurrentDebit = totalCurrentDebit + parseFloat(group.currentBalance);
            // }


            if (group.balanceType.name == 'Credit') {
                if (group.currentBalance >= 0) {
                    currentBal = group.currentBalance + ' (Cr)';

                } else {
                    if (group.balanceType.name == 'Credit') {
                        var cc = group.currentBalance.toString();
                        currentBal = cc.slice(1) + ' (Dr)';
                        {/*currentBal = group.currentBalance+ ' (Dr)';*/ }
                    } else {
                        var cc = group.currentBalance.toString();
                        currentBal = cc.slice(1) + ' (Cr)';
                        {/*currentBal = group.currentBalance+ ' (Cr)';*/ }
                    }
                }
            } else {
                if (group.currentBalance < 0) {
                    if (group.balanceType.name == 'Credit') {
                        var cc = group.currentBalance.toString();
                        currentBal = cc.slice(1) + ' (Dr)';
                        {/*currentBal = group.currentBalance + ' (Dr)';*/ }
                    } else {
                        var cc = group.currentBalance.toString();
                        currentBal = cc.slice(1) + ' (Cr)';
                        {/*currentBal = group.currentBalance + ' (Cr)';*/ }
                    }
                } else {
                    currentBal = group.currentBalance + ' (Dr)';
                }
            }

            if (group.balanceType.name == 'Credit') {
                if (group.openingBalance >= 0) {
                    opBal = group.openingBalance + ' (Cr)';

                } else {
                    if (group.balanceType.name == 'Credit') {
                        var cc = group.openingBalance.toString();
                        opBal = cc.slice(1) + ' (Dr)';
                        {/*currentBal = group.currentBalance+ ' (Dr)';*/ }
                    } else {
                        var cc = group.openingBalance.toString();
                        opBal = cc.slice(1) + ' (Cr)';
                        {/*currentBal = group.currentBalance+ ' (Cr)';*/ }
                    }
                }
            } else {
                if (group.openingBalance < 0) {
                    if (group.balanceType.name == 'Credit') {
                        var cc = group.openingBalance.toString();
                        opBal = cc.slice(1) + ' (Dr)';
                        {/*currentBal = group.currentBalance + ' (Dr)';*/ }
                    } else {
                        var cc = group.openingBalance.toString();
                        opBal = cc.slice(1) + ' (Cr)';
                        {/*currentBal = group.currentBalance + ' (Cr)';*/ }
                    }
                } else {
                    opBal = group.openingBalance + ' (Dr)';

                }
            }
            var data = {
                id: group.id,
                groupId: group.groupId,
                name: group.name + "  (" + group.aliasName + ")",
                Group: group.groupName,
                OpeningBalance: opBal,
                // address: group.address.pincode,
                // address: group.address.stateId,
                countryId:group.address&& group.address.countryId,
                // address: group.address.country,
                // address: group.address.state,

                CurrentBalance: currentBal,

                Address: group.Address,
                contactPerson: group.contactPerson
            };
            arr.push(data);
        });

        //-----TotalOpenBlance
        totalOpenSum = parseFloat(totalOpenCradit - totalOpenDebit).toFixed(2).toString();
        if (totalOpenSum == 0) {
            this.setState({ totalSumOpen: '0' });
        }
        else {
            this.setState({ totalSumOpen: totalOpenSum });
        }
        //-------TotalCurrentBlance
        totalCurrentSum = parseFloat(totalCurrentCradit - totalCurrentDebit).toFixed(2).toString();
        if (totalCurrentSum == 0) {
            this.setState({ totalSumCurrent: '0' });
        }
        else {
            this.setState({ totalSumCurrent: totalCurrentSum });
        }
        this.setState({ rowdata: arr, loadGrid: true });
    }
    Edit(e) {
        var arrId=[];
        var id={
            LedgerId:e.row.data.id,
            GroupId:e.row.data.groupId,
            countryId:e.row.data.countryId

        };
        arrId.push(id);
        const { from } = this.props.location.state || { from: { pathname: '/app/ledger/UpdateLedger' } };
        this.props.history.push(from, arrId);
    }

    RedirectPage() {
        const { from } = this.props.location.state || { from: { pathname: '/app/ledger/CreateLedger' } };
        this.props.history.push(from);
    }
    customizeDataOpen() {
        if (this.state.totalSumOpen < 0) {
            return `Total : ` + this.state.totalSumOpen.toString().split(/-(.+)/)[1] + ` Dr`;
        }
        else {
            return `Total : ` + this.state.totalSumOpen + ` Cr`;
        }

    }

    customizeDataCurrent(){
        if (this.state.totalSumCurrent < 0) {
            return `Total : ` + this.state.totalSumCurrent.toString().split(/-(.+)/)[1] + ` Dr`;
        }
        else {
            return `Total : ` + this.state.totalSumCurrent + ` Cr`;
        }
    }

   


    render() {
        return (
            <>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h5">View Ledgers</Card.Title>
                                <Button className="float-right" type="success" text="Create Ledger" onClick={this.RedirectPage}></Button>
                            </Card.Header>
                            <Card.Body>
                                <div className="form-table">
                                    {this.state.loadGrid && (
                                        <React.Fragment>
                                            <DataGrid
                                                id="gridContainer"
                                                dataSource={this.state.rowdata}
                                                allowColumnReordering={true}
                                                allowColumnResizing={true}
                                                columnAutoWidth={true}
                                                showBorders={true}
                                                defaultCurrentDate={true}
                                                onOptionChanged={this.dataGridRef}
                                            >
                                                <SearchPanel visible={true} />
                                                <Paging defaultPageSize={10} />
                                                
                                                <ColumnFixing enabled={true} />
                                                <Column dataField="id" visible={false} />
                                                <Column dataField="name" />
                                                <Column dataField="Group" />
                                                <Column dataField="OpeningBalance" alignment="right" />
                                                <Column dataField="CurrentBalance" alignment="right" />
                                                <Column dataField="Address" />
                                                <Column dataField="contactPerson" />
                                                

                                                <Column type={'buttons'} caption='Update'
                                                    buttons={[{ hint: 'Update', text: 'Edit', onClick: this.Edit },]}
                                                />

                                                <Summary>
                                                    <TotalItem column="name" summaryType="count" />
                                                    <TotalItem showInColumn="OpeningBalance" customizeText={this.customizeDataOpen} />
                                                    <TotalItem showInColumn="CurrentBalance" customizeText={this.customizeDataCurrent} />


                                                </Summary>
                                                <SortByGroupSummaryInfo summaryItem="count" />


                                            </DataGrid>
                                        </React.Fragment>
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
export default ViewLedgers;
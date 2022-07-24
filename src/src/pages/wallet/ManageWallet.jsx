import React, { Component } from 'react';
import Select from "react-select";
import { Row, Col, Card } from 'react-bootstrap';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import Config from '../../config';
import { AuthenticationService } from '../../services/AuthenticationService';
import { WalletService } from '../../services/WalletService';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

class ManageWallet extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loadGrid: false,
            isAdminSelected: false,
            roles: [],
            rows: []
        };

        this.fillUsers = this.fillUsers.bind(this);

        var currentUser = AuthenticationService.currentUserValue;
        // redirect to login if not logged in
        if (!currentUser) {
            this.props.history.push(Config.signInPath);
        }

        if (!(currentUser.role == AuthenticationService.superAdmin ||
            currentUser.role == AuthenticationService.admin)) {
            AuthenticationService.logout();
            this.props.history.push(Config.signInPath);
        }
    }

    componentDidMount() {
        WalletService.getUsersForWallet().then(this.fillUsers);
    }

    EditUserRenderer = cellData => {
        const navigateToDetails = () => {
            console.log(cellData);
            WalletService.addWalletInfo(cellData.data.email).then(x => {
                window.location.reload(true);
            });
        };

        return <span><button onClick={navigateToDetails} disabled={cellData.data.hasWallet} className="btn btn-info">Add Wallet</button></span>;
    };

    fillUsers(users) {
        console.log(users);
        let arr = [];
        users.map(user => {
            var data = {
                fullName: user.fullName,
                email: user.email,
                companyName: user.companyName,
                hasWallet: user.hasWallet,
                walletAmount: user.walletAmount
            }

            arr.push(data);
        });

        this.setState({ rows: arr, loadGrid: arr.length > 0 ? true : false });
    }

    render() {
        return (<>
            <Row>
                <Col>
                    <Card >
                        <Card.Header>
                            <Card.Title as="h5">View Wallet Users</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div className="form-row">
                                {this.state.loadGrid &&
                                    <div className="ag-theme-alpine" style={{ height: 300, width: '100%' }}>
                                        <AgGridReact
                                            frameworkComponents={{
                                                btnCellRenderer: this.EditUserRenderer,
                                                //btnCellTaskRenderer: this.UserTasksRenderer
                                            }}
                                            pagination={true}
                                            paginationAutoPageSize={true}
                                            rowData={this.state.rows}
                                            defaultColDef={{
                                                editable: false,
                                                enableRowGroup: true,
                                                enablePivot: true,
                                                enableValue: true,
                                                sortable: true,
                                                resizable: true,
                                                filter: true,
                                                flex: 1,
                                                minWidth: 10,
                                            }}>
                                            <AgGridColumn field="fullName"></AgGridColumn>
                                            <AgGridColumn field="email"></AgGridColumn>
                                            <AgGridColumn field="companyName"></AgGridColumn>
                                            <AgGridColumn field="hasWallet"></AgGridColumn>
                                            <AgGridColumn field="walletAmount"></AgGridColumn>
                                            <AgGridColumn cellRenderer="btnCellRenderer" field="Edit User" />
                                            {this.state.isAdminSelected &&
                                                <AgGridColumn cellRenderer="btnCellTaskRenderer" field="View Tasks" />
                                            }
                                        </AgGridReact>
                                    </div>
                                }
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>);
    }
};
export default ManageWallet;
import React, { Component } from 'react';
import Select from "react-select";
import { Row, Col, Card } from 'react-bootstrap';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import Config from '../../config';
import { AuthenticationService } from '../../services/AuthenticationService';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

class ViewUsers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loadGrid: false,
            isAdminSelected: false,
            roles: [],
            rows: []
        };

        this.fillUsers = this.fillUsers.bind(this);
        this.onRoleChanged = this.onRoleChanged.bind(this);

        var currentUser = AuthenticationService.currentUserValue;
        // redirect to login if not logged in
        if (!currentUser) {
            this.props.history.push(Config.signInPath);
        }

        if (!currentUser || !(currentUser.isAdmin || currentUser.isSuperAdmin)) {
            AuthenticationService.logout();
            this.props.history.push(Config.signInPath);
        }
    }

    componentDidMount() {
        AuthenticationService.getRoles().then(x => {
            var arr = [];
            x.map(y => {
                arr.push({ label: y.roleName, value: y.roleName });
            });
            this.setState({ roles: arr });
        });
    }

    EditUserRenderer = cellData => {
        const navigateToDetails = () => {
            this.props.history.push({
                pathname: '/app/auth/edituser',
                state: cellData.data
            })
        };

        return <span><button onClick={navigateToDetails} className="btn btn-info">Edit User</button></span>;
    };

    UserTasksRenderer = cellData => {
        const navigateToDetails = () => {
            this.props.history.push({
                pathname: '/app/task/showtasks',
                state: cellData.data
            })
        };

        return <span><button onClick={navigateToDetails} className="btn btn-info">View Tasks</button></span>;
    }

    onRoleChanged(roleOption) {
        if (roleOption.value == 'Admin') {
            AuthenticationService.getAdminUsersOnly().then(x => {
                this.fillUsers(x, true);
            });
        }
        if (roleOption.value == 'Other') {
            AuthenticationService.getClientUsersOnly().then(x => {
                this.fillUsers(x, false);
            });
        }
    }

    fillUsers(users, isAdmin) {
        let arr = [];
        if (isAdmin) {
            users.map(user => {
                var data = {
                    fullName: user.fullName,
                    email: user.email,
                    companyName: user.companyName,
                    phoneNumber: user.phoneNumber,
                    assignedTasks: user.assignedTasks,
                    inProgressTasks: user.inProgressTasks,
                    completedTasks: user.completedTasks
                }

                arr.push(data);
            });
        }
        else {
            users.map(user => {
                var data = {
                    fullName: user.fullName,
                    email: user.email,
                    companyName: user.companyName,
                    phoneNumber: user.phoneNumber,
                    files: user.files,
                    size: `${user.size} MB`
                }

                arr.push(data);
            });
        }

        this.setState({ rows: arr, loadGrid: arr.length > 0 ? true : false, isAdminSelected: isAdmin });
    }

    render() {
        return (<>
            <Row>
                <Col>
                    <Card >
                        <Card.Header>
                            <Card.Title as="h5">View Users</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div className="form-row">
                                <div className="form-group col-md-12">
                                    <label htmlFor="roles">Role</label>
                                    <Select name="roles" id="roles" isMulti={false} onChange={this.onRoleChanged} options={this.state.roles} />
                                </div>
                                {
                                    this.state.loadGrid &&
                                    <div className="ag-theme-alpine" style={{ height: 300, width: '100%' }}>
                                        <AgGridReact
                                            frameworkComponents={{
                                                btnCellRenderer: this.EditUserRenderer,
                                                btnCellTaskRenderer: this.UserTasksRenderer
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
                                            <AgGridColumn field="phoneNumber"></AgGridColumn>
                                            {this.state.isAdminSelected &&
                                                <AgGridColumn field="assignedTasks"></AgGridColumn>
                                            }
                                            {this.state.isAdminSelected &&
                                                <AgGridColumn field="inProgressTasks"></AgGridColumn>
                                            }
                                            {this.state.isAdminSelected &&
                                                <AgGridColumn field="completedTasks"></AgGridColumn>
                                            }
                                            {!this.state.isAdminSelected &&
                                                <AgGridColumn field="files"></AgGridColumn>
                                            }
                                            {!this.state.isAdminSelected &&
                                                <AgGridColumn field="size"></AgGridColumn>
                                            }
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
export default ViewUsers;
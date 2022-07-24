import React, { Component } from 'react';
import Select from "react-select";
import { Row, Col, Card } from 'react-bootstrap';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import Config from '../../config';
import { AuthenticationService } from '../../services/AuthenticationService';
import { TaskService } from '../../services/TaskService';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

class ShowTasks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loadGrid: false,
            employees: [],
            clients: [],
            employeeSelectedDefault: false,
            selectedEmployeeEmails: [],
            selectedClientEmails: [],
            rows: [],
            isSuperAdmin: true
        };

        this.fillTasks = this.fillTasks.bind(this);
        this.parseDateTime = this.parseDateTime.bind(this);
        this.getTasks = this.getTasks.bind(this);
        this.onDropDownChanged = this.onDropDownChanged.bind(this);

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
        AuthenticationService.getAdminUsersOnly().then(x => {
            var arr = [];
            x.map(y => {
                arr.push({ label: `${y.fullName} (${y.email})`, value: y.email });
            });
            this.setState({ employees: arr });
        });

        AuthenticationService.getClientUsersOnly().then(x => {var arr = [];
            var arr = [];
            x.map(y => {
                arr.push({ label: `${y.fullName} (${y.email}) (${y.companyName})`, value: y.email });
            });
            this.setState({ clients: arr });
        });

        if (this.props.history.location.state != null) {
            var email = this.props.history.location.state.email;
            var emails = [];
            emails.push(email);
            this.setState({ employeeSelectedDefault: true, selectedEmployeeEmails: emails }, this.getTasks);
        }

        if (!AuthenticationService.currentUserValue.isSuperAdmin) {
            var email = AuthenticationService.currentUserValue.userName;
            var emails = [];
            emails.push(email);
            this.setState({ selectedEmployeeEmails: emails, isSuperAdmin: false }, this.getTasks);
        }
    }

    UserTasksRenderer = cellData => {
        const navigateToDetails = () => {
            this.props.history.push({
                pathname: '/app/task/viewtask',
                state: cellData.data
            })
        };

        return <span><button onClick={navigateToDetails} className="btn btn-info">View Details</button></span>;
    };

    fillTasks(tasks) {
        let arr = [];
        tasks.map(task => {
            var data = {
                id: task.taskId,
                taskName: task.taskName,
                startDate: this.parseDateTime(task.startDateTime),
                endDate: this.parseDateTime(task.endDateTime),
                status: task.taskStatus.status,
                service: task.service,
                employee: `${task.assignedToUser.fullName} (${task.assignedToUser.email})`,
                client: `${task.taskForClient.fullName} (${task.taskForClient.email})`
            }

            arr.push(data);
        });

        return arr;
    }


    getTasks() {
        TaskService.getTasks(this.state.selectedEmployeeEmails, this.state.selectedClientEmails, 0, '', '')
            .then(x => {
                let tasks = this.fillTasks(x.tasks);
                this.setState({
                    rows: tasks,
                    loadGrid: tasks.length > 0 ? true : false
                });
            });
    }

    parseDateTime(dateAsString) {
        let dt = new Date(dateAsString);
        return `${dt.getDate()}-${dt.toLocaleString('default', { month: 'short' })}-${dt.getFullYear()}`;
    }

    onDropDownChanged(value, action) {
        var users = [];
        value.map(x => users.push(x.value));
        this.setState({ [action.name]: users }, this.getTasks);
    }

    render() {
        return (<>
            <Row>
                <Col>
                    <Card >
                        <Card.Header>
                            <Card.Title as="h5">Show Tasks</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div className="form-row">
                                {!this.state.employeeSelectedDefault &&
                                    <>
                                        {this.state.isSuperAdmin &&
                                            <div className="form-group col-md-12">
                                                <label htmlFor="selectedEmployeeEmails">Employees</label>
                                                <Select isClearable name="selectedEmployeeEmails" id="selectedEmployeeEmails" isMulti={true} onChange={this.onDropDownChanged} options={this.state.employees} />
                                            </div>
                                        }
                                        <div className="form-group col-md-12">
                                            <label htmlFor="selectedClientEmails">Client</label>
                                            <Select isClearable name="selectedClientEmails" id="selectedClientEmails" isMulti={true} onChange={this.onDropDownChanged} options={this.state.clients} />
                                        </div>
                                    </>
                                }
                                {
                                    this.state.loadGrid &&
                                    <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
                                        <AgGridReact
                                            frameworkComponents={{
                                                btnCellRenderer: this.UserTasksRenderer,
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
                                            <AgGridColumn field="id"></AgGridColumn>
                                            <AgGridColumn field="taskName"></AgGridColumn>
                                            <AgGridColumn field="service"></AgGridColumn>
                                            <AgGridColumn field="startDate"></AgGridColumn>
                                            <AgGridColumn field="endDate"></AgGridColumn>
                                            <AgGridColumn field="status"></AgGridColumn>
                                            <AgGridColumn field="employee"></AgGridColumn>
                                            <AgGridColumn field="client"></AgGridColumn>
                                            <AgGridColumn cellRenderer="btnCellRenderer" field="Details" />
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
export default ShowTasks;
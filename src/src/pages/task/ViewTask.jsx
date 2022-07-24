import React, { Component } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import Config from '../../config';
import { CustomSwitch } from '../../components/CustomSwitch';
import { AuthenticationService } from '../../services/AuthenticationService';
import { TaskService } from '../../services/TaskService';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const CancelActivity = 'CancelActivity';
const ChangeStatusActivity = 'ChangeStatusActivity';
const AddCommentActivity = 'AddCommentActivity';
const StartWorkingText = 'Start Task';
const FinishWorkingText = 'Complete Task';

class ViewTask extends Component {
    constructor(props) {
        super(props);

        this.state = {
            taskId: 0,
            employeeName: '',
            clientName: '',
            startDate: '',
            endDate: '',
            taskName: '',
            description: '',
            taskStatus: '',
            serviceName: '',
            taskDetails: {},
            allComments: [],
            loadCommentsGrid: false,
            statusText: '',
            taskCompletedOrCancelled: false,
            loadCancelReason: false,

            commment: '',
            cancellationReason: '',

            allAdmins: [],
            allClients: [],
            userDetails: {},
            services: [],
        };

        this.fillTaskDetails = this.fillTaskDetails.bind(this);
        this.onCheckBoxChange = this.onCheckBoxChange.bind(this);

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
        if (this.props.history.location.state == null) {
            this.props.history.push('/app/task/showtasks');
            return;
        }

        this.setState({ taskId: this.props.history.location.state.id }, this.fillTaskDetails);
    }

    fillTaskDetails() {
        TaskService.getTaskDetails(this.state.taskId).then(x => {
            var ret = [];
            x.taskComments.map(comment => {
                var data = {
                    commentedOn: this.parseDateTime(comment.commentedDateTime),
                    comment: comment.comment,
                    commentedBy: comment.commentedUser && comment.commentedUser.fullName
                };
                ret.push(data);
            });

            let statText = '';
            let taskAccomplished = false;
            if (x.canChangeStatus && x.taskStatus.statusId == 1) {
                statText = StartWorkingText;
            }
            else if (x.canChangeStatus && x.taskStatus.statusId == 2) {
                statText = FinishWorkingText;
            }

            if (x.taskStatus.statusId == 3 || x.taskStatus.statusId == 4) {
                taskAccomplished = true;
            }

            this.setState({
                taskDetails: x,
                allComments: ret,
                loadCommentsGrid: ret.length > 0,
                statusText: statText,
                taskCompletedOrCancelled: taskAccomplished,
                employeeName: `${x.assignedToUser.fullName} (${x.assignedToUser.email}) (${x.assignedToUser.companyName})`,
                clientName: `${x.taskForClient.fullName} (${x.taskForClient.email}) (${x.taskForClient.companyName})`,
                taskStatus: x.taskStatus.status,
                startDate: x.startDateTime,
                endDate: x.endDateTime,
                taskName: x.taskName,
                description: x.description,
                serviceName: x.service
            });
        });
    }

    parseDateTime(dateAsString) {
        let dt = new Date(dateAsString);
        return `${dt.getDate()}-${dt.toLocaleString('default', { month: 'short' })}-${dt.getFullYear()} ${dt.getHours()}:${dt.getMinutes()}`;
    }

    onCheckBoxChange = (e) => {
        this.setState({ [e.target.name]: e.target.checked });
    }

    render() {
        return (<>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Assign Task</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Formik
                                enableReinitialize
                                initialValues={{
                                    taskId: this.state.taskId,
                                    employeeName: this.state.employeeName,
                                    clientName: this.state.clientName,
                                    startDate: this.state.startDate,
                                    endDate: this.state.endDate,
                                    service: this.state.service,
                                    taskName: this.state.taskName,
                                    description: this.state.description,
                                    taskStatus: this.state.taskStatus,
                                    comment: this.state.commment,
                                    loadCancelReason: this.state.loadCancelReason,
                                    cancellationReason: this.state.cancellationReason
                                }}
                                validationSchema={Yup.object().shape({
                                    employeeName: Yup.string().required('This field is required'),
                                    clientName: Yup.string().required('This field is required'),
                                    taskName: Yup.string().required('This field is required'),
                                    service: Yup.number().min(1, 'Please select a value'),
                                    description: Yup.string().required('This field is required'),
                                    startDate: Yup.date().required('This field is required'),
                                    endDate: Yup.date().required('This field is required').min(Yup.ref('startDate'), "End date can't be before start date")
                                })}
                                onSubmit={({ taskId, comment, cancellationReason }, { setStatus, setSubmitting, setFieldValue }) => {
                                    if (this.state.submitAction == CancelActivity) {
                                        if (cancellationReason == '') {
                                            setStatus('Cancellation Reason Cannot be emplty');
                                            setSubmitting(false);
                                            return;
                                        }

                                        TaskService.cancelTask(taskId, cancellationReason).then(x => {
                                            if (!x) {
                                                setStatus('Server error occured while updating the status');
                                                setSubmitting(false);
                                            }
                                            else {
                                                this.fillTaskDetails();
                                                setSubmitting(false);
                                            }
                                        });
                                    }
                                    else if (this.state.submitAction == ChangeStatusActivity) {
                                        if (!this.state.taskDetails.canChangeStatus) {
                                            setStatus('Current user cannot change task status');
                                            setSubmitting(false);
                                            return;
                                        }

                                        TaskService.changeStatus(taskId).then(x => {
                                            if (!x) {
                                                setStatus('Server error occured while updating the status');
                                                setSubmitting(false);
                                            }
                                            else {
                                                this.fillTaskDetails();
                                                setSubmitting(false);
                                            }
                                        });
                                    }
                                    else if (this.state.submitAction == AddCommentActivity) {
                                        if (comment == '') {
                                            setStatus('Comment Cannot be emplty');
                                            setSubmitting(false);
                                            return;
                                        }

                                        TaskService.addComment(taskId, comment).then(x => {
                                            if (!x) {
                                                setStatus('Server error occured while updating the status');
                                                setSubmitting(false);
                                            }
                                            else {
                                                setFieldValue('comment', '');
                                                this.fillTaskDetails();
                                                setSubmitting(false);
                                            }
                                        });
                                    }
                                }}
                                render={({ values, errors, status, touched, isSubmitting }) => (
                                    <Form>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="taskId">Task ID</label>
                                                <Field name="taskId" type="text" disabled={true} className={'form-control' + (errors.taskId && touched.taskId ? ' is-invalid' : '')} />
                                                <ErrorMessage name="taskId" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group col-md-12">
                                                <label htmlFor="taskName">Task Name</label>
                                                <Field name="taskName" type="text" disabled={true} className={'form-control' + (errors.taskName && touched.taskName ? ' is-invalid' : '')} />
                                                <ErrorMessage name="taskName" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group col-md-12">
                                                <label htmlFor="description">Description</label>
                                                <Field name="description" type="text" disabled={true} className={'form-control' + (errors.description && touched.description ? ' is-invalid' : '')} />
                                                <ErrorMessage name="description" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group col-md-12">
                                                <label htmlFor="clientName">Client</label>
                                                <Field name="clientName" type="text" disabled={true} className={'form-control' + (errors.clientName && touched.clientName ? ' is-invalid' : '')} />
                                                <ErrorMessage name="clientName" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group col-md-12">
                                                <label htmlFor="employeeName">Employee</label>
                                                <Field name="employeeName" type="text" disabled={true} className={'form-control' + (errors.employeeName && touched.employeeName ? ' is-invalid' : '')} />
                                                <ErrorMessage name="employeeName" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="startDate">Start Date</label>
                                                <Field name="startDate" type="datetime-local" disabled={true} className={'form-control' + (errors.startDate && touched.startDate ? ' is-invalid' : '')} />
                                                <ErrorMessage name="startDate" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="endDate">End Date</label>
                                                <Field name="endDate" type="datetime-local" disabled={true} className={'form-control' + (errors.endDate && touched.endDate ? ' is-invalid' : '')} />
                                                <ErrorMessage name="endDate" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group col-md-12">
                                                <label htmlFor="taskStatus">Task Status</label>
                                                <Field name="taskStatus" type="text" disabled={true} className={'form-control' + (errors.taskStatus && touched.taskStatus ? ' is-invalid' : '')} />
                                                <ErrorMessage name="taskStatus" component="div" className="invalid-feedback" />
                                            </div>
                                            {
                                                this.state.loadCommentsGrid &&
                                                <div className="ag-theme-alpine form-group col-md-12">
                                                    <AgGridReact
                                                        pagination={true}
                                                        paginationAutoPageSize={true}
                                                        rowData={this.state.allComments}
                                                        domLayout={'autoHeight'}
                                                        defaultColDef={{
                                                            editable: false,
                                                            enableRowGroup: true,
                                                            enablePivot: true,
                                                            enableValue: true,
                                                            resizable: true,
                                                            flex: 1,
                                                            minWidth: 10,
                                                        }}>
                                                        <AgGridColumn field="commentedBy"></AgGridColumn>
                                                        <AgGridColumn field="commentedOn"></AgGridColumn>
                                                        <AgGridColumn field="comment"></AgGridColumn>
                                                    </AgGridReact>
                                                </div>
                                            }
                                            <div className="form-group col-md-12">
                                                <label htmlFor="comment">Comment</label>
                                                <Field name="comment" type="text" disabled={!this.state.taskDetails.canComment} className={'form-control' + (errors.comment && touched.comment ? ' is-invalid' : '')} />
                                                <ErrorMessage name="comment" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group col-md-12">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary"
                                                    disabled={isSubmitting}
                                                    onClick={() => this.setState({ submitAction: AddCommentActivity })}>
                                                    Add Comment
                                                </button>
                                            </div>
                                            {
                                                this.state.taskDetails.canChangeStatus && !this.state.taskCompletedOrCancelled &&
                                                <div className="form-group col-md-12">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary"
                                                        disabled={isSubmitting}
                                                        onClick={() => this.setState({ submitAction: ChangeStatusActivity })}>
                                                        {this.state.statusText}
                                                    </button>
                                                </div>
                                            }
                                            {
                                                this.state.taskDetails.canCancel && !this.state.taskCompletedOrCancelled &&
                                                <>
                                                    {/*<div className="form-group form-group-margin">
                                                         <input
                                                            onChange={this.enableCancel}
                                                            type="checkbox"
                                                            name="canCancel" /> Cancel
                                                    </div> */}
                                                    <div className="form-group col-md-12">
                                                        <CustomSwitch checked={values.loadCancelReason} name="loadCancelReason" id="loadCancelReason" onChange={this.onCheckBoxChange} text="Cancel" />
                                                    </div>
                                                    {
                                                        this.state.loadCancelReason &&
                                                        <>
                                                            <div className="form-group col-md-12">
                                                                <label htmlFor="cancellationReason">Cancellation Reason</label>
                                                                <Field name="cancellationReason" type="text" className={'form-control' + (errors.cancellationReason && touched.cancellationReason ? ' is-invalid' : '')} />
                                                                <ErrorMessage name="cancellationReason" component="div" className="invalid-feedback" />
                                                            </div>
                                                            <div className="form-group col-md-12">
                                                                <button
                                                                    type="submit"
                                                                    className="btn btn-primary"
                                                                    disabled={isSubmitting}
                                                                    onClick={() => this.setState({ submitAction: CancelActivity })}>
                                                                    Cancel Task
                                                                </button>
                                                            </div>
                                                        </>
                                                    }
                                                </>
                                            }
                                        </div>

                                        {status &&
                                            <div className={'alert alert-danger'}>{status}</div>
                                        }
                                        {/* <p>
                                                <pre>{JSON.stringify(values, null, 2)}</pre>
                                            </p> */}
                                    </Form>
                                )}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>);
    }
};
export default ViewTask;
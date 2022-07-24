import React, { Component } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import Config from '../../config';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { AuthenticationService } from '../../services/AuthenticationService';
import { GroupsService } from '../../services/GroupsService';
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';
import TreeList, { Column, SearchPanel, Pager, Paging, Editing, Scrolling } from 'devextreme-react/tree-list';
import { CheckBox } from 'devextreme-react';
import { Button } from 'devextreme-react/button';
import 'devextreme/dist/css/dx.light.css';
import Alert from 'react-bootstrap/Alert';

const allowedPageSizes = [5, 10, 20];

class ViewGroups extends Component {
    constructor(props) {
        super(props);

        this.state = {
            autoExpand: false,
            events: [],
            loadGrid: false,
            alert: false,
            rows: [],
            rowChanges: {},
            isModalVisible: false
        };

        this.fillGroups = this.fillGroups.bind(this);
        var currentUser = AuthenticationService.currentUserValue;
        if (!currentUser) {
            this.props.history.push(Config.signInPath);
            return;
        }
        this.setRowChanges = (rowChanges) => this.setState({ rowChanges });
        this.EditCell = this.EditCell.bind(this);
        this.RedirectPage = this.RedirectPage.bind(this);
        this.onAutoExpandAllChanged = this.onAutoExpandAllChanged.bind(this);
        this.reload=this.reload.bind(this);
    }

    componentDidMount() {
        GroupsService.getAccountGroups().then((x) => {
            this.fillGroups(x);
        });
    }

    getChildRows = (row, rootRows) => {
        const childRows = rootRows.filter((r) => r.parentId === (row ? row.id : null));
        return childRows.length ? childRows : null;
    };

    fillGroups(accGroups) {
        var arr = [];
        accGroups.map((group) => {
            var data = {
                id: group.id,
                name: group.name,
                description: group.description,
                isDefault: group.isDefault,
                parentId: group.parentId
            };
            arr.push(data);
        });
        this.setState({ rows: arr, loadGrid: true });
    }

    RedirectPage() {
        const { from } = this.props.location.state || { from: { pathname: '/app/groups/CreateAccountGroup' } };
        this.props.history.push(from);
    }

    onAutoExpandAllChanged() {
        if (this.state.autoExpand == false) {
            this.setState({ autoExpand: true });
        } else {
            this.setState({ autoExpand: false });
        }
    }
  
    EditCell(e) {
        if (e.changes.length == 0) {
            window.location.reload();
        } else {
            var name1, description1;

            let data = this.state.rows.find((v) => v.id === e.changes[0].key);

            if (data && data.isDefault == false) {
                if (e.changes[0].data.name == undefined) {
                    name1 = data.name;
                    description1 = e.changes[0].data.description;
                }
                if (e.changes[0].data.description == undefined) {
                    description1 = data.description;
                    name1 = e.changes[0].data.name;
                }
                if(e.changes[0].data.name != undefined && e.changes[0].data.description != undefined){
                    name1 = e.changes[0].data.name;
                    description1 = e.changes[0].data.description;
                }
                GroupsService.updateAccountGroup(data.id, name1, description1).then((response) => {
                    if (response.isSuccess === true) {
                        window.location.reload();
                    }
                });
            } else {
                this.setState({ alert: true });
                this.setState({isModalVisible: true});
                this.setState((state) => ({ events: [e].concat(state.events) }));
            }
        }
    }

    reload(){
        window.location.reload();
    }

    render() {
        return (
            <>
                <Row>
                    <Col>
                        <Card>
                            {this.state.alert && (
                                <Modal isOpen={this.state.isModalVisible}>
                                            <ModalHeader>Update</ModalHeader>
                                            <ModalBody>
                                                <div>
                                        
                                                    <div className="form-row">
                                                        <div className="form-group col-md-12">
                                                            <label htmlFor="modalText">this Filed can't  be Update.click OK for Reload}</label>
                                                        </div>
                                                        
                                                        <div className="form-group col-md-6">
                                                            <button
                                                                type="submit"
                                                                className="btn btn-secondary"
                                                                onClick={this.reload}
                                                            >
                                                            Ok
                                                            </button>
                                                        </div>

                                                    </div>
                                                       
                                                </div>
                                            </ModalBody>
                                        </Modal>
                            )}
                            <Card.Header>
                                <Card.Title as="h5">Account Groups</Card.Title>

                                <Button
                                    className="float-right"
                                    type="success"
                                    text="Add Account Group"
                                    onClick={this.RedirectPage}
                                ></Button>
                            </Card.Header>
                            <Card.Body>
                                <div className="option">
                                    <CheckBox
                                        text="Expand All Groups"
                                        value={this.state.autoExpand}
                                        onValueChanged={this.onAutoExpandAllChanged}
                                    />
                                </div>
                                <div className="form-row ">
                                    {this.state.loadGrid && (
                                        <TreeList
                                            columnAutoWidth={true}
                                            showRowLines={true}
                                            showBorders={true}
                                            dataSource={this.state.rows}
                                            autoExpandAll={this.state.autoExpand}
                                            onSaving={this.EditCell}
                                        >
                                            <Editing allowUpdating={true} mode="row" />
                                            <SearchPanel visible={true} width={250} />

                                            {/* <Scrolling mode="standard" />
                                            <Paging enabled={true} defaultPageSize={10} />
                                            <Pager showPageSizeSelector={true} allowedPageSizes={allowedPageSizes} showInfo={true} /> */}

                                            <Column dataField="name" />
                                            <Column dataField="description" />
                                            <Column caption="Action" type="buttons">
                                                <Button name="edit" />
                                            </Column>
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
export default ViewGroups;

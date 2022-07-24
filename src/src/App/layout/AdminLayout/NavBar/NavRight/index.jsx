import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { Dropdown } from 'react-bootstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';
import DEMO from '../../../../../store/constant';
import Avatar1 from '../../../../../assets/images/user/avatar-1.jpg';
import Avatar2 from '../../../../../assets/images/user/avatar-2.jpg';
import { AuthenticationService } from '../../../../../services/AuthenticationService';
import { WalletService } from '../../../../../services/WalletService';

var balance = 0.00;
class NavRight extends Component {
    constructor(props) {
        super(props);

        if (AuthenticationService.currentUserValue &&
            (AuthenticationService.currentUserValue.role != 'SuperAdmin' || AuthenticationService.currentUserValue.role != 'Admin')) {
            WalletService.getWalletInfo().then(wallet => {
                balance = wallet.walletInfo.balance;
            })
        }
    }

    Logout = _ => {
        AuthenticationService.logout();
        this.props.history.push(`/app/auth/signin`);
        // window.location.reload();
    }

    ChangePassword = (props) => {
        this.props.history.push(`/app/auth/changepassword`);
    }

    RegisterUser = (props) => {
        this.props.history.push(`/app/auth/register`);
    }

    ManageWallet = (props) => {
        this.props.history.push(`/app/wallet/manage`);
    }

    UpdateBalance = (props) => {
        this.props.history.push(`/app/wallet/updatebalance`);
    }

    render() {
        return (<>
            <ul className="navbar-nav ml-auto">
                <li>
                    <Dropdown drop={!this.props.rtlLayout ? 'left' : 'right'} className="dropdown" alignRight={!this.props.rtlLayout}>
                        <Dropdown.Toggle variant={'link'} id="dropdown-basic">
                            <i className="icon feather icon-user" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu alignRight className="profile-notification">
                            <div className="pro-head bg-dark">
                                <img src={Avatar1} className="img-radius" alt="User Profile" />
                                <span>{AuthenticationService.currentUserValue && AuthenticationService.currentUserValue.fullName}</span>
                                <a href='#' onClick={this.Logout} className="dud-logout" title="Logout">
                                    <i className="feather icon-log-out" />
                                </a>
                            </div>
                            <ul className="pro-body">
                                {AuthenticationService.currentUserValue &&
                                    (AuthenticationService.currentUserValue.role == 'SuperAdmin' || AuthenticationService.currentUserValue.role == 'Admin') &&
                                    <>
                                        <li>
                                            <a href='#' onClick={this.RegisterUser} className="dropdown-item">
                                                <i className="feather icon-user-plus" /> Register
                                            </a>
                                        </li>
                                        <li>
                                            <a href='#' onClick={this.ManageWallet} className="dropdown-item">
                                                <i className="feather icon-briefcase" /> Manage Client Wallets
                                            </a>
                                        </li>
                                        <li>
                                            <a href='#' onClick={this.UpdateBalance} className="dropdown-item">
                                                <i className="feather icon-plus-square" /> Update Balance
                                            </a>
                                        </li>
                                    </>
                                }
                                {AuthenticationService.currentUserValue &&
                                    (AuthenticationService.currentUserValue.role != 'SuperAdmin' || AuthenticationService.currentUserValue.role != 'Admin') &&
                                    <>
                                        <li>
                                            <a href='#' className="dropdown-item">
                                                <i className="feather icon-briefcase" /> Credits : {balance} points
                                            </a>
                                        </li>
                                    </>
                                }
                                <li>
                                    <a href='#' onClick={this.ChangePassword} className="dropdown-item">
                                        <i className="feather icon-user-check" /> Change Password
                                    </a>
                                </li>
                            </ul>
                        </Dropdown.Menu>
                    </Dropdown>
                </li>
            </ul>
        </>);
    }
}

export default withRouter(NavRight);
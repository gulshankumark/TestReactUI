import * as React from 'react';
const DashboardDefaultPage = React.lazy(() => import('./pages/dashboard/DashboardDefault'));

const ChangePasswordPage = React.lazy(() => import('./pages/auth/ChangePassword'));
const ViewUsersPage = React.lazy(() => import('./pages/auth/ViewUsers'));
const EditUserPage = React.lazy(() => import('./pages/auth/EditUser'));
const RegisterUserPage = React.lazy(() => import('./pages/auth/RegisterUser'));
const AddGroupPage = React.lazy(() => import('./pages/auth/AddGroup'));
const AddServicePage = React.lazy(() => import('./pages/auth/AddService'));

const ManageWalletPage = React.lazy(() => import('./pages/wallet/ManageWallet'));
const UpdateWalletPage = React.lazy(() => import('./pages/wallet/UpdateBalance'));
const AddFundsPage = React.lazy(() => import('./pages/wallet/AddFunds'));

const CreateLedgerPage = React.lazy(() => import('./pages/ledger/CreateLedger'));
const ViewLedgersPage = React.lazy(() => import('./pages/ledger/ViewLedgers'));
const UpdateLedger = React.lazy(() => import('./pages/ledger/UpdateLedger'));

const UpdateCompanyPage = React.lazy(() => import('./pages/company/UpdateCompany'));

const CreateAccountGroupPage = React.lazy(() => import('./pages/groups/CreateAccountGroup'));
const ViewGroupsPage = React.lazy(() => import('./pages/groups/ViewGroups'));

const VoucherSettingsPage = React.lazy(() => import('./pages/voucherSettings/VoucherSettings'));

const SalesInvoice = React.lazy(() => import('./pages/transaction/salesInvoice/SalesInvoice'));
const createSalesInvoice = React.lazy(() => import('./pages/transaction/salesInvoice/CreateSalesInvoice'));

const ProformaInvoice = React.lazy(() => import('./pages/transaction/ProformaInvoice/ProformaInvoice'));
const CreateProformaInvoice = React.lazy(() => import('./pages/transaction/ProformaInvoice/CreateProformaInvoice'));

const CreatePaymentReceipt = React.lazy(() => import('./pages/transaction/paymentReceipt/CreatePaymentReceipt'));

const JournalView = React.lazy(() => import('./pages/transaction/Journal_Contra/JournalView'));
const CreateJournal = React.lazy(() => import('./pages/transaction/Journal_Contra/CreateJournal'));

const DualTransaction = React.lazy(() => import('./pages/transaction/dualTransaction/DualTransaction'));
const CreateDualTransaction = React.lazy(() => import('./pages/transaction/dualTransaction/CreateDualTransaction'));


const ViewPaymentReceipt = React.lazy(() => import('./pages/transaction/paymentReceipt/ViewPaymentReceipt'));

const TrialBalancePage = React.lazy(() => import('./pages/reports/TrialBalance'));
const ProfitLossPage = React.lazy(() => import('./pages/reports/ProfitLoss'));
const LedgerReport = React.lazy(() => import('./pages/reports/LedgerReport'));
const BalanceSheetPage = React.lazy(() => import('./pages/reports/BalanceSheet'));

const GstMenuPage = React.lazy(() => import('./pages/gst/GstMenu'));
const GetGstB2bInvoicesPage = React.lazy(() => import('./pages/gst/GstB2BInvoices'));
const Gstr = React.lazy(() => import('./pages/gst/Gstr'));
const Gstr1Details=React.lazy(()=>import('./pages/gst/Gstr1Details'));
const ViewGstr1=React.lazy(()=>import('./pages/gst/ViewGstr1'));


const CardBarChartInvoices=React.lazy(()=>import('./pages/dashboard/DashboardComponents/Cards/CardBarChartInvoices'));
const CardBarChartSales=React.lazy(()=>import('./pages/dashboard/DashboardComponents/Cards/CardBarChartSales'));
const DayBookCard=React.lazy(()=>import('./pages/dashboard/DashboardComponents/Cards/DayBookCard'));
const DebtorsCreditors=React.lazy(()=>import('./pages/dashboard/DashboardComponents/Cards/DebtorsCreditors'));




const MultipleInvoice = React.lazy(() => import('./pages/multipleInvoice/MultipleInvoice'));

// const LiquidFundCard=React.lazy(()=>import('./pages/dashboard/DashboardComponents/Cards/LiquidFundCard'));
// const DayBookCard=React.lazy(()=>import('./pages/dashboard/DashboardComponents/Cards/DayBookCard'));
// const CardBarChartInvoices=React.lazy(()=>import('./pages/dashboard/DashboardComponents/Cards/CardBarChartInvoices'));
// const CardBarChartSales=React.lazy(()=>import('./pages/dashboard/DashboardComponents/Cards/CardBarChartSales'));
// const CardStats=React.lazy(()=>import('./pages/dashboard/DashboardComponents/Cards/CardStats'));
// const HeaderStats=React.lazy(()=>import('./pages/dashboard/DashboardComponents/Headers/HeaderStats'));


const routes = [
 
    { path: '/dashboard/default', exact: true, name: 'Dashboard', component: DashboardDefaultPage },
    { path: '/app/auth/changepassword', exact: true, name: 'Add Group Page', component: ChangePasswordPage },
    { path: '/app/auth/register', exact: true, name: 'Register User Page', component: RegisterUserPage },
    { path: '/app/auth/viewusers', exact: true, name: 'View Users Page', component: ViewUsersPage },
    { path: '/app/auth/edituser', exact: true, name: 'Edit User Page', component: EditUserPage },
    { path: '/app/manage/addgroup', exact: true, name: 'Add Group Page', component: AddGroupPage },
    { path: '/app/manage/addservice', exact: true, name: 'Add Service Page', component: AddServicePage },

    { path: '/app/wallet/manage', exact: true, name: 'Manage User Wallet', component: ManageWalletPage },
    { path: '/app/wallet/updatebalance', exact: true, name: 'Update User Wallet', component: UpdateWalletPage },
    { path: '/app/wallet/addFunds', exact: true, name: 'Add Funds', component: AddFundsPage },

    { path: '/app/company/updatecompany', exact: true, name: 'Update Company', component: UpdateCompanyPage },
    { path: '/app/ledger/createLedger', exact: true, name: 'Create Ledger', component: CreateLedgerPage },
    { path: '/app/groups/viewgroups', exact: true, name: 'View Groups', component: ViewGroupsPage },
    { path: '/app/ledger/ViewLedgers', exact: true, name: 'View Ledgers', component: ViewLedgersPage },

    { path: '/app/ledger/UpdateLedger', exact: true, name: 'View Ledgers', component: UpdateLedger },

    { path: '/app/groups/CreateAccountGroup', exact: true, name: 'Create Account Groups', component: CreateAccountGroupPage },

    { path: '/app/salesInvoice/SalesInvoice', exact: true, name: 'salesInvoice', component: SalesInvoice },
    { path: '/app/salesInvoice/CreateSalesInvoice', exact: true, name: 'salesInvoice', component: createSalesInvoice },

    
    { path: '/app/ProformaInvoice/ProformaInvoice', exact: true, name: 'salesInvoice', component: ProformaInvoice },
    { path: '/app/ProformaInvoice/CreateProformaInvoice', exact: true, name: 'salesInvoice', component: CreateProformaInvoice },


    { path: '/app/Journal_Contra/JournalView', exact: true, name: 'JournalView', component: JournalView },
    { path: '/app/Journal_Contra/CreateJournal', exact: true, name: 'CreateJournal', component: CreateJournal },


    { path: '/app/dualTransaction/DualTransaction', exact: true, name: 'Dual Transaction', component: DualTransaction },
    { path: '/app/dualTransaction/CreateDualTransaction', exact: true, name: 'salesInvoice', component: CreateDualTransaction },


    { path: '/app/paymentReceipt/CreatePaymentReceipt', exact: true, name: 'Create Payment Receipt', component: CreatePaymentReceipt },
    { path: '/app/paymentReceipt/ViewPaymentReceipt', exact: true, name: 'View Payment Receipt', component: ViewPaymentReceipt },


    { path: '/app/company/VoucherSettings', exact: true, name: 'Voucher Settings', component: VoucherSettingsPage },

    { path: '/app/reports/TrialBalance', exact: true, name: 'Trial Balance', component: TrialBalancePage },
    { path: '/app/reports/ProfitLoss', exact: true, name: 'Profit & Loss A/C', component: ProfitLossPage },
    { path: '/app/reports/LedgerReport', exact: true, name: 'View Ledgers', component: LedgerReport },
    { path: '/app/reports/BalanceSheet', exact: true, name: 'Balance Sheet', component: BalanceSheetPage },

    { path: '/app/gst/getgstb2b', exact: true, name: 'GSTR 2A B2B Invoices', component: GetGstB2bInvoicesPage },
    { path: '/app/gst/getmenu', exact: true, name: 'GSTR Menu', component: GstMenuPage },
    { path: '/app/gst/Gstr', exact: true, name: 'GSTR', component: Gstr },
    { path: '/app/gst/Gstr1Details', exact: true, name: 'GSTR', component: Gstr1Details },
    { path: '/app/gst/ViewGstr1', exact: true, name: 'GSTR', component: ViewGstr1 },

    { path: '/app/multipleInvoice/MultipleInvoice', exact: true, name: 'multipleInvoice', component: MultipleInvoice },


    { path: '/dashboard/DashboardComponents/Cards/CardBarChartInvoices', exact: true, name: 'dashboard', component: CardBarChartInvoices },
    { path: '/dashboard/DashboardComponents/Cards/CardBarChartSales', exact: true, name: 'dashboard', component: CardBarChartSales },
    { path: '/dashboard/DashboardComponents/Cards/DayBookCard', exact: true, name: 'dashboard', component: DayBookCard },
    { path: '/dashboard/DashboardComponents/Cards/DebtorsCreditors', exact: true, name: 'dashboard', component: DebtorsCreditors },


   

];
export default routes;

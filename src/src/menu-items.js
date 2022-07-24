import { AuthenticationService } from './services/AuthenticationService';

export function chartData() {
    if (
        AuthenticationService.currentUserValue &&
        AuthenticationService.currentUserValue.role != AuthenticationService.superAdmin &&
        AuthenticationService.currentUserValue.role != AuthenticationService.admin &&
        AuthenticationService.currentUserValue.role != AuthenticationService.clientAdmin
    ) {
        return clientChartData;
    }

    return adminChartData;
}

const clientChartData = {
    items: [
        {
            id: 'navigation',
            title: '',
            type: 'group',
            icon: 'icon-navigation',
            children: [
                {
                    id: 'dashboard',
                    title: 'Dashboard',
                    type: 'item',
                    icon: 'feather icon-home',
                    url: '/dashboard/default'
                }
            ]
        }
    ]
};

const adminChartData = {
    items: [
        {
            id: 'navigation',
            title: '',
            type: 'group',
            icon: 'icon-navigation',
            children: [
                {
                    id: 'dashboard',
                    title: 'Dashboard',
                    type: 'item',
                    icon: 'feather icon-home',
                    url: '/dashboard/default'
                },
                {
                    id: 'masters',
                    title: 'Masters',
                    type: 'collapse',
                    icon: 'feather icon-users',
                    children: [
                        {
                            id: 'updateCompany',
                            title: 'Company',
                            type: 'item',
                            url: '/app/company/updatecompany'
                        },
                        {
                            id: 'viewGroups',
                            title: 'Groups',
                            type: 'item',
                            url: '/app/groups/viewgroups'
                        },
                        {
                            id: 'viewLedgers',
                            title: 'Ledgers',
                            type: 'item',
                            url: '/app/ledger/ViewLedgers'
                        },
                        {
                            id: 'voucherSettings',
                            title: 'Voucher Settings',
                            type: 'item',
                            url: '/app/company/VoucherSettings'
                        },
                        // {
                        //     id: 'createLedger',
                        //     title: 'Create Ledger',
                        //     type: 'item',
                        //     url: '/app/ledger/createLedger'
                        // },
                        // {
                        //     id: 'createGroup',
                        //     title: 'Create Account Group',
                        //     type: 'item',
                        //     url: '/app/groups/CreateAccountGroup'
                        // },
                    ]
                },
                {
                    id: 'transactions',
                    title: 'Transactions',
                    type: 'collapse',
                    icon: 'feather icon-edit',
                    children: [
                        {
                            id: 'salesInvoice',
                            title: 'Sales Invoice',
                            type: 'item',
                            url: '/app/salesInvoice/SalesInvoice'
                        }, 
                        {
                            id: 'PerformaInvoice',
                            title: 'Proforma Invoice / Estimate / Quotation',
                            type: 'item',
                            url: '/app/ProformaInvoice/ProformaInvoice'
                        },
                        {
                            id: 'paymentReceipt',
                            title: 'Payment Receipt',
                            type: 'item',
                            url: '/app/paymentReceipt/ViewPaymentReceipt'
                        },
                        {
                            id: 'JournalView',
                            title: 'Journal View',
                            type: 'item',
                            url: '/app/Journal_Contra/JournalView'
                        },
                        {
                            id:'DualTransaction',
                            title:'Dual Transaction',
                            type:'item',
                            url:'/app/dualTransaction/DualTransaction'
                        }

                    ]
                },
                {
                    id: 'reports',
                    title: 'Reports',
                    type: 'collapse',
                    icon: 'feather icon-edit',
                    children: [
                        {
                            id: 'ledgerReport',
                            title: 'Ledger Report',
                            type: 'item',
                            url: '/app/reports/LedgerReport'
                        },
                        {
                            id: 'trialBalance',
                            title: 'Trial Balance',
                            type: 'item',
                            url: '/app/reports/TrialBalance'
                        },
                        {
                            id: 'profitLoss',
                            title: 'Profit & Loss A/C',
                            type: 'item',
                            url: '/app/reports/ProfitLoss'
                        },
                        {
                            id: 'balanceSheet',
                            title: 'Balance Sheet',
                            type: 'item',
                            url: '/app/reports/BalanceSheet'
                        }
                        
                    ]
                },
                {
                    id: 'gst',
                    title: 'GST',
                    type: 'collapse',
                    icon: 'feather icon-clipboard',
                    children: [
                        {
                            id: 'gst',
                            title: 'GST',
                            type: 'item',
                            url: '/app/gst/getmenu',
                            icon: 'feather icon-dollarsign'
                        },
                        {
                            id: 'gstr1',
                            title: 'GSTR1',
                            type: 'item',
                            url: '/app/gst/Gstr',
                            icon: 'feather icon-dollarsign'
                        }
                    ]
                },
                
                {
                    id: 'funds',
                    title: 'Funds',
                    type: 'collapse',
                    icon: 'feather icon-briefcase',
                    children: [
                        {
                            id: 'addFunds',
                            title: 'Add Funds',
                            type: 'item',
                            url: '/app/wallet/addFunds'
                        }
                    ]
                },
                {
                    id: 'MultipleInvoice',
                    title: 'MultipleInvoice',
                    type: 'collapse',
                    icon: 'feather icon-printer',
                    children: [
                        {
                            id: 'MultipleInvoice',
                            title: 'MultipleInvoice',
                            type: 'item',
                            url: '/app/multipleInvoice/MultipleInvoice'
                        }
                    ]
                }
            ]
        }
    ]
};

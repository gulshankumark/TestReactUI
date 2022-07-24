import * as React from 'react';
// import "@fortawesome/fontawesome-free/css/all.min.css";
import "./index.css";

const SignInPage = React.lazy(() => import('./pages/auth/SignIn'));
const ForgetPasswordPage = React.lazy(() => import('./pages/auth/ForgetPassword'));
const ResetPasswordPage = React.lazy(() => import('./pages/auth/ResetPassword'));


const route = [
    { path: '/app/auth/signin', exact: true, name: 'Sign In', component: SignInPage },
    { path: '/app/auth/forgetPassword', exact: true, name: 'Forget Password', component: ForgetPasswordPage },
    { path: '/app/auth/resetPassword', exact: true, name: 'Reset Password', component: ResetPasswordPage }
];
export default route;

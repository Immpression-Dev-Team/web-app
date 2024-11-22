// import SettingsScreen from '../screens/Settings';
// import StatisticsScreen from '../screens/Statistics';
// import Profile from '../screens/Profile';
import SignUp from './components/SignUp/SignUp.jsx';
// import PasswordReset from '../components/PasswordReset';
// import Login from '../components/Login';
// import AccountTypeScreen from '../components/AccountType';

// export const UserNavigation = [
//     {
//         name: 'Statistics',
//         component: StatisticsScreen,
//     },
//     {
//         name: 'Profile',
//         component: Profile,
//     },
//     {
//         name: 'Settings',
//         component: SettingsScreen,
//     },
//     {
//         name: 'SignUp',
//         component: SignUp,
//     },
//     {
//         name: 'PasswordReset',
//         component: PasswordReset,
//     },
//     {
//         name: 'AccountType',
//         component: AccountTypeScreen,
//     },
// ];

export const GuestNavigation = [
    // {
    //     name: 'Login',
    //     component: Login,
    // },
    {
        name: 'SignUp',
        path: '/sign-up',
        component: SignUp,
    },
    // {
    //     name: 'PasswordReset',
    //     component: PasswordReset,
    // },
    // {
    //     name: 'AccountType',
    //     component: AccountTypeScreen,
    // },
];

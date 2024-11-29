import SettingsScreen from './components/Settings/Settings.jsx';
import StatisticsScreen from './components/Statistics/Statistics.jsx';
import Profile from './components/Profile/Profile.jsx';
import SignUp from './components/SignUp/SignUp.jsx';
import PasswordReset from './components/PasswordReset/PasswordReset.jsx';
import Login from './components/Login/Login.jsx';
import AccountTypeScreen from './components/AccountType/AccountType.jsx';
import Home from './components/Home/Home.jsx';
import PrivacyPolicyScreen from './components/PrivacyPolicy/PrivacyPolicy.jsx';

export const UserNavigation = [
    {
        name: 'Home',
        path: '/',
        component: Home,
    },
    {
        name: 'Statistics',
        path: '/statistics',
        component: StatisticsScreen,
    },
    {
        name: 'Profile',
        path: '/profile',
        component: Profile,
    },
    {
        name: 'Settings',
        path: '/settings',
        component: SettingsScreen,
    },
    {
        name: 'PasswordReset',
        path: '/passwordReset',
        component: PasswordReset,
    },
    {
        name: 'AccountType',
        path: '/accountType',
        component: AccountTypeScreen,
    },
];

export const GuestNavigation = [
    {
        name: 'Login',
        path: '/login',
        component: Login,
    },
    {
        name: 'SignUp',
        path: '/signUp',
        component: SignUp,
    },
    {
        name: 'PasswordReset',
        path: '/passwordReset',
        component: PasswordReset,
    },
    {
        name: 'AccountType',
        path: '/accountType',
        component: AccountTypeScreen,
    },
    {
        name: 'PrivacyPolicy',
        path: '/privacy-policy',
        component: PrivacyPolicyScreen,
    }
];

import SettingsScreen from './components/Settings/Settings.jsx';
import StatisticsScreen from './components/Statistics/Statistics.jsx';
import Profile from './components/Profile/Profile.jsx';
import SignUp from './components/SignUp/SignUp.jsx';
import PasswordReset from './components/PasswordReset/PasswordReset.jsx';
import Login from './components/Login/Login.jsx';
import Home from './components/Home/Home.jsx';
import PolicyPage from './components/PolicyPage/PolicyPage.jsx';
import LandingPage from './components/LandingPage/LandingPage.jsx';
import AboutUs from './components/AboutUs/AboutUs.jsx';
import ContactUs from './components/ContactUs/ContactUs.jsx';
import React from "react";

// Function-based approach to return JSX elements
const createElement = (Component) => React.createElement(Component);

// export const UserNavigation = [
//     {
//         name: 'Home',
//         path: '/',
//         element: createElement(Home),
//     },
//     {
//         name: 'Statistics',
//         path: '/statistics',
//         element: createElement(StatisticsScreen),
//     },
//     {
//         name: 'Profile',
//         path: '/profile',
//         element: createElement(Profile),
//     },
//     {
//         name: 'Settings',
//         path: '/settings',
//         element: createElement(SettingsScreen),
//     },
//     {
//         name: 'Password Reset',
//         path: '/passwordReset',
//         element: createElement(PasswordReset),
//     },
//     {
//         name: "About Us",
//         path: '/about',
//         element: createElement(AboutUs)
//     },
//     {
//         name: "Contact Us",
//         path: '/contact',
//         element: createElement(ContactUs)
//     }
// ];

export const GuestNavigation = [
    {
        name: 'LandingPage',
        path: '/',
        element: createElement(LandingPage),
    },
    // {
    //     name: 'Login',
    //     path: '/login',
    //     element: createElement(Login),
    // },
    // {
    //     name: 'Sign Up',
    //     path: '/signUp',
    //     element: createElement(SignUp),
    // },
    // {
    //     name: 'Password Reset',
    //     path: '/passwordReset',
    //     element: createElement(PasswordReset),
    // },
    {
        name: 'Policy Page',
        path: '/policyPage',
        element: createElement(PolicyPage),
    },
    {
        name: "About Us",
        path: '/about',
        element: createElement(AboutUs)
    },
    {
        name: "Contact Us",
        path: '/contact',
        element: createElement(ContactUs)
    }
];

import React from 'react';
import { Route } from 'react-router-dom';
import { UserNavigation, GuestNavigation } from '../routes.js';

export const userStackScreen = () => {
    return UserNavigation.map((navigation) => {
        if (typeof navigation.component !== 'function') {
            console.error(`Component for ${navigation.name} is not valid.`);
            return null;
        }

        return (
            <Route
                key={navigation.name}
                path={navigation.path}
                element={React.createElement(navigation.component)}
            />
        );
    });
};

export const guestStackScreen = () => {
    return GuestNavigation.map((navigation) => {
        if (typeof navigation.component !== 'function') {
            console.error(`Component for ${navigation.name} is not valid.`);
            return null;
        }

        return (
            <Route
                key={navigation.name}
                path={navigation.path}
                element={React.createElement(navigation.component)}
            />
        );
    });
};

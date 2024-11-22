import React from 'react';
import { Route } from 'react-router-dom';
import { GuestNavigation } from '../routes.js';

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

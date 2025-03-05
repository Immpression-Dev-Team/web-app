import { Route } from 'react-router-dom';
import { /*UserNavigation*/ GuestNavigation } from '../routes.js';

// export const userStackScreen = () => {
//     console.log("User Routes: ", UserNavigation); // Debug log
//
//     return UserNavigation.map((navigation) => {
//         console.log(`Registering Route: ${navigation.path}`); // Debug log
//         return <Route key={navigation.name} path={navigation.path} element={navigation.element} />;
//     });
// };

export const guestStackScreen = () => {

    return GuestNavigation.map((navigation) => {
        return <Route key={navigation.name} path={navigation.path} element={navigation.element} />;
    });
};

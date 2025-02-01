import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router';

import { UserContext } from '@/contexts/userContext';

export default function PrivateRoute() {
    const { user } = useContext(UserContext);

    return user ? <Outlet /> : <Navigate to="/login" />;
}

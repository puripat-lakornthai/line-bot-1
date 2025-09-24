// client/src/routes/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { currentUser, isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div className="page-container" style={{textAlign: 'center', paddingTop: '50px'}}>Loading authentication status...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && (!currentUser || !allowedRoles.includes(currentUser.role))) {
    console.warn(`User role ${currentUser?.role} not in allowed roles: ${allowedRoles.join(', ')} for ${location.pathname}`);
    let defaultPath = '/my-tickets';
    if (currentUser?.role === 'admin') defaultPath = '/admin/dashboard';
    else if (currentUser?.role === 'staff') defaultPath = '/staff/dashboard';

    return <Navigate to={defaultPath} state={{ unauthorizedFrom: location.pathname }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
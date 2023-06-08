import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRouteAdmin = ({ user, redirectPath = '/', children }) => {
  if (user && user.roles !== undefined && user.roles.includes('super_admin')) {
    return children ? children : <Outlet />;
  }
  return <Navigate to={redirectPath} replace />;
};

export default ProtectedRouteAdmin;
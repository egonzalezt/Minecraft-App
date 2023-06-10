import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRouteUser = ({ user, redirectPath = '/', children }) => {
  if (user && user.roles !== undefined && user.roles.includes('user')) {
    return children ? children : <Outlet />;
  }
  return <Navigate to={redirectPath} replace />;
};

export default ProtectedRouteUser;
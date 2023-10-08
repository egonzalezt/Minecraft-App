import { Navigate, useRoutes } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import Main from './pages/main';
import NotFound from './pages/notFound';
import Admin from './pages/admin';
import AdminUpload from './pages/uploadMod';
import AdminUploadMultiple from './pages/uploadMods';
import ServerStatus from './pages/serverStatus';
import Login from './pages/login';
import SignUp from './pages/signup';
import User from './pages/user';
import RunCommand from './pages/runCommand';
import Backups from './pages/backups';
import PasswordReset from './pages/passwordReset';
import RequestPasswordReset from './pages/requestPasswordReset';
import CodeEditor from './pages/codeEditor';
import ModsSettingsView from './pages/modsSettings';
import ModSettingsView from './pages/modSettings';
import DashboardLayout from './components/Layout/dashboardLayout';
import Server from './pages/server'
import Test from './pages/test'
export default function Router({ user, setIsRoutesReady, isRoutesReady }) {
    const isSuperAdmin = user && user.roles.includes('super_admin');
    const isAdmin = user && user.roles.includes('admin');

    const superAdminRoutes = [
        { element: <Navigate to="/dashboard/admin" />, index: true },
        { path: 'admin', element: <Admin /> },
        { path: 'mods', element: <User /> },
        { path: 'upload', element: <AdminUpload /> },
        { path: 'upload/multiple', element: <AdminUploadMultiple /> },
        { path: 'server', element: <Server /> },
        { path: 'server/terminal', element: <RunCommand /> },
        { path: 'backups', element: <Backups /> },
        { path: 'edit/server', element: <CodeEditor /> },
        { path: 'edit/mods', element: <ModsSettingsView /> },
        { path: 'edit/mod', element: <ModSettingsView /> },
    ];

    const adminRoutes = [
        { element: <Navigate to="/dashboard/mods" />, index: true },
        { path: 'mods', element: <User /> },
        { path: 'server/terminal', element: <RunCommand /> },
    ];

    const userRoutes = [
        { element: <Navigate to="/dashboard/mods" />, index: true },
        { path: 'mods', element: <User /> },
    ];

    const [permittedRoutes, setPermittedRoutes] = useState([]);

    useEffect(() => {
        if (isSuperAdmin) {
            setPermittedRoutes(superAdminRoutes);
        } else if (isAdmin) {
            setPermittedRoutes(adminRoutes);
        }
        else{
            setPermittedRoutes(userRoutes);
        }
        setIsRoutesReady(true);
    }, []);

    const routes = useRoutes([
        {
            path: '/',
            element: <div className="grass"><Main /></div>,
            fallback: <Navigate to="/404" />,
        },
        {
            path: '/dashboard',
            element: <DashboardLayout user={user} isAdmin={isAdmin} />,
            children: permittedRoutes,
        },
        {
            path: 'test',
            element: <div className="grass"><Test /></div>,
        },
        {
            path: 'login',
            element: <div className="grass"><Login /></div>,
        },
        {
            path: 'requestpasswordreset',
            element: <div className="grass"><RequestPasswordReset /></div>,
        },
        {
            path: 'passwordreset',
            element: <div className="grass"><PasswordReset /></div>,
        },
        {
            path: 'signup',
            element: <div className="grass"><SignUp /></div>,
        },
        {
            path: 'status',
            element: <div className="grass"><ServerStatus /></div>,
        },
        {
            path: '404',
            element: <NotFound />,
        },
        {
            path: '*',
            element: <NotFound to="/404" replace />,
        },
    ]);

    return isRoutesReady ? routes : null;
}
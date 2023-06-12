import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import ProtectedRouteAdmin from './components/router/protectedRouteAdmin';
import ProtectedRouteUser from './components/router/protectedRouteUser';
//
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
// ----------------------------------------------------------------------

export default function Router({ user }) {
    const routes = useRoutes([
        {
            path: '/',
            element: <div className="grass"><Main /></div>,
            fallback: <Navigate to="/404" />
        },
        {
            path: '/dashboard',
            element: <DashboardLayout user={user} isAdmin={true} />,
            children: [
                { element: <Navigate to="/dashboard/admin" />, index: true },
                { path: 'admin', element: <Admin /> },
                { path: 'download/mods', element: <User /> },
                { path: 'upload', element: <AdminUpload /> },
                { path: 'upload/multiple', element: <AdminUploadMultiple /> },
                { path: 'server', element: <RunCommand /> },
                { path: 'backups', element: <Backups /> },
                { path: 'edit/server', element: <CodeEditor /> },
                { path: 'edit/mods', element: <ModsSettingsView /> },
                { path: 'edit/mod', element: <ModSettingsView /> },
            ],
        },
        {
            path: '/user',
            element: <DashboardLayout user={user} isAdmin={false} />,
            children: [
                { element: <Navigate to="/user/dashboard" />, index: true },
                { path: 'dashboard', element: <User /> },
            ],
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

    return routes;
}

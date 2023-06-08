import './App.css';

import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';

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
import UserApi from './services/users';
import { SnackbarProvider } from 'notistack';

import ProtectedRouteAdmin from './components/router/protectedRouteAdmin';
import ProtectedRouteUser from './components/router/protectedRouteUser';

let theme = createTheme({
  typography: {
    fontFamily: 'Minecraft',
    h1: {
      fontFamily: 'Minecrafter',
      fontSize: '60px',
    },
    h2: {
      fontFamily: 'Minecrafter',
      fontSize: '40px',
    },
    h3: {
      fontFamily: 'Minecrafter',
      fontSize: '20px',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundImage: `url(${"../img/sign.png"})`,
          backgroundSize: '128px 55px',
          height: '55px',
          width: '128px',
          fontFamily: 'Minecraft',
          fontSize: '16px',
          border: 'black',
          textShadow: 'none',
          textDecoration: 'none',
          color: 'black',
          '&:hover': {
            MozBoxShadow: '0 0 15px #ccc',
            WebkitBoxShadow: '0 0 15px #ccc',
            boxShadow: '0 0 15px #ccc',
          },
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

function App() {
  const [userLoaded, setUserLoaded] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUserLoaded(false);
    if (localStorage.getItem('accessToken')) {
      UserApi.verify()
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => setUser(null))
        .finally(() => setUserLoaded(true));
    } else {
      setUser(null);
      setUserLoaded(true);
    }
  }, []);

  if (!userLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <SnackbarProvider>
      <ThemeProvider theme={theme}>
        <div className="App">
          <Routes>
            <Route
              index
              element={
                <div className="grass">
                  <Main />
                </div>
              }
              fallback={<Navigate to="/404" />}
            />
            <Route path="status" element={<div className="grass"><ServerStatus /></div>} />
            <Route path="login" element={<div className="grass"><Login /></div>} />
            <Route path="signup" element={<div className="grass"><SignUp /></div>} />
            <Route path="requestpasswordreset" element={<div className="grass"><RequestPasswordReset /></div>} />
            <Route path="passwordreset" element={<div className="grass"><PasswordReset /></div>} />
            <Route element={<ProtectedRouteAdmin user={user} />}>
              <Route path="admin" element={<Admin />} />
              <Route path="admin/upload" element={<AdminUpload />} />
              <Route path="admin/upload/multiple" element={<AdminUploadMultiple />} />
              <Route path="admin/server" element={<RunCommand />} />
              <Route path="admin/backups" element={<Backups />} />
            </Route>
            <Route element={<ProtectedRouteUser user={user} />}>
              <Route path="user" element={<User />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </ThemeProvider>
    </SnackbarProvider>
  );
}

export default App;
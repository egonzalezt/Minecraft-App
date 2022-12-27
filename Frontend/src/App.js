import './App.css';

import React from 'react';
import {
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { ThemeProvider, createTheme, responsiveFontSizes} from '@mui/material/styles';

import Main from './pages/main';
import NotFound from './pages/notFound';
import Admin from './pages/admin';
import AdminUpload from './pages/uploadMod';
import ServerStatus from './pages/serverStatus';
import Login from './pages/login'
import SignUp from './pages/signup'
import User from './pages/user'
import { storeData } from './states/stores';

let theme = createTheme({
  typography: {
    fontFamily: 'Minecraft',
    h1: {
      fontFamily: 'Minecrafter',
      fontSize: "60px",
    },
    h2: {
      fontFamily: 'Minecrafter',
      fontSize: "40px",
    },
    h3: {
      fontFamily: 'Minecrafter',
      fontSize: "20px",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundImage: `url(${"../img/sign.png"})`,
          backgroundSize: "128px 55px",
          height: "55px",
          width: "128px",
          fontFamily: "Minecraft",
          fontSize: "16px",
          border: "black",
          textShadow: "none",
          textDecoration: 'none',
          color: "black",
          '&:hover': {
            MozBoxShadow: "0 0 15px #ccc",
            WebkitBoxShadow: "0 0 15px #ccc",
            boxShadow: "0 0 15px #ccc",
          }
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

theme = responsiveFontSizes(theme);

const ProtectedRouteAdmin = ({
  user,
  redirectPath = '/',
  children,
}) => {
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }else if(user.roles !== undefined){
    if(user.roles.find(role => role === "super_admin")){
      return children ? children : <Outlet />;
    }
  }
  return <Navigate to={redirectPath} replace />;
};

const ProtectedRouteUser = ({
  user,
  redirectPath = '/',
  children,
}) => {
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }else if(user.roles !== undefined){
    if(user.roles.find(role => role === "user")){
      return children ? children : <Outlet />;
    }
  }
  return <Navigate to={redirectPath} replace />;
};

function App() {
  const getUser = storeData(state => state.user);

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Routes>
          <Route index element={<div className="grass"><Main /></div>}></Route>
          <Route path="status" element={<div className="grass"><ServerStatus /></div>} />
          <Route path="login" element={<div className="grass"><Login /></div>} />
          <Route path="signup" element={<div className="grass"><SignUp /></div>} />
          <Route element={<ProtectedRouteAdmin user={getUser} />}>
            <Route path="admin" element={<Admin />} />
            <Route path="admin/upload" element={<AdminUpload />}></Route>
          </Route>
          <Route element={<ProtectedRouteUser user={getUser} />}>
            <Route path="user" element={<User />} />
          </Route>
          <Route path='*' element={<NotFound />}></Route>
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;

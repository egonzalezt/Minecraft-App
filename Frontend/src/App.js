import './App.css';

import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import UserApi from './services/users';
import { SnackbarProvider } from 'notistack';

import Router from './routes';


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
          <Router/>
        </div>
      </ThemeProvider>
    </SnackbarProvider>
  );
}

export default App;
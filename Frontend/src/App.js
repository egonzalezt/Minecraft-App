import './App.css';

import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import UserApi from './services/users';
import { SnackbarProvider } from 'notistack';

import signButton from './img/sign.png';

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
          backgroundImage: `url(${signButton})`,
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

const avatars = ["alex", "cave-spider", "cow", "creeper", "enderman", "pig", "sheep",
  "skeleton", "spider", "steve", "villager", "wolf", "zombie"]

function App() {
  const [userLoaded, setUserLoaded] = useState(false);

  const [user, setUser] = useState(null);
  const [isRoutesReady, setIsRoutesReady] = useState(false);

  useEffect(() => {
    setUserLoaded(false);
    if (localStorage.getItem('accessToken')) {
      UserApi.verify()
        .then((res) => {
          const data = res.data;
          data.imageName = avatars[Math.floor(Math.random() * avatars.length)];
          setUser(res.data);
        })
        .catch(() => setUser(null))
        .finally(() => setUserLoaded(true));
    } else {
      setUser(null);
      setUserLoaded(true);
    }
  }, []);

  if (!userLoaded && !isRoutesReady) {
    return <div>Loading...</div>;
  }

  return (
    <SnackbarProvider>
      <ThemeProvider theme={theme}>
        <div className="App">
          <Router user={user}
            setIsRoutesReady={setIsRoutesReady}
            isRoutesReady={isRoutesReady} />
        </div>
      </ThemeProvider>
    </SnackbarProvider>
  );
}

export default App;
import './App.css';

import { Routes, Route } from "react-router-dom"
import { ThemeProvider, createTheme } from '@mui/material/styles';

import Main from './pages/main';
import NotFound from './pages/notFound';
import Admin from './pages/admin';
import AdminUpload from './pages/uploadMod';
import ServerStatus from './pages/serverStatus';

const theme = createTheme({
  typography: {
    fontFamily: 'Minecraft',
    h1: {
      fontFamily: 'Minecrafter',
      fontSize: "70px",
    },
    h2: {
      fontFamily: 'Minecrafter',
      fontSize: "45px",
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Routes>
          <Route index element={<div className="grass"><Main /></div>}></Route>
          <Route path="status" element={<div className="grass"><ServerStatus /></div>} />
          <Route path="admin" element={<Admin />} />
          <Route path="admin/upload" element={<AdminUpload />}></Route>
          <Route path='*' element={<NotFound />}></Route>
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;

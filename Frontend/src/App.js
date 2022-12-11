import './App.css';

import { Routes, Route } from "react-router-dom"
import { ThemeProvider, createTheme } from '@mui/material/styles';

import Main from './pages/main';
import Header from './components/header';
import Footer from './components/footer';
import NavBar from './components/navBar';

const theme = createTheme({
  typography: {
    "fontFamily": 'Minecraft',
    h1: {
      "fontFamily": 'Minecrafter',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root:{
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
            "-moz-box-shadow": "0 0 15px #ccc",
            "-webkit-box-shadow": "0 0 15px #ccc",
            "box-shadow": "0 0 15px #ccc",
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
        <NavBar />
        <Header />
        <Routes>
          {/* <Route path='*' element={<NotFound />}></Route> */}
          <Route path="/" element={<Main />}></Route>
        </Routes>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;

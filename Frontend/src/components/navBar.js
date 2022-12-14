import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

import { ReactComponent as Logo } from '../kirb.svg';

function NavBar() {
  return (
    <AppBar position="static" style={{ background: 'transparent', boxShadow: 'none'}}>
      <Toolbar>
        <Stack direction="row" width="100%" spacing={2} padding={2} justifyContent="space-between" alignItems="center">
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={2}>
            <Link to={"/"}>
              <Logo width="125" height="125" />
            </Link>
            <Link to={"/"} style={{ textDecoration: 'none', color: "white" }}>
              <Typography variant='h1'>
                aREQUIPET
              </Typography>
            </Link>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={2}>
            <Button fullWidth component={Link} to={"/players"}>Jugadores</Button>
            <Button fullWidth component={Link} to={"/about"}>Nosotros</Button>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { ReactComponent as Logo } from '../kirb.svg';
import { storeData } from '../states/stores';
import UserApi from '../services/users';
import logo from '../img/minecraft_logo.png';
function NavBar() {
  const getUser = storeData(state => state.user);
  const addUser = storeData(state => state.addUser);
  const [roles, setRoles] = useState([]);
  const [anchorEl, setAnchorEl] =useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const deleteTokens = () => {
    localStorage.setItem('accessToken', "");
    localStorage.setItem('refreshToken', "");
    window.location.reload();
    setAnchorEl(null);
  }
  const handleLogOut = () => {
    UserApi.logOut().then((res)=>{
      deleteTokens()
    }).catch(()=>{
      deleteTokens()
    });
  };
  useEffect(() => {
    UserApi.verify().then(res => {
      addUser(res.data);
      setRoles(res.data.roles)
    }).catch(() => {
      addUser(null);
      setRoles([]);
    })
  }, [addUser]);

  return (
    <AppBar position="static" style={{ background: 'transparent', boxShadow: 'none' }}>
      <Toolbar>
        <Stack direction="row" width="100%" spacing={2} padding={2} justifyContent="space-between" alignItems="center">
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={2}>
            <Link to={"/"}>
              <Logo width="125" height="125" />
            </Link>
            <Link to={"/"} style={{ textDecoration: 'none', color: "white" }}>
              <Typography variant='h1'>
                AREQUIPET
              </Typography>
            </Link>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={2}>
            <Button fullWidth component={Link} to={"/status"}>Server</Button>
            {getUser == null ?
              <Button fullWidth component={Link} to={"/login"}>Login</Button>
              :
              <>
                {roles.find(role => role === "user") ?
                  <Button fullWidth component={Link} to={"/user"}>User</Button>
                  :
                  <></>
                }
                {roles.find(role => role === "super_admin") ?
                  <Button fullWidth component={Link} to={"/admin"}>Admin</Button>
                  :
                  <></>
                }
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <Avatar alt="Minecraft Icon" src={logo} />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleLogOut}>LogOut</MenuItem>
                </Menu>
              </>
            }
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
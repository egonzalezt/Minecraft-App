import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';
// states
import { storeData } from '../../../states/stores';
// api
import UserApi from '../../../services/users';
import { useTranslation } from 'react-i18next';
// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const [user, setUser] = useState({ nickName: "Kirb", email: "kirb@vasitos.com" });
  const { t } = useTranslation();

  const MENU_OPTIONS = [
    {
      label: t("commons.home"),
      url: '/',
      icon: 'eva:home-fill',
    },
  ];
  const getUser = storeData(state => state.user);
  const navigate = useNavigate();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const deleteTokens = () => {
    localStorage.setItem('accessToken', "");
    localStorage.setItem('refreshToken', "");
    navigate('/')
    setOpen(null);
  }

  const handleLogOut = () => {
    UserApi.logOut().then((res) => {
      deleteTokens();
    }).catch(() => {
      deleteTokens();
    });
  };

  const handleMenuItemClick = (url='/') => {
    handleClose();
    navigate(url)
  };

  useEffect(() => {
    if (getUser) {
      setUser(getUser);
    }
  }, [getUser]);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={`/assets/images/maincra-icons/${user.imageName}.svg`} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        {user && (
          <Box sx={{ my: 1.5, px: 2.5 }}>
            <Typography variant="subtitle2" noWrap>
              {user.nickName}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {user.email}
            </Typography>
          </Box>
        )}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={() => handleMenuItemClick(option.url)}> {/* Call handleMenuItemClick with the URL */}
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogOut} sx={{ m: 1 }}>
          {t("commons.logout")}
        </MenuItem>
      </Popover>
    </>
  );
}

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Drawer, Typography, Avatar, Stack } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Logo from '../logo';
import Scrollbar from '../scrollbar';
import NavSection from '../nav-section';
// States
import SocketClient from '../../../socketConnection'
//
import { adminNavConfig, userNavConfig } from './config';
import { storeData } from '../../../states/stores';
// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const { pathname } = useLocation();
  const [user, setUser] = useState({ nickName: "Kirb", email: "kirb@vasitos.com" });
  const [loading, setLoading] = useState(true);
  const [navConfig, setNavConfig] = useState(userNavConfig);
  const [socket, setSocket] = useState(null);
  const [serverPingResult, setServerPingResult] = useState(null);

  const getUser = storeData(state => state.user);

  const isDesktop = useResponsive('up', 'lg');

  const initializeSocket = () => {
    const newSocket = SocketClient;
    setSocket(newSocket);
  };

  useEffect(() => {
    initializeSocket();

    return () => {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    };
  }, []);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on('tcpPingResult', (data) => {
      setServerPingResult(data)
    });

    return () => {
      socket.off('tcpPingResult');
    };
  }, [socket]);

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    setLoading(true);
    if (getUser) {
      setUser(getUser)
      const roles = getUser.roles
      if (roles?.includes('super_admin')) {
        setNavConfig(adminNavConfig);
      }
      setLoading(false);
    }
  }, [getUser]);

  const renderContent = (
    <Scrollbar
      sx={{
        backgroundImage: `url(${"../img/stones.jpg"})`,
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Logo redirectUrl={"/dashboard/admin"} />
        <Typography variant="h5" component="span" sx={{ marginLeft: '0.5rem', color: 'white' }}>
          Arequipet
        </Typography>
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none">
          <StyledAccount>
            <Avatar src={`/assets/images/maincra-icons/${user.imageName}.svg`} alt="photoURL" />

            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'white' }}>
                {user.nickName}
              </Typography>
            </Box>
          </StyledAccount>
        </Link>
      </Box>

      {!loading && (<NavSection data={navConfig} />)}

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ px: 2.5, pb: 3, mt: 15 }}>
        <Stack alignItems="center" spacing={3} sx={{ pt: 5, borderRadius: 2, position: 'relative' }}>
          <Box
            component="img"
            src="/assets/images/Alex_Fighter.webp"
            sx={{ width: 100, position: 'absolute', top: -100 }}
          />

          <Box sx={{ textAlign: 'center' }}>
            <Typography gutterBottom variant="h6" sx={{ color: 'white' }}>
              Listo Para Jugar?
            </Typography>
          </Box>
        </Stack>
      </Box>

      {serverPingResult &&
        (<Box sx={{ px: 2.5, pb: 3, mt: 15 }}>
          <Typography gutterBottom variant="h6" sx={{ color: 'white' }}>
            Estado del servidor
          </Typography>
          <Typography gutterBottom variant="h6" sx={{ color: 'white' }}>
            <FiberManualRecordIcon
              fontSize="small"
              sx={{
                mr: 1,
                color: serverPingResult?.isAvailable ? '#4caf50' : '#d9182e',
              }}
            />
            {serverPingResult?.message}
          </Typography>
        </Box>)
      }
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
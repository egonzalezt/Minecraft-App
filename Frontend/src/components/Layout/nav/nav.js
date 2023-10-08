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
import NavSection from '../nav-section/NavSection';
// States
import SocketClient from '../../../socketConnection'
import { storeSkin } from '../../../states/skinStore';
//
import { storeData } from '../../../states/stores';
import { enqueueSnackbar } from 'notistack';
import SkinRenderer from '../../Skinview3D/skinRenderer';
import skinDefault from '../../../img/rei.png'
import users from '../../../services/users';
//Icons
import FileOpenIcon from '@mui/icons-material/FileOpen';
import PrecisionManufacturingRoundedIcon from '@mui/icons-material/PrecisionManufacturingRounded';
import QueueIcon from '@mui/icons-material/Queue';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CodeIcon from '@mui/icons-material/Code';
import TerminalIcon from '@mui/icons-material/Terminal';
import BackupIcon from '@mui/icons-material/Backup';
import SettingsIcon from '@mui/icons-material/Settings';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import ServerIcon from '@mui/icons-material/Dns';

import stoneBackground from '../../../img/stones.jpg'
// I28S
import { useTranslation } from 'react-i18next';
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

const media = ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png', '8.png', '9.png',
  '10.png', '11.png', '12.png', '13.png', '14.png', '15.png', '16.png', '17.png', '18.gif']

export default function Nav({ openNav, onCloseNav }) {
  const { t, i18n } = useTranslation(); // Use i18n from react-i18next
  const { pathname } = useLocation();
  const [user, setUser] = useState({ nickName: "Kirb", email: "kirb@vasitos.com" });
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [serverPingResult, setServerPingResult] = useState(null);
  const [navbarImage, setNavbarImage] = useState(null);
  const [skinData, setSkinData] = useState(skinDefault);
  const [animation, setAnimation] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [showSkin, setShowSkin] = useState(false);
  const [navConfig, setNavConfig] = useState([]);
  const getUser = storeData(state => state.user);
  const getAnimation = storeSkin(state => state.animation);
  const getSpeed = storeSkin(state => state.speed);
  const isDesktop = useResponsive('up', 'lg');

  const initializeSocket = () => {
    const newSocket = SocketClient;
    setSocket(newSocket);
  };
  
  useEffect(() => {
    const languageChangeHandler = () => {
      if (getUser) {
        setUser(getUser)
        const roles = getUser.roles
        if (roles?.includes('super_admin')) {
          setSuperAdminNav();
        } else if (roles?.includes('admin')) {
          setAdminNav();
        }else{
          setUserNav();
        }
      }
    };

    i18n.on('languageChanged', languageChangeHandler);

    return () => {
      i18n.off('languageChanged', languageChangeHandler);
    };
  }, [i18n]);

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
    if(getAnimation){
      setAnimation(getAnimation)
    }
  }, [getAnimation]);
  useEffect(() => {
    if(getSpeed){
      setSpeed(getSpeed)
    }
  }, [getSpeed]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on('tcpPingResult', (data) => {
      setServerPingResult(data)
    });

    socket.on('disconnect', () => {
      enqueueSnackbar(t("socketServerConnectionLost"), { variant: 'warning' });
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

  function setSuperAdminNav(){
    let superAdminConf = [
      {
        title: t("navBar.mods.main"),
        path: '/dashboard/admin',
        icon: <PrecisionManufacturingRoundedIcon />,
        subItems: [
          {
            title: t("navBar.mods.add"),
            path: '/dashboard/upload',
            icon: <UploadFileIcon />,
          },
          {
            title: t("navBar.mods.addMultiple"),
            path: '/dashboard/upload/multiple',
            icon: <QueueIcon />,
          },
          {
            title: t("navBar.mods.download"),
            path: '/dashboard/mods',
            icon: <CloudDownloadIcon />,
          }
        ],
      },
      {
        title: t("navBar.configuration.main"),
        path: '/dashboard/admin',
        icon: <SettingsIcon />,
        subItems: [
          {
            title: t("navBar.configuration.serverProperties"),
            path: '/dashboard/edit/server',
            icon: <CodeIcon />,
          },
          {
            title: t("navBar.configuration.modsProperties"),
            path: '/dashboard/edit/mods',
            icon: <FileOpenIcon />,
          }
        ],
      },

      {
        title: t("navBar.server.mainTitle"),
        path: '/dashboard/server',
        icon: <ServerIcon />,
        subItems: [
          {
            title: t("navBar.server.terminal"),
            path: '/dashboard/server/terminal',
            icon: <TerminalIcon />,
          },
        ],
      },
      {
        title: t("navBar.backups"),
        path: '/dashboard/backups',
        icon: <BackupIcon />,
      }
    ];
    setNavConfig(superAdminConf);
  }

  function setAdminNav(){
    const adminNavConfig = [
      {
        title: t("navBar.mods.main"),
        path: '/dashboard/mods',
        icon: <CloudDownloadIcon />,
      },
      {
        title: t("navBar.terminal"),
        path: '/dashboard/server/terminal',
        icon: <TerminalIcon />,
      }
    ];
    setNavConfig(adminNavConfig);
  }

  function setUserNav(){
    const userNavConfig = [
      {
        title: t("navBar.mods.main"),
        path: '/dashboard/mods',
        icon: <CloudDownloadIcon />,
      }
    ];
    setNavConfig(userNavConfig);
  }

  useEffect(() => {
    setLoading(true);
    if (getUser) {
      setUser(getUser)
      const roles = getUser.roles
      if (roles?.includes('super_admin')) {
        setSuperAdminNav();
      } else if (roles?.includes('admin')) {
        setAdminNav();
      }else{
        setUserNav();
      }
      setLoading(false);
    }
  }, [getUser]);

  useEffect(() => {
    const fetchSkin = async () => {
      try {
        const res = await users.getSkin();
        setSkinData(res.data.skinURL);
      } catch (error) {
        console.error('Error fetching player skin:', error);
      }
    };

    if(isDesktop)
    {
      fetchSkin();
    }
    setShowSkin(true)
  }, [user.nickName]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * media.length);
    const randomValue = media[randomIndex];
    setNavbarImage(`/assets/images/characters/${randomValue}`)
  }, []);

  const renderContent = (
    <Box
      sx={{
        backgroundImage: `url(${stoneBackground})`,
        height: '100%',
        overflowY: 'scroll',
        '& .simplebar-content': { display: 'flex', flexDirection: 'column' },
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

      <Box sx={{ px: 2.5, pb: 3, mt: isDesktop?5:15  }}>
        <Stack alignItems="center" spacing={3} sx={{ pt: 5, borderRadius: 2, position: 'relative' }}>

          {(isDesktop && skinData && showSkin) ?
            <SkinRenderer skinData={skinData} nameTag={user.nickName} animationType={animation} width={250} height={300} speed={speed}/>
            :
            <>
              {navbarImage ?
                <Box
                  component="img"
                  src={navbarImage}
                  sx={{ height: 150, position: 'absolute', top: -100 }}
                />
                :
                <Box
                  component="img"
                  src="/assets/images/Alex_Fighter.webp"
                  sx={{ width: 150, position: 'absolute', top: -100 }}
                />
              }
            </>
          }
          <Box sx={{ textAlign: 'center' }}>
            <Typography gutterBottom variant="h6" sx={{ color: 'white' }}>
              {t("navBar.readyToPlay")}
            </Typography>
            {serverPingResult &&
              (<Box>
                <Typography gutterBottom variant="h6" sx={{ color: 'white' }}>
                  {t("navBar.serverStatus")}
                </Typography>
                <Typography gutterBottom variant="h6" sx={{ color: 'white' }}>
                  <FiberManualRecordIcon
                    fontSize="small"
                    sx={{
                      mr: 1,
                      color: serverPingResult?.isAvailable ? '#4caf50' : '#d9182e',
                    }}
                  />
                  {serverPingResult?.isAvailable ? t("commons.available") : t("commons.notAvailable")}
                </Typography>
              </Box>)
            }
          </Box>
        </Stack>
      </Box>
    </Box>
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
              borderRightStyle: 'dashed'
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
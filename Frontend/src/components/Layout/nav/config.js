import FileOpenIcon from '@mui/icons-material/FileOpen';
import PrecisionManufacturingRoundedIcon from '@mui/icons-material/PrecisionManufacturingRounded';
import QueueIcon from '@mui/icons-material/Queue';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CodeIcon from '@mui/icons-material/Code';
import TerminalIcon from '@mui/icons-material/Terminal';
import BackupIcon from '@mui/icons-material/Backup';
import SettingsIcon from '@mui/icons-material/Settings';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

export const adminNavConfig = [
  {
    title: 'Mods',
    path: '/dashboard/admin',
    icon: <PrecisionManufacturingRoundedIcon/>,
    subItems: [
      {
        title: 'Agregar',
        path: '/dashboard/upload',
        icon: <UploadFileIcon/>,
      },
      {
        title: 'Agregar multiple',
        path: '/dashboard/upload/multiple',
        icon: <QueueIcon/>,
      },
      {
        title: 'Descargar mods',
        path: '/dashboard/download/mods',
        icon: <CloudDownloadIcon/>,
      }
    ],
  },
  {
    title: 'Configuracion',
    path: '/dashboard/admin',
    icon: <SettingsIcon/>,
    subItems: [
      {
        title: 'Server.properties',
        path: '/dashboard/edit/server',
        icon: <CodeIcon/>,
      },
      {
        title: 'Mods properties',
        path: '/dashboard/edit/mods',
        icon: <FileOpenIcon/>,
      }
    ],
  },
  {
    title: 'Terminal',
    path: '/dashboard/server',
    icon: <TerminalIcon/>,
  },
  {
    title: 'Backups',
    path: '/dashboard/backups',
    icon: <BackupIcon/>,
  }
];

export const userNavConfig = [
  {
    title: 'Mods',
    path: '/user/dashboard',
    icon: <CloudDownloadIcon/>,
  }
];
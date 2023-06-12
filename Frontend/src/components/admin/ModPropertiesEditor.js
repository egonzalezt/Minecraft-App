import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import CircularProgress from '@mui/material/CircularProgress';
import AceEditor from 'react-ace';
import admin from '../../services/admin';
import { enqueueSnackbar } from 'notistack';
import { useLocation, Link } from 'react-router-dom';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box'; // Import Box component from Mui
import Container from '@mui/material/Container'; // Import Container component from Mui

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-text';
import 'ace-builds/src-noconflict/mode-toml';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-monokai';

function EditModProperties() {
  const [fileContent, setFileContent] = useState(null);
  const [loadingGetData, setLoadingGetData] = useState(true);
  const [loadingSendData, setLoadingSendData] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const path = searchParams.get('dir');
  const filename = searchParams.get('name');

  const getFileMode = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    switch (extension) {
      case 'json':
        return 'json';
      case 'json5':
        return 'json5';
      case 'jsonc':
        return 'jsonc';
      case 'toml':
        return 'toml';
      case 'xml':
        return 'xml';
      case 'yml':
      case 'yaml':
        return 'yaml';
      default:
        return 'text';
    }
  };

  useEffect(() => {
    if (path) {
      setLoadingGetData(true);

      admin
        .getModProperties(path)
        .then((response) => {
          const responseData = response.data;
          if (getFileMode(filename) === 'json') {
            setFileContent(JSON.stringify(responseData, null, 2));
            return;
          }
          setFileContent(responseData.toString());
        })
        .catch((error) => {
          enqueueSnackbar(`No se pudo obtener la configuracion`, { variant: 'error' });
        })
        .finally(() => {
          setLoadingGetData(false);
        });
    }
  }, [path]);

  const handleSave = () => {
    setLoadingSendData(true);

    admin
      .updateModProperties(filename, path, fileContent)
      .then(() => {
        enqueueSnackbar(`server.properties actualizado de forma exitosa`, { variant: 'success' });
      })
      .catch((error) => {
        enqueueSnackbar(`Fallo la actualizacion de server.properties`, { variant: 'error' });
      })
      .finally(() => {
        setLoadingSendData(false); // Set loading state to false after sending data
      });
  };

  return (
    <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h2" gutterBottom>
        <IconButton component={Link} to={'/dashboard/edit/mods'}>
          <ArrowBackRoundedIcon />
        </IconButton>
        Editar {filename}
      </Typography>
      {loadingGetData ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress />
          <Typography variant="body1">Obteniendo datos...</Typography>
        </Box>
      ) : (
        <AceEditor
          mode={getFileMode(filename)}
          theme="monokai"
          name="file-editor"
          editorProps={{ $blockScrolling: true }}
          value={fileContent}
          onChange={(newValue) => {
            setFileContent(newValue);
          }}
          style={{ height: '70vh', width: '40vw', fontSize: '20px' }}
          highlightActiveLine={true}
          setOptions={{
            showLineNumbers: true,
            tabSize: 2,
          }}
          readOnly={loadingSendData}
        />
      )}
      <LoadingButton
        color="secondary"
        onClick={handleSave}
        loading={loadingSendData}
        loadingPosition="start"
        startIcon={<SaveIcon />}
        variant="contained"
        disableElevation
        disabled={loadingSendData}
      >
        {loadingSendData ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          'Subir'
        )}
      </LoadingButton>
    </Container>
  );
}

export default EditModProperties;

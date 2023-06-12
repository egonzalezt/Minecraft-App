import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import CircularProgress from '@mui/material/CircularProgress';
import AceEditor from 'react-ace';
import admin from '../../services/admin';
import { enqueueSnackbar } from 'notistack';
import Container from '@mui/material/Container';

import 'ace-builds/src-noconflict/mode-text';
import 'ace-builds/src-noconflict/theme-monokai';

function EditProperties() {
  const [fileContent, setFileContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    admin.getServerProperties()
      .then(response => {
        setFileContent(response.data);
      })
      .catch(error => {
        enqueueSnackbar(`No se pudo obtener la configuracion`, { variant: 'error' });
      });
  }, []);

  const handleSave = () => {
    setLoading(true);

    admin.updateServerProperties(fileContent)
      .then(() => {
        enqueueSnackbar(`server.properties actualizado de forma exitosa`, { variant: 'success' });
      })
      .catch(error => {
        enqueueSnackbar(`Fallo la actualizacion de server.properties`, { variant: 'error' });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h2" gutterBottom>
        Editar server.properties
      </Typography>
      <AceEditor
        mode="text"
        theme="monokai"
        name="file-editor"
        editorProps={{ $blockScrolling: true }}
        value={fileContent}
        onChange={(newValue) => {
          setFileContent(newValue);
        }}
        style={{ fontSize: '20px' }}
        highlightActiveLine={true}
        setOptions={{
          showLineNumbers: true,
          tabSize: 2,
        }}
        readOnly={loading} // Disable editing when loading is true
      />
      <LoadingButton
        color="secondary"
        onClick={handleSave}
        loading={loading}
        loadingPosition="start"
        startIcon={<SaveIcon />}
        variant="contained"
        disableElevation
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Subir'}
      </LoadingButton>
    </Container>
  );
}

export default EditProperties;

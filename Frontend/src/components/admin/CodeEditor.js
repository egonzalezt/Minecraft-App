import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import CircularProgress from '@mui/material/CircularProgress';
import AceEditor from 'react-ace';
import admin from '../../services/admin';
import { enqueueSnackbar } from 'notistack';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';

import 'ace-builds/src-noconflict/mode-text';
import 'ace-builds/src-noconflict/theme-monokai';

function EditProperties() {
  const [fileContent, setFileContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    admin.getServerProperties()
      .then(response => {
        setFileContent(response.data);
      })
      .catch(error => {
        enqueueSnackbar(t("modConfig.errors.retrieve"), { variant: 'error' });
      });
  }, []);

  const handleSave = () => {
    setLoading(true);

    admin.updateServerProperties(fileContent)
      .then(() => {
        enqueueSnackbar(t("modConfig.successful", { filename: "server.properties" }), { variant: 'success' });
      })
      .catch((error) => {
        enqueueSnackbar(t("modConfig.errors.update", { filename: "server.properties" }), { variant: 'error' });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Stack direction="column" justifyContent="space-between" alignItems="center" spacing={2}>
      <Typography variant="h2" gutterBottom>
        {t("serverProperties")}
      </Typography>
      <AceEditor
        width='95%'
        mode="text"
        theme="monokai"
        name="file-editor"
        editorProps={{ $blockScrolling: true }}
        value={fileContent}
        onChange={(newValue) => {
          setFileContent(newValue);
        }}
        fontSize={18}
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
        {loading ? <CircularProgress size={24} color="inherit" /> : t("commons.upload")}
      </LoadingButton>
    </Stack>
  );
}

export default EditProperties;

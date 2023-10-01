import React, { useState, useEffect } from 'react';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import admin from '../../services/admin';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

function ModsSettings() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await admin.getModsProperties();
        setData(response.data);
        setLoading(false);
      } catch (error) {
        // Handle error
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClick = (file) => {
    const query = `dir=${file.path}&name=${file.name}`
    navigate(`/dashboard/edit/mod?${query}`);
  };

  const renderData = (data) =>
    Object.keys(data).map((key) => {
      const value = data[key];
      if (Array.isArray(value)) {
        return (
          <TreeItem key={key} nodeId={key} label={key}>
            {value.map((file) => (
              <TreeItem
                key={file.path}
                nodeId={file}
                label={file}
                onClick={() => handleClick(file)}
              />
            ))}
          </TreeItem>
        );
      } else if (value.isFile) {
        return (
          <TreeItem
            key={key}
            nodeId={key}
            label={key}
            onClick={() => handleClick(value)}
          />
        );
      } else {
        return (
          <TreeItem key={key} nodeId={key} label={key} sx={{ borderBottom: 1 }}>
            {renderData(value)}
          </TreeItem>
        );
      }
    });


  return (
    <div>
      <Typography variant="h2" gutterBottom>
        {t("modConfig.title")}
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <div style={{ width: '80%', height: '80vh', margin: 'auto' }}>
          <TreeView
            aria-label="multi-select"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            multiSelect
            sx={{ height: '100%', flexGrow: 1, overflowY: 'auto', textAlign: 'start' }}
          >
            {data && renderData(data)}
          </TreeView>
        </div>
      )}
    </div>
  );
}

export default ModsSettings;
import React, { useState, useEffect } from 'react';
import AdminDrawer from './drawer';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import admin from '../../services/admin';
import { useNavigate } from "react-router-dom";

function ModsSettings() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await admin.getModsProperties();
        setData(response.data);
        setLoading(false);
      } catch (error) {
        // Handle error
        console.log('Error:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClick = (file) => {
    const query = `dir=${file.path}&name=${file.name}`
    navigate(`/admin/edit/mod?${query}`);
  };

  const renderTree = (data) => (
    <TreeItem key={data.name} nodeId={data.name} label={data.name}>
      {Array.isArray(data.children)
        ? data.children.map((child) => renderTree(child))
        : null}
    </TreeItem>
  );

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
          <TreeItem key={key} nodeId={key} label={key}>
            {renderData(value)}
          </TreeItem>
        );
      }
    });


  return (
    <AdminDrawer>
      <Typography variant="h2" gutterBottom>
        Editar configuracion de mods
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
            sx={{ height: '100%', flexGrow: 1, overflowY: 'auto' }}
          >
            {data && renderData(data)}
          </TreeView>
        </div>
      )}
    </AdminDrawer>
  );
}

export default ModsSettings;
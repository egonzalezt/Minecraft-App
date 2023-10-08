import React, { useState, useRef, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import Swal from 'sweetalert2';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ListItemButton from '@mui/material/ListItemButton';
import UploadModStatus from '../uploadModStatus';
import admin from '../../services/admin';
import { enqueueSnackbar } from 'notistack';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

function UploadMod() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const [open, setOpen] = useState(true);
    const [defaultType, setDefaultType] = useState('both');
    const [defaultVersion, setDefaultVersion] = useState('1.20.1');
    const [totalFiles, setTotalFiles] = useState(0);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleClick = () => {
        setOpen(!open);
    };

    const onButtonClick = () => {
        inputRef.current.click();
    };

    const createFileObject = (file) => {
        return {
            name: file.name,
            version: defaultVersion,
            isClientChecked: true,
            isServerChecked: true,
            customName: file.name.split('.jar')[0],
            file: file,
            status: t("commons.pending")
        };
    };

    const handleFileChange = async (event) => {
        const fileList = Array.from(event.target.files);
        const validFiles = fileList.filter((file) => file.name.endsWith('.jar'));

        if (validFiles.length === fileList.length) {
            const newFiles = [];
            const modsFileName = fileList.map((file) => file.name);

            try {
                const response = await admin.verifyIfModsExists(modsFileName);
                const modsResponse = response.data.mods;

                for (const file of validFiles) {
                    const alreadyAdded = modsResponse[file.name];
                    if (alreadyAdded) {
                        enqueueSnackbar(t("listMods.popUpDuplicateFile.text", { name: file.name }), { variant: 'warning' });
                    } else {
                        const isDuplicate = files.some((existingFile) => existingFile.name === file.name);
                        if (isDuplicate) {
                            enqueueSnackbar(t("listMods.popUpDuplicateFile.text", { name: file.name }), { variant: 'warning' });
                        } else {
                            newFiles.push(file);
                        }
                    }
                }

                const fileObjects = newFiles.map((file) => createFileObject(file));
                setFiles([...files, ...fileObjects]);
            } catch (error) {
                Swal.fire({
                    timer: 3000,
                    timerProgressBar: true,
                    icon: 'error',
                    title: t("commons.errors.genericMessage"),
                    text: t("uploadMultiple.errors.verifyMods"),
                });
            }
        } else {
            Swal.fire({
                timer: 3000,
                timerProgressBar: true,
                icon: 'warning',
                title: t("listMods.popUpBadFile.title"),
                text: t("listMods.popUpBadFile.text"),
            });
        }
    };

    const handleClientCheckboxChange = (checked, index) => {
        const updatedFiles = [...files];
        files[index].isClientChecked = checked;
        setFiles(updatedFiles);
    };

    const handleServerCheckboxChange = (checked, index) => {
        const updatedFiles = [...files];
        files[index].isServerChecked = checked;
        setFiles(updatedFiles);
    };

    const handleDeleteFile = (index) => {
        const updatedFiles = [...files];
        updatedFiles.splice(index, 1);
        setFiles(updatedFiles);
    };

    const handleCustomNameChange = (index, value) => {
        const updatedFiles = [...files];
        updatedFiles[index].customName = value;
        setFiles(updatedFiles);
    };

    const handleVersionChange = (index, value) => {
        const updatedFiles = [...files];
        updatedFiles[index].version = value;
        setFiles(updatedFiles);
    };

    const handleComponentFinish = (componentId, successUpload) => {
        setFiles(prevFiles => {
            return prevFiles.map(file => {
                if (file.id === componentId) {
                    if (successUpload) {
                        return {
                            ...file,
                            status: t("commons.complete")
                        };
                    } else {
                        return {
                            ...file,
                            status: t("commons.error")
                        };
                    }
                }
                return file;
            });
        });
        setTotalFiles(prevTotalFiles => prevTotalFiles - 1);
    };

    const handleUpload = async () => {
        setTotalFiles(files.length)
        setLoading(true);
    };

    const checkValue = (value) => {
        if (value === undefined) {
            return true
        }
        return value
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const fileList = Array.from(event.dataTransfer.files);
        const validFiles = fileList.filter((file) => file.name.endsWith('.jar'));
        if (validFiles.length === fileList.length) {
            const newFiles = validFiles.filter((file) => {
                const isDuplicate = files.some((existingFile) => existingFile.name === file.name);
                if (isDuplicate) {
                    Swal.fire({
                        timer: 3000,
                        timerProgressBar: true,
                        icon: 'warning',
                        title: t("listMods.popUpDuplicateFile.title"),
                        text: t("listMods.popUpDuplicateFile.text", { name: file.name })
                    });
                }
                return !isDuplicate;
            });

            setFiles([...files, ...newFiles]);
        } else {
            Swal.fire({
                timer: 3000,
                timerProgressBar: true,
                icon: 'warning',
                title: t("listMods.popUpBadFile.title"),
                text: t("listMods.popUpBadFile.text"),
            });
        }
    };

    const columns = [
        { field: 'id', headerName: t("uploadMultiple.table.id"), width: 70 },
        {
            field: 'customName',
            headerName: t("uploadMultiple.table.name"),
            flex: 1,
            renderCell: (params) => (
                <TextField
                    value={params.row.customName || params.row.name.split('.jar')[0]}
                    onChange={(event) => handleCustomNameChange(params.row.id, event.target.value)}
                    fullWidth
                />
            ),
        },
        { field: 'name', headerName: t("uploadMultiple.table.fileName"), flex: 1 },
        {
            field: 'version',
            headerName: t("uploadMultiple.table.version"),
            flex: 1,
            renderCell: (params) => (
                <TextField
                    value={params.row.version || ''}
                    onChange={(event) => handleVersionChange(params.row.id, event.target.value)}
                    fullWidth
                />
            ),
        },
        {
            field: 'client',
            headerName: t("commons.client"),
            width: 120,
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.isClientChecked}
                    onChange={(event) => handleClientCheckboxChange(event.target.checked, params.row.id)}
                    color="success"
                />
            ),
        },
        {
            field: 'server',
            headerName: t("commons.server"),
            width: 120,
            renderCell: (params) => (
                <Checkbox
                    checked={params.row.isServerChecked}
                    onChange={(event) => handleServerCheckboxChange(event.target.checked, params.row.id)}
                    color="success"
                />
            ),
        },
        {
            field: 'status',
            headerName: t("commons.status"),
            width: 120,
        },
        {
            field: 'actions',
            headerName: t("commons.delete"),
            width: 120,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    onClick={() => handleDeleteFile(params.row.id)}
                    startIcon={<DeleteIcon />}
                    style={{ backgroundColor: 'transparent' }}
                    disableElevation
                />
            ),
        },
    ];

    useEffect(() => {
        if (totalFiles <= 0 && loading) {
            setLoading(false);
            navigate(`/dashboard/admin`);
        }
    }, [totalFiles, loading]);

    function handleDefaultModTypeChange(event) {
        const newValue = event.target.value;

        const valueMap = {
            server: { isServerChecked: true, isClientChecked: false },
            client: { isServerChecked: false, isClientChecked: true },
            both: { isServerChecked: true, isClientChecked: true },
        };

        if (valueMap[newValue]) {
            setDefaultType(newValue);
            setFiles((prevFiles) => {
                return prevFiles.map((file) => ({
                    ...file,
                    ...valueMap[newValue],
                }));
            });
        }
    }

    function handleDefaultModVersionChange(event) {
        const newValue = event.target.value;
        setDefaultVersion(newValue);
        setFiles((prevFiles) =>
            prevFiles.map((file) => ({
                ...file,
                version: newValue,
            }))
        );
    }

    function CustomToolbar() {
        return files.length > 0 ? (
            <GridToolbarContainer sx={{ justifyContent: "space-between" }}>
                <Stack minWidth="20%">
                    <Typography variant="p">
                        {t("commons.defaultVariable", { variable: t("listMods.table.type") })}
                    </Typography>
                    <Select
                        id="select-mod-type"
                        value={defaultType}
                        onChange={handleDefaultModTypeChange}
                    >
                        <MenuItem value={"client"}>{t("commons.client")}</MenuItem>
                        <MenuItem value={"server"}>{t("commons.server")}</MenuItem>
                        <MenuItem value={"both"}>{t("commons.client")} - {t("commons.server")}</MenuItem>
                    </Select>
                </Stack>
                <Stack maxWidth="20%">
                    <Typography variant="p">
                        {t("uploadMultiple.table.version", { variable: t("uploadMultiple.table.version") })}
                    </Typography>
                    <TextField
                        value={defaultVersion}
                        onChange={handleDefaultModVersionChange}
                        autoFocus
                    />
                </Stack>
            </GridToolbarContainer>
        ) : undefined;
    }

    return (
        <div>
            <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "right" }} open={loading} sx={{ backgroundColor: "black", borderRadius: "15px", color: "white" }}>
                <List
                    sx={{ maxWidth: 360, borderRadius: "15px" }}
                    component="nav"
                >
                    <ListItemButton onClick={handleClick}>
                        <ListItemText primary={t("commons.downloads")} />
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open}>
                        <List component="div" disablePadding>
                            {files.map((value, index) =>
                                <UploadModStatus file={value} key={index} onComponentFinish={handleComponentFinish} />
                            )}
                        </List>
                    </Collapse>
                </List>
            </Snackbar>
            <Typography variant="h2" gutterBottom>
                {t("uploadMultiple.title")}
            </Typography>
            <Grid container marginTop={2} justifyContent="center" spacing={5}>
                <Grid item
                    xs={10}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={onButtonClick}
                    sx={{
                        borderRadius: "1rem",
                        borderStyle: "dashed",
                        transition: "background-color .5s",
                        '&:hover': {
                            cursor: "pointer",
                            backgroundColor: "grey",
                            MozBoxShadow: "0 0 15px #ccc",
                            WebkitBoxShadow: "0 0 15px #ccc",
                            boxShadow: "0 0 15px #ccc",
                        }
                    }}>
                    <Typography paragraph>
                        {t("uploadMultiple.dropFiles")}
                    </Typography>
                    <input
                        ref={inputRef}
                        hidden
                        accept=".jar"
                        type="file"
                        multiple
                        onClick={(e) => {
                            e.target.value = null;
                        }}
                        onChange={handleFileChange}
                    />
                </Grid>

                <Grid item xs={12} justifyContent="space-between" style={{ height: 400 }}>
                    <DataGrid
                        columns={columns}
                        rows={files.map((file, index) => ({
                            id: index,
                            name: file.name,
                            customName: file.customName || '',
                            version: file.version || defaultVersion,
                            status: file.status || t("commons.pending"),
                            isClientChecked: checkValue(file.isClientChecked),
                            isServerChecked: checkValue(file.isServerChecked),
                        }))}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        components={{
                            Toolbar: CustomToolbar,
                        }}
                    />
                </Grid>

                {files.length > 0 && (
                    <LoadingButton
                        color="secondary"
                        onClick={handleUpload}
                        loading={loading}
                        loadingPosition="start"
                        startIcon={<SaveIcon />}
                        variant="contained"
                    >
                        {t("commons.upload")}
                    </LoadingButton>
                )}
            </Grid>
        </div>
    );
}

export default UploadMod;
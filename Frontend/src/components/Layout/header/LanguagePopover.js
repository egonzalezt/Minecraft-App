import React, { useState } from 'react';
import { alpha } from '@mui/material/styles';
import { Box, MenuItem, Stack, IconButton, Popover } from '@mui/material';
import { useTranslation } from 'react-i18next';

const LANGS = [
    {
        value: 'es',
        label: 'Spanish',
        icon: '/assets/icons/flags/ic_flag_sp.svg',
    },
    {
        value: 'en',
        label: 'English',
        icon: '/assets/icons/flags/ic_flag_en.svg',
    },
    {
        value: 'jp',
        label: 'Japanese',
        icon: '/assets/icons/flags/ic_flag_jp.svg',
    },
    {
        value: 'fr',
        label: 'French',
        icon: '/assets/icons/flags/ic_flag_fr.svg',
    },
    {
        value: 'ru',
        label: 'Russian',
        icon: '/assets/icons/flags/ic_flag_ru.svg',
    },
];

export default function LanguagePopover() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedLang, setSelectedLang] = useState(LANGS[0]);
    const { i18n } = useTranslation(); // Remove { t } since it's not used here.

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageChange = (lang) => {
        setSelectedLang(lang);
        handleClose();

        // Update the language using react-i18next's changeLanguage function
        i18n.changeLanguage(lang.value);
    };

    return (
        <>
            <IconButton
                onClick={handleOpen}
                sx={{
                    padding: 0,
                    width: 44,
                    height: 44,
                    ...(anchorEl && {
                        bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
                    }),
                }}
            >
                <img src={selectedLang.icon} alt={selectedLang.label} />
            </IconButton>

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        p: 1,
                        mt: 1.5,
                        ml: 0.75,
                        width: 180,
                        '& .MuiMenuItem-root': {
                            px: 1,
                            typography: 'body2',
                            borderRadius: 0.75,
                        },
                    },
                }}
            >
                <Stack spacing={0.75}>
                    {LANGS.map((option) => (
                        <MenuItem
                            key={option.value}
                            selected={option.value === selectedLang.value}
                            onClick={() => handleLanguageChange(option)}
                        >
                            <Box component="img" alt={option.label} src={option.icon} sx={{ width: 28, mr: 2 }} />
                            {option.label}
                        </MenuItem>
                    ))}
                </Stack>
            </Popover>
        </>
    );
}

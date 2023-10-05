import React, { useState, useEffect } from 'react';
import { alpha } from '@mui/material/styles';
import { Box, MenuItem, Stack, IconButton, Popover } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function LanguagePopover() {
    const [anchorEl, setAnchorEl] = useState(null);
    const { i18n, t } = useTranslation(); // Remove { t } since it's not used here.
    const LANGS = [
        {
            value: 'es',
            label: t("commons.langs.spanish"),
            icon: '/assets/icons/flags/ic_flag_sp.svg',
        },
        {
            value: 'en',
            label: t("commons.langs.english"),
            icon: '/assets/icons/flags/ic_flag_en.svg',
        },
        {
            value: 'jp',
            label: t("commons.langs.japanese"),
            icon: '/assets/icons/flags/ic_flag_jp.svg',
        },
        {
            value: 'fr',
            label: t("commons.langs.french"),
            icon: '/assets/icons/flags/ic_flag_fr.svg',
        },
        {
            value: 'ru',
            label: t("commons.langs.russian"),
            icon: '/assets/icons/flags/ic_flag_ru.svg',
        },
        {
            value: 'des',
            label: t("commons.langs.desmadrero"),
            icon: '/assets/icons/flags/ic_flag_des.svg',
        },
    ];
    const [selectedLang, setSelectedLang] = useState(LANGS[0]);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageChange = (lang) => {
        setSelectedLang(lang);
        handleClose();
        i18n.changeLanguage(lang.value);
        localStorage.setItem('selectedLanguage', lang.value);
    };

    useEffect(() => {
        const savedLanguage = localStorage.getItem('selectedLanguage');
        if (savedLanguage) {
            const selected = LANGS.find((lang) => lang.value === savedLanguage);
            if (selected) {
                setSelectedLang(selected);
                i18n.changeLanguage(selected.value);
            }
        }
    }, []);

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

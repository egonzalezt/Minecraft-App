import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import styles from '../styles/credits.css'
import minecraftLogo from '../img/minecraft.png';
import { useTranslation } from 'react-i18next';


function NotFound() {
    const { t } = useTranslation();

    return (
        <div className="backgroundDirt">
            <Stack justifyContent="space-between" alignItems="center" className="creditsScroll" paddingTop={4}>
                <img alt="Minecraft" src={minecraftLogo} width="60%" />
                <Typography variant="h4" sx={{ color: 'yellow' }}>
                    {t("404.title")}
                </Typography>
                <Typography variant="h5">
                    {t("404.message")}
                </Typography>
                <Button component={Link} to={"/"}>{t("commons.home")}</Button>
            </Stack>
        </div>
    );
}

export default NotFound;

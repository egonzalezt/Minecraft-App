import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import styles from '../styles/credits.css'
import minecraftLogo from '../img/minecraft.png';


function NotFound() {
    return (
        <div className="backgroundDirt">
            <Stack justifyContent="space-between" alignItems="center" className="creditsScroll" paddingTop={4}>
                <img alt="Minecraft" src={minecraftLogo} width="60%" />
                <Typography variant="h4" sx={{ color: 'yellow' }}>
                    Error: 404 Not Found
                </Typography>
                <Typography variant="h5">
                    The webpage you are looking for might have been removed, had its
                    name changed, or is temporarily unavailable.
                </Typography>
                <Button component={Link} to={"/"}>Home</Button>
            </Stack>
        </div>
    );
}

export default NotFound;

import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

function NotFound() {
    return (
        <Stack width="100%" justifyContent="space-between" alignItems="center">
            <Stack width="100%" sx={{
                backgroundImage: "url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)",
                height: "400px",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
            }}>
                <Typography variant='h1'>
                    404
                </Typography>
            </Stack>
            <Stack alignItems="center">
                <Typography variant='h2'>
                    Parece que estas perdido
                </Typography>
                <Typography paragraph>La pagina que buscas no existe!</Typography>
                <Button component={Link} to={"/"}>Volver al inicio</Button>
            </Stack>
        </Stack>
    );
}

export default NotFound;

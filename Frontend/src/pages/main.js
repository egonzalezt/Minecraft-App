import Header from "../components/header";
import Footer from "../components/footer";
import NavBar from "../components/navBar";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

function Main() {
    return (
        <div>
            <NavBar />
            <Stack direction="column" alignItems="center" padding={8} spacing={2} sx={{
                backgroundImage: `url(${"../img/book.png"})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: { xs: "70% 100%", md: "65% 100%" },
                backgroundPosition: "center",
            }}>
                <Header />
                    <Typography variant="h3">kiubo gonorea</Typography>
                    <Typography>
                        Presione el boton para descargar los mods men.
                    </Typography>
                    <Typography>
                        Version de maincra 1.16.5
                    </Typography>
                    <Typography>
                        Forge 36.2.39
                    </Typography>
                    <Typography>
                        Turip Ip Ip
                    </Typography>
                    <Typography>
                        Montesitos Product Owner
                    </Typography>
                    <Typography>
                        Llamas220 Product Owner
                    </Typography>
                    <Typography>
                        Daves2126 Developer
                    </Typography>
                    <Typography>
                        Catmizxc Supervisor, Cloud Engineer
                    </Typography>
                    <Typography>
                        Perderas BetaTester
                    </Typography>
                    <Typography>
                        Almowolf (UI) Designer
                    </Typography>
                    <Typography>
                        Ima24 Tester
                    </Typography>
                    <Typography>
                        Turip Ip Ip
                    </Typography>
                    <Typography>
                        Made by VasitosCorp
                    </Typography>
            </Stack>
            <Footer />
        </div>
    );
}

export default Main;

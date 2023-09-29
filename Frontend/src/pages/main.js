import Header from "../components/header";
import Footer from "../components/footer";
import NavBar from "../components/navBar";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

function Main() {
    const { t } = useTranslation();

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
                        {t("mainPage.downloadMods")}
                    </Typography>
                    <Typography>
                        {t("mainPage.minecraftVersion")} 1.20.1
                    </Typography>
                    <Typography>
                        Fabric 0.14.22
                    </Typography>
                    <Typography>
                        Turip Ip Ip
                    </Typography>
                    <Typography>
                        Montesitos {t("commons.softwareDev.po")}
                    </Typography>
                    <Typography>
                        Llamas220 {t("commons.softwareDev.po")}
                    </Typography>
                    <Typography>
                        Daves2126 {t("commons.softwareDev.dev")}
                    </Typography>
                    <Typography>
                        Catmizxc {t("commons.softwareDev.supervisor")}, {t("commons.softwareDev.pe")}
                    </Typography>
                    <Typography>
                        DavidSonLee {t("commons.softwareDev.ce")}
                    </Typography>
                    <Typography>
                        Ima24 {t("commons.softwareDev.tester")}
                    </Typography>
                    <Typography>
                        DoctorEaker {t("commons.softwareDev.designer")}
                    </Typography>
                    <Typography>
                        Perderas {t("commons.softwareDev.betaTester")}
                    </Typography>
                    <Typography>
                        Almowolf {t("commons.softwareDev.designer")}
                    </Typography>
                    <Typography>
                        Turip Ip Ip
                    </Typography>
                    <Typography>
                    {t("commons.madeBy")} {t("commons.vasitosCorp")}
                    </Typography>
            </Stack>
            <Footer />
        </div>
    );
}

export default Main;


import React, { useRef, useState } from "react"

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import useMediaQuery from '@mui/material/useMediaQuery';

function Header() {

    const [hidden, setHidden] = useState(true);
    const iframeRef = useRef(null);
    const matches = useMediaQuery('(min-width:700px)');

    function troll() {
        setHidden(false);
        const rickRoll = iframeRef.current;
        rickRoll.setAttribute('src', `https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1`);
        rickRoll.requestFullscreen();
    }

    return (
        <Stack direction="column" spacing={2} padding={2} justifyContent="space-between" alignItems="center">
            <Typography variant={matches ? 'h1' : 'h2'}>
                Minecraft
            </Typography>
            <Typography margin={2} variant={matches ? 'h2' : 'h3'}>
                Vamo a jugar Arequipet
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={2}>
                <Button onClick={troll} href={"/api/v1/mods/download"}>Descargar Mods</Button>
                <Button href={"https://maven.minecraftforge.net/net/minecraftforge/forge/1.16.5-36.2.39/forge-1.16.5-36.2.39-installer.jar"}>Descargar Forge</Button>
            </Stack>
            <iframe ref={iframeRef} id="rick" hidden={hidden} title="maincra" src="https://www.youtube.com/embed/dQw4w9WgXcQ" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </Stack>
    )
}

export default Header;
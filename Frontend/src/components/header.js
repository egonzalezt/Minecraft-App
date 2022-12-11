
import React, { useRef, useState } from "react"

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

function Header() {

    const [hidden, setHidden] = useState(true);
    const iframeRef = useRef(null);

    function troll(){
        setHidden(false);
        const rickRoll = iframeRef.current;
        rickRoll.setAttribute('src', `https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1`);
        rickRoll.requestFullscreen();
    }

    return (
        <Stack direction="column" width="100%" spacing={2} padding={2} justifyContent="space-between" alignItems="center">
            <h1 className="header" size="8"><big><big><big><big>Minecraft</big></big></big></big></h1>
            <h1><big>Vamo a jugar Arequipet</big></h1>
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={2}>
                <Button onClick={troll}  href={"http://34.23.202.251:8000/mods/download"}>Descargar Mods</Button>
                <Button href={"https://maven.minecraftforge.net/net/minecraftforge/forge/1.16.5-36.2.39/forge-1.16.5-36.2.39-installer.jar"}>Descargar Forge</Button>
            </Stack>
            <iframe ref={iframeRef} id="rick" hidden={hidden} title="maincra" src="https://www.youtube.com/embed/dQw4w9WgXcQ" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </Stack>
    )
}

export default Header;
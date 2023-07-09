import React, { useState } from 'react';
import SkinRenderer from '../components/Skinview3D/skinRenderer';
import skinDefault from '../img/floralsummer.png'
const Test = () => {
  const [skinData, setSkinData] = useState("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAZlBMVEUAAABAY11DGgluMBGFOhScQxamRhenbmK5hXrDURnEmI7QcG3QuJLRWBrWh4XWiIXaxKTdoZ3gu7Lh4NnlZSTlxbDl5eXr5+Xs0sLs0sPs4pzs6+Xs7Obt7Obu7u7w5q3y8fD7+/uh+HjJAAAAAXRSTlMAQObYZgAAAzVJREFUWMPdlmt3oyAQhq1hCMRainGr2doN+f9/cucC3j3RnLNf9o1VoczjwDBAlkVpazX9ASgUQHZUliwBLGil8ToO0EhAe62A/VDHAeI6ftyWJXKOd4EI+HUFFeoFD3j80HtV3VDV612AG+uFKGjyAIfyKIDGHk35+zIDuAipfofrQBGk2Gu+USypHOtHLVHro48NeR6SaCy5KtWP7O0qYScAywpDhPWbAAnfFgB7d8rsSS19wM5qNsjz2y3P2ZAuLYOY2uuTPE9LAND8BZt/v1XV23duQXEVxoWv1CyXZ74ApPRVbXu7ta1K5UNpXbiiOKNS2XlfWu8dPkmur3dF27Y7ALakjCztGqBaB5zNGIARb1u8OW8u5vICQGkcEbytARZdKEgIIPErqgegaI0CZZ2okOZuAbj9ommUALrsrteu1AwAXiO3AZK9AqCbAHTXaQF88MSsMSiBxpPl/QTw/vn5PgW4UnWdKvn1A6c2WGt9uIcNwIoHijwQvzEYVte1Th40ewBKX1EyiNiDEhEfcUo0v5sZ4I/oi4UvDPAYVuMFALa2ZQSE6EF4AnCK4s/22IWy1tgH6kC4N1wX7nOAMVOAeCAjBjyx6+SBm3vAM+jxOLPwVVrIDJR3ioGGOAbLKBjRDDB4gFMARxFcMfzwegoYeQA1rk/etROtJNQ4mV7SfwB4WZLgwzs949Ld7wn6KHQOkEfYak7rwawKN7QuS7saJPtNwkKQQddBskx7i9g3OwnZ9QqDedn/p1kQ5ulMdfGEpSKg7gEhevC0M2R6UdEDWyebED+/tDdmUTXMqtGZIrkfJraGzPtsjNWXLPPZfmE6T786vGkKJ06l3evBAq53TsVxMtE3JmXn1heRI4DqCOBs/gHgaRdEjcTTxH28aNJ+Hnf3TcNkUBSyRw7lnYBB/U4bFXcS3pe8mzQNBwCyMwY3tt1YICQrf/AnWRp30zDxQLJq3QMG/CBA9BX38+HE+Cyf07pA1uRBPFH0gObZmpQAaaGJZ5p4wsnWU3q8HjDAGDL+6cdAhtCPo9AkwlmmnJlk5ePRl/swBj8BTDw4Dx70aZ0A83VgsS7MDeblZ+eCvz//Y2tCHNtaAAAAAElFTkSuQmCC");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setSkinData(e.target.result);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" accept=".png" onChange={handleFileUpload} />
      {skinData && <SkinRenderer skinData={skinData} nameTag={"Daves2126"}/>}
    </div>
  );
};

export default Test;

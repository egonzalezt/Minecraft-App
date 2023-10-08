import React, { useEffect } from 'react';
import { storeSkin } from "../states/skinStore.js";
import ServerComponent from '../components/admin/server.js'
function Server() {
    const setAnimation = storeSkin((state) => state.setAnimation);

    useEffect(() => {
        setAnimation(1)
    }, []);

    return (
        <div>
            <ServerComponent />
        </div>
    );
}

export default Server;

import React, { useEffect } from 'react';
import RunRcon from "../components/admin/server.js";
import { storeSkin } from "../states/skinStore.js";

function RunCommand() {
    const setAnimation = storeSkin((state) => state.setAnimation);

    useEffect(() => {
        setAnimation(1)
    }, []);

    return (
        <div>
            <RunRcon />
        </div>
    );
}

export default RunCommand;

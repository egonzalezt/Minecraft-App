import React, { useEffect, useRef } from 'react';
import { SkinViewer, WalkingAnimation, FlyingAnimation, IdleAnimation, RunningAnimation } from 'skinview3d';

const SkinRenderer = ({ skinData, nameTag, animationType, width = 300, height = 400, zoom = 0.85, speed = 1, cameraX = -15 }) => {
    const canvasRef = useRef(null);
    const skinViewer = useRef(null);

    useEffect(() => {
        skinViewer.current = new SkinViewer({
            canvas: canvasRef.current,
            width: width,
            height: height,
        });

        return () => {
            skinViewer.current.dispose();
        };
    }, [width, height]);

    useEffect(() => {
        if (skinData) {
            skinViewer.current.loadSkin(skinData);
        }
    }, [skinData]);

    useEffect(() => {
        if (nameTag) {
            skinViewer.current.nameTag = nameTag;
        }
    }, [nameTag]);

    useEffect(() => {
        if (zoom) {
            skinViewer.current.zoom = zoom;
        }
    }, [zoom]);

    useEffect(() => {
        let animation = null;

        switch (animationType) {
            case 0:
                animation = new IdleAnimation();
                break;
            case 1:
                animation = new WalkingAnimation();
                break;
            case 2:
                animation = new RunningAnimation();
                break;
            case 3:
                animation = new FlyingAnimation();
                break;
            default:
                animation = new IdleAnimation();
                break;
        }

        if (animation) {
            skinViewer.current.animation = animation;
        }

        return () => {
            skinViewer.current.animation = null;
        };
    }, [animationType]);

    useEffect(() => {
        if (skinViewer.current.animation) {
            skinViewer.current.animation.speed = speed;
        }
    }, [speed]);

    useEffect(() => {
        if (skinViewer.current.camera) {
            skinViewer.current.camera.position.x = cameraX;
        }
    }, [cameraX]);

    return <canvas ref={canvasRef} />;
};

export default SkinRenderer;

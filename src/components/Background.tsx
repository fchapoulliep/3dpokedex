import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

const Background = ({ background }: { background: string }) => {
  const { scene } = useThree();

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    const backgroundTexture = textureLoader.load(
      "/backgrounds/" + background + ".png"
    );
    scene.background = backgroundTexture;

    return () => {
      scene.background = null;
    };
  }, [scene, background]);

  return null;
};

export default Background;

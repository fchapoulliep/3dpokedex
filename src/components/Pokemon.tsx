import React, { useEffect, useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import pokemonList from "../data/pokemons.json";
import Loader from "./Loader";
import Background from "./Background";
import * as THREE from "three";
import "../css/pokemon.css";

interface PokemonProps {
  pokemonId: string;
}

interface PokemonModelProps {
  modelPath: string;
}

const PokemonModel: React.FC<PokemonModelProps> = ({ modelPath }) => {
  const { scene, animations } = useGLTF(modelPath);
  const { camera } = useThree();
  const mixer = new THREE.AnimationMixer(scene);

  useEffect(() => {
    if (animations.length > 0) {
      const idleAnimation = animations.find(
        (clip) =>
          clip.name.toLowerCase().includes("idle") ||
          clip.name.toLowerCase().includes("wait") ||
          clip.name === "0"
      );
      const action = mixer.clipAction(idleAnimation || animations[0]);
      action.play();
    }

    return () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(scene);
    };
  }, [animations, mixer, scene]);

  useFrame((state, delta) => {
    mixer.update(delta);
  });

  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const size = new THREE.Vector3();
      console.log(box);
      box.getSize(size);
      console.log(size);
    
      const delta = Math.min(1.0 / size.x, 1.0 / size.y, 1.0 / size.z);
      scene.scale.set(delta, delta, delta);
      scene.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.isMesh && mesh.material) {
          const material = mesh.material as THREE.MeshStandardMaterial;
          material.metalness = 0;
          material.roughness = 0.5;
          material.alphaTest = 0.5;
          material.transparent = true;
          if (material.map) {
            if (material.map.name.includes("Fire")) {
              material.color.set("orange");
              material.emissive.set("red");
              material.alphaMap = material.map;
              material.opacity = 0.5;
            }
            if (material.map.name.includes("Beto")) {
              material.color.set("#DDA0DD");
            }
          }
        }
        
      });
    }
  }, [scene]);

  return <primitive object={scene} scale={0.25} position={[0, -1.5, 0]} />;
};

const Pokemon: React.FC<PokemonProps> = ({ pokemonId }) => {
  const pokemon = pokemonList.find((p) => p.id === parseInt(pokemonId));

  const pokemonName = pokemon
    ? pokemon.name.english.toLowerCase().replace(/[\s.,']/g, "").replace("♀", "F").replace("♂", "M")
    : "";

  const modelPath = useMemo(
    () => `/models/${pokemonName}/${pokemonName}.glb`,
    [pokemonName]
  );

  const audio = useMemo(
    () => new Audio(`/models/${pokemonName}/${pokemonName}.mp3`),
    [pokemonName]
  );

  if (!pokemon) {
    return <div>The Pokémon does not exist</div>;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const loader = document.querySelector(".loader");
      if (loader) {
        loader.classList.add("animation");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div id="pokemon-overlay">
      <Loader />
      <div className="pokemon-description">
        <p>{pokemon.name.english}</p>
        <p>Pokédex No. {pokemon.id}</p>
        <p>{pokemon.description}</p>
      </div>
      <div className="pokemon-types">
        {pokemon.type.map((type) => (
          <span key={type} className={type.toLowerCase()}>
            {type}
          </span>
        ))}
      </div>
      <button
        onClick={() => {
          if (audio) {
            audio.play();
          }
        }}
      >
        Play Sound
      </button>

      <Canvas style={{ zIndex: -1 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, 5, 5]} intensity={2} />
        <directionalLight position={[5, -5, 5]} intensity={2} />
        <directionalLight position={[5, 5, -5]} intensity={2} />
        <Background
          background={
            pokemon.type[0] === "Normal" && pokemon.type[1]
              ? pokemon.type[1]
              : pokemon.type[0]
          }
        />
        <OrbitControls
          enableDamping
          dampingFactor={0.25}
          minDistance={2}
          maxDistance={6}
          autoRotate
        />
        <PokemonModel modelPath={modelPath} />
      </Canvas>
    </div>
  );
};

export default Pokemon;
/**
 * Importing React, the Loader component, the PokemonType component, and the Link component.
 */
import React, { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import pokemonList from "../data/pokemons.json";
import Loader from "./Loader";
import * as THREE from "three";
import "../css/pokemon.css";
import PokemonType from "./PokemonType";
import { Link } from "react-router-dom";

/**
 * Interface for the PokemonProps type, which includes the Pokémon ID.
 */
interface PokemonProps {
  pokemonId: string;
}

/**
 * Interface for the PokemonModelProps type, which includes the model path and Pokémon ID.
 */
interface PokemonModelProps {
  modelPath: string;
  id: number;
}

/**
 * Component that renders a 3D model of a Pokémon using the provided model path and Pokémon ID.
 * It handles loading the model, playing idle animations, and adjusting the model's scale and materials.
 *
 * @component
 * @param {PokemonModelProps} props - The properties for the PokemonModel component.
 * @param {string} props.modelPath - The path to the 3D model file.
 * @param {number} props.id - The ID of the Pokémon.
 * @returns {JSX.Element} The rendered 3D model of the Pokémon.
 */
const PokemonModel: React.FC<PokemonModelProps> = ({ modelPath, id }) => {
  const { scene, animations } = useGLTF(modelPath);
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
      box.getSize(size);

      const delta = Math.min(1.0 / size.x, 1.0 / size.y, 1.0 / size.z);
      scene.scale.set(delta, delta, delta);
      scene.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.isMesh && mesh.material) {
          const material = mesh.material as THREE.MeshStandardMaterial;
          material.metalness = 0;
          material.roughness = 0.5;
          if (
            id > 40 ||
            id === 8 ||
            id === 8 ||
            id === 16 ||
            id === 17 ||
            id === 18
          ) {
            material.alphaTest = 0.5;
          }
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

        if (
          mesh.isMesh &&
          id !== 1 &&
          id !== 8 &&
          id !== 8 &&
          id !== 16 &&
          id !== 17 &&
          id !== 18 &&
          Number(id) < 41
        ) {
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      });
    }
  }, [scene]);

  return <primitive object={scene} scale={0.25} position={[0, -1.5, 0]} />;
};

/**
 *  Component that renders a Pokémon page with a 3D model, description, and type information.
 * @param pokemonId The ID of the Pokémon to display. 
 * @returns The Pokémon page with the 3D model, description, and type information.
 */
const Pokemon: React.FC<PokemonProps> = ({ pokemonId }) => {
  const pokemon = pokemonList.find((p) => p.id === parseInt(pokemonId));
  const [loading, setLoading] = React.useState(true);

  const pokemonName = pokemon
    ? pokemon.name.english
        .toLowerCase()
        .replace(/[\s.,']/g, "")
        .replace("♀", "F")
        .replace("♂", "M")
    : "";

  const modelPath = useMemo(
    () => `/models/${pokemonName}/${pokemonName}.glb`,
    [pokemonName]
  );

  const audio = useMemo(
    () => new Audio(`/models/${pokemonName}/${pokemonName}.mp3`),
    [pokemonName]
  );
  useEffect(() => {
    setLoading(false);
  }, [modelPath]);

  if (!pokemon) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        The Pokémon does not exist
        <Link to="/">Go back to the Pokédex</Link>
      </div>
    );
  }

  useEffect(() => {
    const loader = document.querySelector(".loader");
    if (loader && !loading) {
      setTimeout(() => {
        loader.classList.add("animation");
      }, 1500);
    }
  });

  return (
    <div
      id="pokemon-overlay"
      style={{
        backgroundImage: `url(/backgrounds/${
          pokemon.type[0] === "Normal" && pokemon.type[1]
            ? pokemon.type[1]
            : pokemon.type[0]
        }.png)`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <Loader />
      <div className="pokemon-description">
        <h2>{pokemon.name.english}</h2>
        <p>Pokédex No. {pokemon.id}</p>
        <p>{pokemon.description}</p>
      </div>
      <div className="pokemon-types">
        {pokemon.type.map((type) => (
          <PokemonType key={type} type={type} />
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

      <Canvas style={{ background: "transparent" }} shadows>
        <ambientLight intensity={1} />
        <directionalLight position={[-5, 5, 5]} intensity={2} castShadow />
        <directionalLight position={[5, 5, -5]} intensity={2} castShadow />
        <OrbitControls
          enableDamping
          dampingFactor={0.25}
          minDistance={2}
          maxDistance={6}
          autoRotate
        />
        <PokemonModel modelPath={modelPath} id={pokemon.id} />
      </Canvas>
    </div>
  );
};

export default Pokemon;

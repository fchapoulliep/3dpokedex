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
  verticalOffsetRatio: number;
}

const POKEMON_CAMERA_DISTANCE: Record<number, number> = {
  6: 3,
  16: 4,
  17: 4,
  22: 3,
  23: 1.5,
  24: 3,
  26: 2.5,
  38: 3,
  95: 3,
  138: 6,
  148: 3,
};

const DEFAULT_CAMERA_DISTANCE = 5;

const POKEMON_VERTICAL_OFFSET: Record<number, number> = {
  6: 1.5,
  15: 2.4,
  22: 1.2,
  23: 1.2,
  26: 1.1,
  38: 1.2,
};

const DEFAULT_VERTICAL_OFFSET = 2;

/**
 * Component that renders a 3D model of a Pokémon using the provided model path and Pokémon ID.
 * It handles loading the model, playing idle animations, and centering/scaling the model.
 *
 * @component
 * @param {PokemonModelProps} props - The properties for the PokemonModel component.
 * @param {string} props.modelPath - The path to the 3D model file.
 * @param {number} props.id - The ID of the Pokémon.
 * @returns {JSX.Element} The rendered 3D model of the Pokémon.
 */
const PokemonModel: React.FC<PokemonModelProps> = ({
  modelPath,
  id,
  verticalOffsetRatio,
}) => {
  const { scene, animations } = useGLTF(modelPath);
  const mixer = new THREE.AnimationMixer(scene);

  useEffect(() => {
    if (animations.length > 0) {
      const idleAnimation = animations.find(
        (clip) =>
          clip.name.toLowerCase().includes("idle") ||
          clip.name.toLowerCase().includes("wait") ||
          clip.name === "0",
      );
      const action = mixer.clipAction(idleAnimation || animations[0]);
      action.play();
    }

    return () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(scene);
    };
  }, [animations, mixer, scene]);

  useFrame((_, delta) => {
    mixer.update(delta);
  });

  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const size = new THREE.Vector3();
      const center = new THREE.Vector3();
      box.getSize(size);
      box.getCenter(center);

      const delta = Math.min(1.0 / size.x, 1.0 / size.y, 1.0 / size.z);
      scene.scale.set(delta, delta, delta);

      const boundingSphere = new THREE.Sphere();
      box.getBoundingSphere(boundingSphere);
      const verticalOffset =
        boundingSphere.radius * delta * verticalOffsetRatio;

      scene.position.set(
        -center.x * delta,
        -center.y * delta - verticalOffset,
        -center.z * delta,
      );

      scene.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.isMesh && mesh.material) {
          const material = mesh.material as THREE.MeshStandardMaterial;
          material.metalness = 0;
          material.roughness = 1;
          material.transparent = true;
          if (material.map) {
            if (material.map.name.includes("Beto")) {
              material.color.set("#DDA0DD");
            }
          }
        }
      });
    }
  }, [scene, id]);

  return <primitive object={scene} scale={0.25} />;
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
    () =>
      `${
        import.meta.env.BASE_URL
      }models/${pokemonName}/${pokemonName}.glb?v=${new Date().getTime()}`,
    [pokemonName],
  );

  const cameraDistance = pokemon
    ? (POKEMON_CAMERA_DISTANCE[pokemon.id] ?? DEFAULT_CAMERA_DISTANCE)
    : DEFAULT_CAMERA_DISTANCE;
  const verticalOffsetRatio = pokemon
    ? (POKEMON_VERTICAL_OFFSET[pokemon.id] ?? DEFAULT_VERTICAL_OFFSET)
    : DEFAULT_VERTICAL_OFFSET;

  const audio = useMemo(
    () =>
      new Audio(
        `${
          import.meta.env.BASE_URL
        }models/${pokemonName}/${pokemonName}.mp3?v=${new Date().getTime()}`,
      ),
    [pokemonName],
  );

  useEffect(() => {
    const loader = document.querySelector(".loader");
    if (loader) {
      loader.classList.remove("animation");
    }
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
        backgroundImage: `url(${import.meta.env.BASE_URL}backgrounds/${
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

      <Canvas
        style={{ background: "transparent" }}
        shadows
        key={modelPath}
        camera={{ position: [0, 0, cameraDistance] }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[-5, 5, 5]} intensity={2} castShadow />
        <directionalLight position={[5, 5, -5]} intensity={2} castShadow />
        <OrbitControls
          autoRotate
          target={[0, 0, 0]}
          minDistance={2.5}
          maxDistance={8}
        />
        <PokemonModel
          modelPath={modelPath}
          id={pokemon.id}
          verticalOffsetRatio={verticalOffsetRatio}
        />
      </Canvas>
    </div>
  );
};

export default Pokemon;

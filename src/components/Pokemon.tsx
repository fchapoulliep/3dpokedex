/**
 * Importing React, the Loader component, the PokemonType component, and the Link component.
 */
import React, { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from "react";
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
  /** Called once the model is drawn and its framing has settled. */
  onReady: () => void;
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
  onReady,
}) => {
  const { scene, animations } = useGLTF(modelPath);
  const mixer = new THREE.AnimationMixer(scene);
  const frames = useRef(0);

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
    // A few frames let the framing settle (centering, scale, camera fit): only
    // then is the model shown, so that it never jumps or glides into place.
    frames.current += 1;
    if (frames.current === 5) {
      onReady();
    }
  });

  useEffect(() => {
    if (scene) {
      // A model already seen comes back from the cache with the position of its
      // last visit: start from the origin so that it is centered the same way.
      scene.position.set(0, 0, 0);
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
 * Models drawn during this visit. drei keeps them in memory, so they come back
 * at once and need no loader.
 */
const seenModels = new Set<string>();

/** How long the loader stays at least, for a model not seen yet. */
const LOADER_MIN_MS = 1000;

/**
 *  Component that renders a Pokémon page with a 3D model, description, and type information.
 * @param pokemonId The ID of the Pokémon to display.
 * @returns The Pokémon page with the 3D model, description, and type information.
 */
const Pokemon: React.FC<PokemonProps> = ({ pokemonId }) => {
  const pokemon = pokemonList.find((p) => p.id === parseInt(pokemonId));

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
      }models/${pokemonName}/${pokemonName}.glb?v=${__BUILD_ID__}`,
    [pokemonName],
  );

  const cameraDistance = pokemon
    ? (POKEMON_CAMERA_DISTANCE[pokemon.id] ?? DEFAULT_CAMERA_DISTANCE)
    : DEFAULT_CAMERA_DISTANCE;
  const verticalOffsetRatio = pokemon
    ? (POKEMON_VERTICAL_OFFSET[pokemon.id] ?? DEFAULT_VERTICAL_OFFSET)
    : DEFAULT_VERTICAL_OFFSET;

  // Only for an existing Pokémon: otherwise the browser would fetch models//.mp3.
  const audio = useMemo(
    () =>
      pokemonName
        ? new Audio(
            `${
              import.meta.env.BASE_URL
            }models/${pokemonName}/${pokemonName}.mp3?v=${__BUILD_ID__}`,
          )
        : null,
    [pokemonName],
  );
  const [isPlaying, setIsPlaying] = React.useState(false);

  // The button shows when the cry plays, and the cry stops when the page changes.
  useEffect(() => {
    if (!audio) return;
    const start = () => setIsPlaying(true);
    const stop = () => setIsPlaying(false);
    audio.addEventListener("playing", start);
    audio.addEventListener("ended", stop);
    audio.addEventListener("pause", stop);
    return () => {
      audio.pause();
      audio.removeEventListener("playing", start);
      audio.removeEventListener("ended", stop);
      audio.removeEventListener("pause", stop);
      setIsPlaying(false);
    };
  }, [audio]);

  // The loader follows the model rather than a fixed delay. A model not seen
  // yet shows it at once and for at least LOADER_MIN_MS, so that a quick load
  // reads as a transition rather than a black flash; a model already seen
  // during the visit is still in memory and shows up without it.
  const [loaderPhase, setLoaderPhase] = React.useState<
    "visible" | "closing" | "hidden"
  >("visible");
  const [drawnPath, setDrawnPath] = React.useState<string | null>(null);
  const modelDrawn = drawnPath === modelPath;
  const loaderShownAt = useRef(performance.now());

  useLayoutEffect(() => {
    if (seenModels.has(modelPath)) {
      setLoaderPhase("hidden");
      return;
    }
    loaderShownAt.current = performance.now();
    setLoaderPhase("visible");
  }, [modelPath]);

  useEffect(() => {
    if (!modelDrawn) return;
    seenModels.add(modelPath);
    const elapsed = performance.now() - loaderShownAt.current;
    const timer = setTimeout(
      () => setLoaderPhase((phase) => (phase === "visible" ? "closing" : phase)),
      Math.max(0, LOADER_MIN_MS - elapsed),
    );
    return () => clearTimeout(timer);
  }, [modelDrawn, modelPath]);

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
      {loaderPhase !== "hidden" && (
        <Loader
          closing={loaderPhase === "closing"}
          onClosed={() => setLoaderPhase("hidden")}
        />
      )}
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
        type="button"
        className={`pokemon-cry${isPlaying ? " playing" : ""}`}
        onClick={() => {
          if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => setIsPlaying(false));
          }
        }}
        aria-label={`Play ${pokemon.name.english}'s cry`}
        title="Play cry"
      >
        {/* Lucide "volume-2" icon (ISC license): its two waves light up while the cry plays */}
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
          <path className="wave" d="M16 9a5 5 0 0 1 0 6" />
          <path className="wave wave-far" d="M19.364 18.364a9 9 0 0 0 0-12.728" />
        </svg>
      </button>

      <Canvas
        style={{
          background: "transparent",
          // Hidden until the model is in place, then faded in
          opacity: modelDrawn ? 1 : 0,
          transition: "opacity 150ms",
        }}
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
        {/* A model still loading suspends the scene only: without this boundary,
            the page itself would wait, and the previous page would stay on screen */}
        <Suspense fallback={null}>
          <PokemonModel
            modelPath={modelPath}
            id={pokemon.id}
            verticalOffsetRatio={verticalOffsetRatio}
            onReady={() => setDrawnPath(modelPath)}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Pokemon;

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, PerspectiveCamera, useTexture } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import ImmpressionGooglePlay from '../../assets/backgrounds/ImmpressionGooglePlay.png'

function IphoneScene() {
  const groupRef = useRef();
  const secondPhoneRef = useRef();
  const { scene } = useGLTF('/models/iphone_16.glb');
  const { scene: infinixScene } = useGLTF('/models/Infinix_Hot_12.glb');
  const logoTexture = useTexture('/Logo_T.png');
  const googlePlayTexture = useTexture(ImmpressionGooglePlay);
  // For planes (not GLTF UVs), keep default orientation so it's not upside down
  googlePlayTexture.flipY = true;
  if (googlePlayTexture.colorSpace !== THREE.SRGBColorSpace) {
    googlePlayTexture.colorSpace = THREE.SRGBColorSpace;
  }
  googlePlayTexture.needsUpdate = true;

  // Depth-only prepass for iPhone to ensure it occludes the image plane
  const iphoneDepth = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((node) => {
      if (node.isMesh) {
        const mat = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking });
        mat.depthWrite = true;
        mat.depthTest = true;
        mat.transparent = false;
        // Don't write to color buffer, only depth
        mat.colorWrite = false;
        node.material = mat;
      }
    });
    return clone;
  }, [scene]);

  // Remove black spaces by stretching vertically to fill the screen height
  // while keeping full width (no left/right crop). This matches a CSS 'fill' behavior.

  // Animate the entire group (phone + screen) in a slanted oval 2D pattern
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      groupRef.current.position.x = Math.sin(time * 0.5) * 0.3;
      groupRef.current.position.y = Math.cos(time * 0.5) * 0.2;
    }
    if (secondPhoneRef.current) {
      const time = state.clock.elapsedTime;
      secondPhoneRef.current.position.x = -2.8 + Math.sin(time * 0.7) * 0.25 + Math.cos(time * 0.3) * 0.15;
      secondPhoneRef.current.position.y = -5 + Math.cos(time * 0.6) * 0.25 + Math.sin(time * 0.4) * 0.1;
    }
  });

  return (
    <>
      {/* Camera setup */}
      <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.5} />

      {/* Environment for reflections */}
      <Environment preset="studio" />

      {/* Second phone (Infinix) with Google Play image - behind and to the left */}
      <group ref={secondPhoneRef} position={[-2.8, -5, -1]} rotation={[0, -0.3, 0]}>
        {/* Left phone (Infinix) model */}
        <primitive
          object={infinixScene.clone()}
          scale={60}
          position={[0, 0, 0]}
        />

        {/* Image plane: full screen size, stretched to fill height (no bars, no side crop) */}
        <mesh position={[0, 5.05, 0.3]} renderOrder={1}>
          <planeGeometry args={[3.2, 9]} />
          <meshBasicMaterial
            map={googlePlayTexture}
            transparent={false}
            depthWrite={false}
            depthTest={true}
            polygonOffset={true}
            polygonOffsetFactor={1}
            polygonOffsetUnits={1}
            side={THREE.FrontSide}
          />
        </mesh>
      </group>

      {/* Group containing iPhone and screen - they move together */}
      <group ref={groupRef} rotation={[0, -0.3, 0]}>
        {/* iPhone depth prepass (writes only depth) */}
        <primitive
          object={iphoneDepth}
          scale={0.8}
          position={[0, 0, 0]}
          renderOrder={0}
        />

        {/* The iPhone model (visible pass) */}
        <primitive
          object={scene}
          scale={0.8}
          position={[0, 0, 0]}
          renderOrder={2}
        />

        {/* Screen with logo - positioned on top of phone screen */}
        <mesh position={[-1.95, 4.3, 0.5]}>
          <planeGeometry args={[0.8, 0.8]} />
          <meshBasicMaterial
            map={logoTexture}
            transparent={true}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </>
  );
}

const IphoneModel = () => {
  return (
    <motion.div
      className="iphone-canvas-container"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 1 }}
    >
      <Canvas
        style={{ width: '100%', height: '600px' }}
        gl={{ antialias: true, alpha: true }}
      >
        <IphoneScene />
      </Canvas>
    </motion.div>
  );
};

export default IphoneModel;

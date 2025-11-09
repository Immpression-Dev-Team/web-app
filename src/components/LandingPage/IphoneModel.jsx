import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, PerspectiveCamera, useTexture } from '@react-three/drei';
import { motion } from 'framer-motion';

function IphoneScene() {
  const groupRef = useRef();
  const secondPhoneRef = useRef();
  const { scene } = useGLTF('/models/iphone_16.glb');
  const logoTexture = useTexture('/Logo_T.png');

  // Animate the entire group (phone + screen) in a slanted oval 2D pattern
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      // Create a slanted oval motion (very subtle)
      // Horizontal movement (X-axis)
      groupRef.current.position.x = Math.sin(time * 0.5) * 0.3;
      // Vertical movement (Y-axis) - smaller amplitude for slanted oval
      groupRef.current.position.y = Math.cos(time * 0.5) * 0.2;
      // Keep phone facing forward (no rotation)
    }
    // Second phone animation - more random motion
    if (secondPhoneRef.current) {
      const time = state.clock.elapsedTime;
      // Different frequencies and combined sine waves for randomness
      secondPhoneRef.current.position.x = -2.8 + Math.sin(time * 0.7) * 0.25 + Math.cos(time * 0.3) * 0.15;
      secondPhoneRef.current.position.y = Math.cos(time * 0.6) * 0.25 + Math.sin(time * 0.4) * 0.1;
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

      {/* Second phone - behind and to the left */}
      <primitive
        ref={secondPhoneRef}
        object={scene.clone()}
        scale={0.8}
        position={[-2.8, 0, -1]}
        rotation={[0, -0.3, 0]}
      />

      {/* Group containing phone and screen - they move together */}
      <group ref={groupRef} rotation={[0, -0.3, 0]}>
        {/* The iPhone model */}
        <primitive
          object={scene}
          scale={0.8}
          position={[0, 0, 0]}
        />

        {/* Screen with logo - positioned on top of phone screen */}
        <mesh position={[-1.95, 4.3, 0.5]}>
          <planeGeometry args={[0.8, 0.8]} />
          <meshBasicMaterial
            map={logoTexture}
            transparent={true}
            side={2}
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

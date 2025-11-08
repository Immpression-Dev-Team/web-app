import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';

function IphoneScene() {
  const modelRef = useRef();
  const { scene } = useGLTF('/models/iphone_16.glb');

  // Animate the iPhone in a slanted oval 2D pattern
  useFrame((state) => {
    if (modelRef.current) {
      const time = state.clock.elapsedTime;
      // Create a slanted oval motion (very subtle)
      // Horizontal movement (X-axis)
      modelRef.current.position.x = Math.sin(time * 0.5) * 0.3;
      // Vertical movement (Y-axis) - smaller amplitude for slanted oval
      modelRef.current.position.y = Math.cos(time * 0.5) * 0.2;
      // Keep phone facing forward (no rotation)
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

      {/* The iPhone model */}
      <primitive
        ref={modelRef}
        object={scene}
        scale={0.8}
        position={[0, 0, 0]}
        rotation={[0, -0.3, 0]}
      />
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

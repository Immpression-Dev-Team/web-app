import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';

function IphoneScene() {
  const modelRef = useRef();
  const { scene } = useGLTF('/models/iphone_16.glb');

  // Auto-rotate the iPhone slowly
  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.2;
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
      />

      {/* Optional: Allow user to rotate the phone */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 1.5}
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

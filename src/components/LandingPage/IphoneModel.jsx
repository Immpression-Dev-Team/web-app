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

  // Create a CanvasTexture that contains the image without cropping (contain)
  const containedGooglePlayTexture = useMemo(() => {
    const img = googlePlayTexture?.image;
    if (!img || !img.width || !img.height) return null;

    // Use a pixel canvas matching the screen aspect (4.1 x 9.2)
    const screenW = 410;
    const screenH = Math.round(screenW * (9.2 / 4.1));
    const canvas = document.createElement('canvas');
    canvas.width = screenW;
    canvas.height = screenH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Rounded rect clip so corners are rounded
    const radiusPx = Math.round(0.45 * (screenW / 4.1));
    const r = Math.max(2, Math.min(radiusPx, Math.floor(Math.min(screenW, screenH) / 8)));
    const path = new Path2D();
    const x = 0, y = 0, w = screenW, h = screenH;
    path.moveTo(x + r, y);
    path.lineTo(x + w - r, y);
    path.quadraticCurveTo(x + w, y, x + w, y + r);
    path.lineTo(x + w, y + h - r);
    path.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    path.lineTo(x + r, y + h);
    path.quadraticCurveTo(x, y + h, x, y + h - r);
    path.lineTo(x, y + r);
    path.quadraticCurveTo(x, y, x + r, y);
    ctx.clearRect(0, 0, screenW, screenH);
    ctx.save();
    ctx.clip(path);

    const iw = img.width;
    const ih = img.height;
    const scale = Math.min(screenW / iw, screenH / ih); // contain
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (screenW - dw) / 2;
    const dy = (screenH - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore();

    const tex = new THREE.CanvasTexture(canvas);
    tex.flipY = true;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, [googlePlayTexture?.image]);

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
      groupRef.current.position.x = 0.7 + Math.sin(time * 0.4) * 0.1;
      groupRef.current.position.y = Math.cos(time * 0.5) * 0.18;
      groupRef.current.position.z = 0.35;
    }
    if (secondPhoneRef.current) {
      const time = state.clock.elapsedTime;
      const baseX = -3.9;
      const baseY = -5;
      const baseZ = -3.4;
      secondPhoneRef.current.position.x = baseX + Math.sin(time * 0.5) * 0.12;
      secondPhoneRef.current.position.y = baseY + Math.cos(time * 0.45) * 0.18;
      secondPhoneRef.current.position.z = baseZ + Math.sin(time * 0.35) * 0.04;
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
      <group ref={secondPhoneRef} position={[-3.9, -5, -3.4]} rotation={[0, -0.25, 0]}>
        {/* Left phone (Infinix) model */}
        <primitive
          object={infinixScene.clone()}
          scale={60}
          position={[0, 0, 0]}
        />

        {/* Image plane: contain-fit inside rounded-corner mask */}
        <mesh position={[0, 5.2, 0.3]} renderOrder={3}>
          <planeGeometry args={[4.15, 9.82]} />
          <meshBasicMaterial
            map={containedGooglePlayTexture || googlePlayTexture}
            transparent={true}
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
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
      >
        <IphoneScene />
      </Canvas>
    </motion.div>
  );
};

export default IphoneModel;

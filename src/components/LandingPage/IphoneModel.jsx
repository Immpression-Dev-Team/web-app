import { useRef, useMemo, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, PerspectiveCamera, useTexture } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
// import ImmpressionGooglePlay from '../../assets/backgrounds/ImmpressionGooglePlay.png'
// import ImmpressionApple from '../../assets/backgrounds/ImmpressionApple.png'
import ImmpressionHome from '../../assets/backgrounds/ImmpressionHome.png'

/*
 * Shared mouse ref — lives outside the component so it persists across renders
 * and is accessible inside the R3F render loop without causing re-renders.
 * { x, y } are normalized: -1..1 from center of viewport.
 * isPointer: false on touch-only devices → tracking is disabled entirely.
 */
const mouse = { x: 0, y: 0, isPointer: false };

/* Detect pointer device once at module load */
if (typeof window !== 'undefined') {
  mouse.isPointer = window.matchMedia('(pointer: fine)').matches;
}

function IphoneScene({ onReady }) {
  const groupRef = useRef();
  // const secondPhoneRef = useRef();

  /* Target rotation for lerping — keeps motion silky */
  const targetRotation = useRef({ x: 0, y: -0.3 });

  const { scene } = useGLTF('/models/iphone_16.glb');
  // const { scene: infinixScene } = useGLTF('/models/Infinix_Hot_12.glb');
  // const googlePlayTexture = useTexture(ImmpressionGooglePlay);
  // const appleTexture = useTexture(ImmpressionApple);
  const homeTexture = useTexture(ImmpressionHome);

  homeTexture.flipY = true;
  if (homeTexture.colorSpace !== THREE.SRGBColorSpace) {
    homeTexture.colorSpace = THREE.SRGBColorSpace;
  }
  homeTexture.needsUpdate = true;

  const containedHomeTexture = useMemo(() => {
    const img = homeTexture?.image;
    if (!img || !img.width || !img.height) return null;

    const screenW = 410;
    const screenH = Math.round(screenW * (9.2 / 4.1));
    const canvas = document.createElement('canvas');
    canvas.width = screenW;
    canvas.height = screenH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const r = Math.round(screenW * 0.25);
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

    const iw = img.width; const ih = img.height;
    const scale = Math.min(screenW / iw, screenH / ih);
    const dw = iw * scale; const dh = ih * scale;
    const dx = (screenW - dw) / 2; const dy = (screenH - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore();

    const tex = new THREE.CanvasTexture(canvas);
    tex.flipY = true;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, [homeTexture?.image]);

  const iphoneDepth = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((node) => {
      if (node.isMesh) {
        const mat = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking });
        mat.depthWrite = true;
        mat.depthTest = true;
        mat.transparent = false;
        mat.colorWrite = false;
        node.material = mat;
      }
    });
    return clone;
  }, [scene]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    /* ── Main iPhone (groupRef) ── */
    if (groupRef.current) {
      if (mouse.isPointer) {
        targetRotation.current.y = -0.3 + mouse.x * 0.26;
        targetRotation.current.x = -mouse.y * 0.17;

        groupRef.current.rotation.y +=
          (targetRotation.current.y - groupRef.current.rotation.y) * 0.05;
        groupRef.current.rotation.x +=
          (targetRotation.current.x - groupRef.current.rotation.x) * 0.05;
      } else {
        groupRef.current.rotation.y = -0.3;
        groupRef.current.rotation.x = 0;
      }

      groupRef.current.position.x = -0.5 + Math.sin(time * 0.4) * 0.1;
      groupRef.current.position.y = Math.cos(time * 0.5) * 0.18;
      groupRef.current.position.z = 0.35;
    }

    /* ── Second phone (Android) — commented out ── */
    // if (secondPhoneRef.current) {
    //   const baseX = -3.9, baseY = -5, baseZ = -3.4;
    //   if (mouse.isPointer) {
    //     secondPhoneRef.current.rotation.y +=
    //       (-0.25 + mouse.x * 0.15 - secondPhoneRef.current.rotation.y) * 0.04;
    //     secondPhoneRef.current.rotation.x +=
    //       (-mouse.y * 0.1 - secondPhoneRef.current.rotation.x) * 0.04;
    //   } else {
    //     secondPhoneRef.current.rotation.y = -0.25;
    //     secondPhoneRef.current.rotation.x = 0;
    //   }
    //   secondPhoneRef.current.position.x = baseX + Math.sin(time * 0.5) * 0.12;
    //   secondPhoneRef.current.position.y = baseY + Math.cos(time * 0.45) * 0.18;
    //   secondPhoneRef.current.position.z = baseZ + Math.sin(time * 0.35) * 0.04;
    // }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.5} />
      <Environment preset="studio" />
      <ReadySignal onReady={onReady} />

      {/* Android phone — commented out */}
      {/* <group ref={secondPhoneRef} position={[-3.9, -5, -3.4]} rotation={[0, -0.25, 0]}>
        <primitive object={infinixScene.clone()} scale={60} position={[0, 0, 0]} />
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
      </group> */}

      <group ref={groupRef} rotation={[0, -0.3, 0]}>
        <primitive object={iphoneDepth} scale={0.8} position={[0, 0, 0]} renderOrder={0} />
        <primitive object={scene} scale={0.8} position={[0, 0, 0]} renderOrder={2} />
        <mesh position={[0, 0, 0.51]} renderOrder={3}>
          <planeGeometry args={[4.9, 11.4]} />
          <meshBasicMaterial
            map={containedHomeTexture || homeTexture}
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
    </>
  );
}


/*
 * ReadySignal: a tiny R3F component that lives inside the Canvas.
 * useFrame runs after the first draw — we call onReady then unsubscribe.
 */
const ReadySignal = ({ onReady }) => {
  const fired = useRef(false);
  useFrame(() => {
    if (!fired.current) {
      fired.current = true;
      onReady();
    }
  });
  return null;
};

const IphoneModel = () => {
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    if (!mouse.isPointer) return;
    const handleMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className="iphone-canvas-container"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 1 }}
      style={{ position: 'relative' }}
    >
      {/* Spinner — fades out once canvas is ready */}
      <motion.div
        className="phone-loader"
        style={{ position: 'absolute', inset: 0 }}
        animate={{ opacity: canvasReady ? 0 : 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        pointerEvents={canvasReady ? 'none' : 'auto'}
      >
        <div className="phone-loader-spinner" />
      </motion.div>

      {/* Canvas — fades in once scene has drawn its first frame */}
      <motion.div
        style={{ width: '100%', height: '100%' }}
        animate={{ opacity: canvasReady ? 1 : 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Canvas
          style={{ width: '100%', height: '100%' }}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <IphoneScene onReady={() => setCanvasReady(true)} />
          </Suspense>
        </Canvas>
      </motion.div>
    </motion.div>
  );
};

export default IphoneModel;

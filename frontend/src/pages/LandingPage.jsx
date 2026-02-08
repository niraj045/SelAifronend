import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Text3D, Center, Environment, Stars } from '@react-three/drei';
import { useState, useRef, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Animated 3D Sphere
function AnimatedSphere() {
  const meshRef = useRef();

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 100, 200]} scale={2.5}>
        <MeshDistortMaterial
          color="#4f46e5"
          attach="material"
          distort={0.5}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

// Rotating Rings
function Rings() {
  return (
    <group>
      <Float speed={2} rotationIntensity={2}>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <torusGeometry args={[3, 0.05, 16, 100]} />
          <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={0.5} />
        </mesh>
      </Float>
      <Float speed={1.5} rotationIntensity={1.5}>
        <mesh rotation={[0, Math.PI / 4, 0]} position={[0, 0, 0]}>
          <torusGeometry args={[3.5, 0.05, 16, 100]} />
          <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.5} />
        </mesh>
      </Float>
    </group>
  );
}

// Floating Particles
function Particles() {
  const count = 100;
  const positions = new Float32Array(count * 3);
  
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20;
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#a5b4fc" transparent opacity={0.6} />
    </points>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState(null);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -5]} intensity={0.5} color="#818cf8" />
            
            <AnimatedSphere />
            <Rings />
            <Particles />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            
            <OrbitControls 
              enableZoom={false} 
              enablePan={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
            />
            <Environment preset="night" />
          </Suspense>
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-white">
        {/* Navigation */}
        <motion.nav 
          className="absolute top-0 left-0 right-0 flex justify-between items-center px-8 py-6"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            SelAI
          </div>
          <button
            onClick={() => navigate('/app')}
            className="px-6 py-2 text-sm font-medium text-white border border-white/30 rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
          >
            Login
          </button>
        </motion.nav>

        {/* Hero Section */}
        <motion.div
          className="text-center max-w-4xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <motion.h1 
            className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            AI-Powered Test Automation
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-12 text-indigo-200/90 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Revolutionize your testing workflow with intelligent automation, 
            real-time insights, and seamless integration.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <button
              onClick={() => navigate('/app')}
              onMouseEnter={() => setHoveredButton('start')}
              onMouseLeave={() => setHoveredButton(null)}
              className="group relative px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105"
            >
              <span className="relative z-10">Start Free Trial</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </button>
            
            <button
              onMouseEnter={() => setHoveredButton('demo')}
              onMouseLeave={() => setHoveredButton(null)}
              className="px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-full backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              Watch Demo
            </button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="absolute bottom-12 left-0 right-0 px-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: '🤖', title: 'AI-Driven', desc: 'Smart test generation' },
              { icon: '⚡', title: 'Real-Time', desc: 'Instant feedback' },
              { icon: '📊', title: 'Analytics', desc: 'Deep insights' }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300"
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-indigo-200">{feature.title}</h3>
                <p className="text-indigo-300/70">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

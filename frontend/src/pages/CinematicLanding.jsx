import { useEffect, useRef, useState, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
    OrbitControls, Float, Environment, RoundedBox
} from '@react-three/drei';
import { motion, AnimatePresence, useInView, animate } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import './CinematicLanding.css';

gsap.registerPlugin(ScrollTrigger);

// ============================================
// 3D COMPONENTS
// ============================================

const NeuralGridShader = {
    uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#312e81') }, // Dark indigo base
        uScanColor: { value: new THREE.Color('#22d3ee') }, // Bright cyan scan
        uMouse: { value: new THREE.Vector3(0, 0, 0) }
    },
    vertexShader: `
        uniform float uTime;
        uniform vec3 uMouse;
        varying vec3 vPos;
        varying float vDist;
        varying float vScan;

        void main() {
            vPos = position;
            vec3 pos = position;
            
            // Subtle wave movement
            float wave = sin(pos.x * 0.5 + uTime * 0.5) * 0.2;
            pos.y += wave;

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            
            // Interaction distance
            vDist = distance(pos, uMouse);
            
            // Scan wave position
            float scanPos = sin(uTime * 0.3) * 15.0;
            vScan = smoothstep(3.0, 0.0, abs(pos.x - scanPos));
            
            // Size attenuation
            gl_PointSize = (3.0 + vScan * 4.0) * (20.0 / -mvPosition.z);
        }
    `,
    fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uScanColor;
        varying float vDist;
        varying float vScan;

        void main() {
            // Circular particle
            float r = distance(gl_PointCoord, vec2(0.5));
            if (r > 0.5) discard;
            
            // Mouse recognition glow
            float mouseGlow = smoothstep(4.0, 0.0, vDist);
            
            // Combine colors: Base + Scan + Mouse
            vec3 color = mix(uColor, uScanColor, vScan * 0.8 + mouseGlow * 0.6);
            
            // Alpha calculation
            float alpha = 0.3 + vScan * 0.7 + mouseGlow * 0.7;
            
            // Grid-like glow center
            alpha *= (1.0 - r * 1.5);

            gl_FragColor = vec4(color, alpha);
        }
    `
};

function NeuralScanGrid({ mousePosition, scrollRef }) {
    const pointsRef = useRef();
    const shaderRef = useRef();

    // Generate organized grid points
    const points = useMemo(() => {
        const p = [];
        const rows = 80;
        const cols = 60;
        const spacing = 0.8;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const x = (j - cols / 2) * spacing;
                const z = (i - rows / 2) * spacing;
                // Base structure curve
                const y = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 2 - 2;
                p.push(x, y, z);
            }
        }
        return new Float32Array(p);
    }, []);

    useFrame((state) => {
        if (shaderRef.current) {
            shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
            // Map 2D mouse to 3D space approx
            shaderRef.current.uniforms.uMouse.value.set(
                (mousePosition.x * 20),
                (mousePosition.y * -5) - 2,
                0
            );
        }

        // Fly-through scroll effect
        if (scrollRef && pointsRef.current) {
            // Move grid towards camera based on scroll
            pointsRef.current.position.z = -5 + (scrollRef.current * 0.005);
        }
    });

    return (
        <points ref={pointsRef} position={[0, 0, -5]} rotation={[0.2, 0, 0]}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={points.length / 3}
                    array={points}
                    itemSize={3}
                />
            </bufferGeometry>
            <shaderMaterial
                ref={shaderRef}
                args={[NeuralGridShader]}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

// Floating 3D Website Wireframe
function WebsiteWireframe() {
    const groupRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    return (
        <Float speed={1} floatIntensity={0.3}>
            <group ref={groupRef} scale={0.8}>
                {/* Browser Frame */}
                <RoundedBox args={[4, 2.5, 0.1]} radius={0.1} position={[0, 0, 0]}>
                    <meshStandardMaterial
                        color="#1e1b4b"
                        emissive="#312e81"
                        emissiveIntensity={0.5}
                        metalness={0.8}
                        roughness={0.2}
                        transparent
                        opacity={0.8}
                    />
                </RoundedBox>

                {/* Header Bar */}
                <RoundedBox args={[3.8, 0.3, 0.12]} radius={0.05} position={[0, 1, 0.06]}>
                    <meshStandardMaterial
                        color="#312e81"
                        emissive="#4f46e5"
                        emissiveIntensity={0.6}
                        metalness={0.8}
                        roughness={0.2}
                    />
                </RoundedBox>

                {/* Content Blocks */}
                {[
                    { pos: [-1.2, 0.3, 0.06], size: [1.4, 0.4, 0.12], color: "#4f46e5" },
                    { pos: [0.8, 0.3, 0.06], size: [1.8, 0.4, 0.12], color: "#6366f1" },
                    { pos: [-0.5, -0.3, 0.06], size: [2.6, 0.5, 0.12], color: "#818cf8" },
                    { pos: [0, -0.9, 0.06], size: [3.2, 0.3, 0.12], color: "#a5b4fc" },
                ].map((block, i) => (
                    <RoundedBox
                        key={i}
                        args={block.size}
                        radius={0.03}
                        position={block.pos}
                    >
                        <meshStandardMaterial
                            color={block.color}
                            emissive={block.color}
                            emissiveIntensity={0.8}
                            metalness={0.8}
                            roughness={0.2}
                            transparent
                            opacity={0.9}
                        />
                    </RoundedBox>
                ))}
            </group>
        </Float>
    );
}

// Animated Counter Component
function CountUpStats({ to, duration = 2, suffix = '', decimals = 0 }) {
    const nodeRef = useRef();
    const inView = useInView(nodeRef, { once: true, margin: "-20px" });

    useEffect(() => {
        if (!inView) return;

        const node = nodeRef.current;
        const controls = animate(0, to, {
            duration,
            ease: "easeOut",
            onUpdate(value) {
                if (node) {
                    if (decimals > 0) {
                        node.textContent = value.toFixed(decimals) + suffix;
                    } else {
                        node.textContent = Math.floor(value).toLocaleString() + suffix;
                    }
                }
            }
        });

        return () => controls.stop();
    }, [to, inView, duration, decimals, suffix]);

    return <span ref={nodeRef}>0{suffix}</span>;
}

// Animated Particles Background
function ParticleField() {
    const count = 500;
    const meshRef = useRef();

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 30;
            const y = (Math.random() - 0.5) * 30;
            const z = (Math.random() - 0.5) * 30;
            temp.push({ x, y, z });
        }
        return temp;
    }, []);

    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        particles.forEach((p, i) => {
            pos[i * 3] = p.x;
            pos[i * 3 + 1] = p.y;
            pos[i * 3 + 2] = p.z;
        });
        return pos;
    }, [particles]);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
        }
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.03}
                color="#a5b4fc"
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function CinematicLanding() {
    const navigate = useNavigate();
    const containerRef = useRef();
    const heroRef = useRef();
    const scrollRef = useRef(0);
    const scrollSections = useRef([]);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [activeSection, setActiveSection] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Track mouse for 3D parallax
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 2,
                y: (e.clientY / window.innerHeight - 0.5) * 2
            });
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Track scroll for fly-through effect
        const handleScroll = () => {
            if (scrollRef.current !== undefined) {
                scrollRef.current = window.scrollY;
            }
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // GSAP ScrollTrigger Animations
    useEffect(() => {
        setIsLoaded(true);

        // Hero text animation
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            gsap.fromTo(heroTitle,
                { opacity: 0, y: 100 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.5,
                    ease: "power4.out",
                    delay: 0.5
                }
            );
        }

        // Split text animation for hero subtitle
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) {
            gsap.fromTo(heroSubtitle,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    delay: 1
                }
            );
        }

        // Scroll-triggered sections
        const sections = document.querySelectorAll('.scroll-section');
        sections.forEach((section, i) => {
            gsap.fromTo(section,
                { opacity: 0, y: 100 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%",
                        end: "top 20%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Feature cards stagger animation
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, i) => {
            gsap.fromTo(card,
                { opacity: 0, y: 80, rotateX: 15 },
                {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    duration: 0.8,
                    delay: i * 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Pricing cards animation
        const pricingCards = document.querySelectorAll('.pricing-card');
        pricingCards.forEach((card, i) => {
            gsap.fromTo(card,
                { opacity: 0, z: -100, rotateY: 10 },
                {
                    opacity: 1,
                    z: 0,
                    rotateY: 0,
                    duration: 1,
                    delay: i * 0.15,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Demo section timeline
        const demoTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: '.demo-section',
                start: "top 60%",
                end: "bottom 40%",
                toggleActions: "play none none reverse"
            }
        });

        demoTimeline
            .fromTo('.demo-terminal', { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.8 })
            .fromTo('.demo-browser', { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.8 }, "-=0.4")
            .fromTo('.demo-output', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.2 }, "-=0.2");

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    // Typing animation for demo
    const [typedText, setTypedText] = useState('');
    const demoTexts = [
        'Analyzing: https://example.com',
        'Scanning DOM elements...',
        'Generating test scenarios...',
        'Creating Selenium scripts...',
        '✓ 12 test cases generated!'
    ];
    const [demoStep, setDemoStep] = useState(0);

    useEffect(() => {
        if (demoStep < demoTexts.length) {
            const text = demoTexts[demoStep];
            let charIndex = 0;
            const typeInterval = setInterval(() => {
                if (charIndex <= text.length) {
                    setTypedText(text.substring(0, charIndex));
                    charIndex++;
                } else {
                    clearInterval(typeInterval);
                    setTimeout(() => {
                        if (demoStep < demoTexts.length - 1) {
                            setDemoStep(demoStep + 1);
                            setTypedText('');
                        }
                    }, 1000);
                }
            }, 50);
            return () => clearInterval(typeInterval);
        }
    }, [demoStep]);

    // Features data - Battle-tested, outcome-focused
    const features = [
        {
            icon: '🚀',
            title: 'Zero-Config Test Creation',
            tagline: 'Paste a URL. SelAI handles the rest.',
            description: 'SelAI scans your site and creates real test flows in minutes. No Selenium knowledge needed.',
            stats: '10x faster',
            gradient: 'from-violet-500 to-purple-600'
        },
        {
            icon: '🧭',
            title: 'AI User-Flow Discovery',
            tagline: 'SelAI maps how real users navigate.',
            description: 'Automatically discovers login, signup, checkout flows. Prioritizes what matters most to your business.',
            stats: '95% coverage',
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            icon: '🛡️',
            title: 'Tests That Never Break',
            tagline: 'UI changes? Tests fix themselves.',
            description: 'AI-powered self-healing that adapts to your UI changes. No more maintenance nightmares.',
            stats: '0 maintenance',
            gradient: 'from-emerald-500 to-teal-500',
            glowEffect: true
        },
        {
            icon: '⚡',
            title: 'Lightning-Fast Execution',
            tagline: 'Parallel. Cloud-native. Blazing fast.',
            description: 'Multiple browsers at once. Chrome, Firefox, Edge support. Auto-scales with your test suite.',
            stats: '20x faster',
            gradient: 'from-orange-500 to-amber-500'
        },
        {
            icon: '📊',
            title: 'Reports Everyone Understands',
            tagline: 'Share with anyone. No translation needed.',
            description: 'Timeline view with screenshots & videos. Clear AI-written failure reasons. Export to PDF, HTML, Markdown.',
            stats: 'Audit-ready',
            gradient: 'from-pink-500 to-rose-500'
        },
        {
            icon: '📝',
            title: 'Documentation on Autopilot',
            tagline: 'Docs write themselves. Literally.',
            description: 'Auto-generated test plans, test cases, and execution summaries. Perfect for audits & clients.',
            stats: '100% coverage',
            gradient: 'from-indigo-500 to-purple-500'
        }
    ];

    // Advanced Capabilities - "Wow" features
    const advancedCapabilities = [
        {
            icon: '🔍',
            title: 'Failure Root-Cause Analysis',
            description: 'SelAI explains WHY a test failed: UI change, slow load, selector mismatch, or backend issue.',
        },
        {
            icon: '📈',
            title: 'Test Coverage Insights',
            description: 'Know what\'s tested and what\'s not. Pages covered, flows missing, risk hotspots visualized.',
        },
        {
            icon: '🧩',
            title: 'Visual Test Builder',
            description: 'Edit tests like a flowchart. Step-by-step visual editor with inline screenshots per step.',
        },
        {
            icon: '🌍',
            title: 'Environment Intelligence',
            description: 'Same tests, different environments. Dev/Staging/Prod switching with env-specific URLs & credentials.',
        },
        {
            icon: '🎯',
            title: 'Smart AI Assertions',
            description: 'SelAI knows what to verify. Auto-detects buttons, forms, text, errors. Flags suspicious UI behavior.',
        },
        {
            icon: '👥',
            title: 'Team & Role Management',
            description: 'Admin / QA / Viewer roles. Share reports securely. Client-friendly access with granular permissions.',
        }
    ];

    // CI/CD Integrations
    const cicdIntegrations = [
        { name: 'GitHub Actions', icon: '/icons/github.svg', color: '#24292e' },
        { name: 'GitLab CI', icon: '/icons/gitlab.svg', color: '#FC6D26' },
        { name: 'Jenkins', icon: '/icons/jenkins.svg', color: '#D24939' },
        { name: 'CircleCI', icon: '/icons/circleci.svg', color: '#343434' },
        { name: 'Azure DevOps', icon: '/icons/azure.svg', color: '#0078D4' },
        { name: 'Bitbucket', icon: '/icons/bitbucket.svg', color: '#0052CC' },
    ];

    // Pricing data
    const pricing = [
        {
            name: 'Starter',
            price: billingCycle === 'monthly' ? 29 : 24,
            features: ['500 test runs/month', '2 projects', 'Basic AI generation', 'Email support'],
            popular: false
        },
        {
            name: 'Professional',
            price: billingCycle === 'monthly' ? 79 : 66,
            features: ['Unlimited test runs', '10 projects', 'Advanced AI + healing', 'Priority support', 'CI/CD integration'],
            popular: true
        },
        {
            name: 'Enterprise',
            price: billingCycle === 'monthly' ? 199 : 166,
            features: ['Everything in Pro', 'Unlimited projects', 'Custom AI training', 'Dedicated support', 'SLA guarantee', 'On-premise option'],
            popular: false
        }
    ];

    return (
        <div ref={containerRef} className="cinematic-landing">
            {/* Animated Background Gradient */}
            <div className="fixed inset-0 bg-gradient-mesh z-0" />

            {/* Noise Texture Overlay */}
            <div className="fixed inset-0 noise-overlay z-[1]" />

            {/* Navigation */}
            <motion.nav
                className="fixed top-0 left-0 right-0 z-50 nav-glass"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <motion.div
                        className="text-2xl font-bold logo-gradient"
                        whileHover={{ scale: 1.05 }}
                    >
                        SelAI
                    </motion.div>

                    <div className="hidden md:flex items-center gap-8">
                        {['Features', 'Demo', 'Pricing', 'Docs'].map((item) => (
                            <motion.a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="nav-link text-white/70 hover:text-white transition-colors"
                                whileHover={{ y: -2 }}
                            >
                                {item}
                            </motion.a>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <motion.button
                            onClick={() => navigate('/app')}
                            className="px-5 py-2 text-sm font-medium text-white/90 border border-white/20 rounded-full hover:bg-white/10 transition-all backdrop-blur-sm"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Sign In
                        </motion.button>
                        <motion.button
                            onClick={() => navigate('/app')}
                            className="magnetic-btn px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full"
                            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Get Started
                        </motion.button>
                    </div>
                </div>
            </motion.nav>

            {/* ==================== GLOBAL BACKGROUND ==================== */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                    <Suspense fallback={null}>
                        <ambientLight intensity={0.2} />
                        <NeuralScanGrid mousePosition={mousePosition} scrollRef={scrollRef} />
                        <Environment preset="city" />
                    </Suspense>
                </Canvas>
            </div>

            {/* ==================== HERO SECTION ==================== */}
            <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden z-10">
                {/* 3D Canvas Removed - Moved to Global Background */}


                {/* Hero Content */}
                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mb-6"
                    >
                        <span className="inline-block px-4 py-1.5 text-sm font-medium text-violet-300 bg-violet-500/10 border border-violet-500/20 rounded-full backdrop-blur-sm">
                            ✨ AI-Powered Automation is Here
                        </span>
                    </motion.div>

                    <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
                        <span className="block text-white">Your Website.</span>
                        <span className="block text-gradient-hero">Tested by AI.</span>
                        <span className="block text-white/90">Automatically.</span>
                    </h1>

                    <p className="hero-subtitle text-xl md:text-2xl text-white/60 max-w-2xl mx-auto mb-12">
                        Generate, execute, and heal Selenium tests — automatically.
                        <br />
                        <span className="text-white/50">No code. No maintenance.</span>
                    </p>

                    {/* Morphing Text */}
                    <motion.div
                        className="mb-12 h-8 font-mono text-violet-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={demoStep}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="inline-block"
                            >
                                {['Analyze', 'Generate Tests', 'Execute', 'Report'][demoStep % 4]} →
                            </motion.span>
                        </AnimatePresence>
                    </motion.div>

                    {/* CTAs */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                    >
                        <motion.button
                            onClick={() => navigate('/app')}
                            className="group relative px-10 py-4 text-lg font-semibold text-white rounded-full overflow-hidden cta-primary"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Start Testing Free
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                            <div className="cta-glow" />
                        </motion.button>

                        <motion.button
                            className="group px-10 py-4 text-lg font-semibold text-white border border-white/20 rounded-full backdrop-blur-sm hover:bg-white/5 transition-all"
                            whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.4)" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                                See It In Action
                            </span>
                        </motion.button>
                    </motion.div>

                    {/* Micro-trust */}
                    <motion.p
                        className="mt-6 text-white/40 text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.8 }}
                    >
                        No credit card required • 14-day free trial • Setup in under 5 minutes
                    </motion.p>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: [0, 10, 0] }}
                    transition={{
                        opacity: { delay: 2 },
                        y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                >
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-scroll-dot" />
                    </div>
                </motion.div>
            </section >

            {/* ==================== AI UNDERSTANDING SECTION ==================== */}
            < section id="features" className="scroll-section relative py-32 z-10" >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="inline-block px-4 py-1.5 text-sm font-medium text-violet-300 bg-violet-500/10 border border-violet-500/20 rounded-full backdrop-blur-sm mb-6">
                                🧠 Intelligent Analysis
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
                                SelAI Understands Your App —<br />
                                <span className="text-gradient-hero">Not Just the UI</span>
                            </h2>
                            <p className="text-xl text-white/50 mb-8">
                                It analyzes structure, behavior, and intent to generate intelligent test scenarios.
                            </p>

                            {/* Key Bullets */}
                            <div className="space-y-4">
                                {[
                                    { icon: '👆', text: 'Knows what\'s clickable', desc: 'Detects buttons, links, and interactive elements' },
                                    { icon: '⚡', text: 'Knows what\'s critical', desc: 'Prioritizes checkout, login, and core flows' },
                                    { icon: '🛡️', text: 'Knows what can break', desc: 'Identifies edge cases and failure points' },
                                ].map((item, i) => (
                                    <motion.div
                                        key={item.text}
                                        className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        viewport={{ once: true }}
                                    >
                                        <span className="text-2xl">{item.icon}</span>
                                        <div>
                                            <p className="text-white font-semibold">{item.text}</p>
                                            <p className="text-white/50 text-sm">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right: 3D Diagram */}
                        <motion.div
                            className="relative h-[450px]"
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
                                <Suspense fallback={null}>
                                    <ambientLight intensity={0.5} />
                                    <pointLight position={[10, 10, 10]} intensity={1} />
                                    <WebsiteWireframe />
                                    <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
                                </Suspense>
                            </Canvas>

                            {/* Floating Labels */}
                            <div className="absolute inset-0 pointer-events-none">
                                {[
                                    { label: 'Header', pos: 'top-1/4 left-1/4' },
                                    { label: 'Navigation', pos: 'top-1/3 right-1/4' },
                                    { label: 'Content', pos: 'bottom-1/3 left-1/3' },
                                    { label: 'CTA Button', pos: 'bottom-1/4 right-1/3' },
                                ].map((item, i) => (
                                    <motion.div
                                        key={item.label}
                                        className={`absolute ${item.pos} px-3 py-1.5 text-sm text-violet-300 bg-violet-500/10 border border-violet-500/30 rounded-full backdrop-blur-sm`}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.5 + i * 0.15 }}
                                        viewport={{ once: true }}
                                    >
                                        {item.label}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section >

            {/* ==================== FEATURE CARDS SECTION ==================== */}
            < section className="scroll-section relative py-32 z-10" >
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        className="text-center mb-20"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-block px-4 py-1.5 text-sm font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full backdrop-blur-sm mb-6">
                            🔥 Why Teams Choose SelAI
                        </span>
                        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                            Testing That <span className="text-gradient-hero">Feels Like Magic</span>
                        </h2>
                        <p className="text-lg text-white/60 max-w-2xl mx-auto mb-4">
                            <span className="text-violet-300 font-medium italic">SelAI doesn't record tests. It understands your app.</span>
                        </p>
                        <p className="text-xl text-white/50 max-w-2xl mx-auto">
                            Powered by <span className="text-violet-400 font-semibold">Multi-Agent AI</span>. No code. No maintenance. No excuses.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                className={`feature-card group ${feature.glowEffect ? 'feature-card-glow' : ''}`}
                                whileHover={{
                                    y: -10,
                                    rotateX: 5,
                                    rotateY: 5,
                                }}
                                style={{ perspective: 1000 }}
                            >
                                <div className={`relative p-8 h-full rounded-2xl bg-white/5 border backdrop-blur-xl overflow-hidden ${feature.glowEffect ? 'border-emerald-500/40' : 'border-white/10'}`}>
                                    {/* Special Glow Effect for highlighted cards */}
                                    {feature.glowEffect && (
                                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 animate-pulse-slow" />
                                    )}

                                    {/* Gradient Glow */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                                    {/* Stats Badge */}
                                    <div className={`absolute top-6 right-6 px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r ${feature.gradient} text-white shadow-lg`}>
                                        {feature.stats}
                                    </div>

                                    {/* Icon */}
                                    <div className="relative text-5xl mb-4">{feature.icon}</div>

                                    {/* Content */}
                                    <h3 className="relative text-xl font-bold text-white mb-2">{feature.title}</h3>
                                    <p className="relative text-sm font-medium text-violet-300 mb-3 italic">"{feature.tagline}"</p>
                                    <p className="relative text-white/50 text-sm leading-relaxed">{feature.description}</p>

                                    {/* Hover Glow Line */}
                                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* CI/CD Integration Bar */}
                    <motion.div
                        className="mt-20"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-white mb-2">
                                Fits Seamlessly Into <span className="text-gradient-hero">Your Pipeline</span>
                            </h3>
                            <p className="text-white/40">Works with the tools you already love</p>
                        </div>
                        <div className="flex flex-wrap justify-center items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                            {cicdIntegrations.map((integration, i) => (
                                <motion.div
                                    key={integration.name}
                                    className="flex flex-col items-center gap-2 px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors">
                                        {integration.name === 'GitHub Actions' && (
                                            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                                            </svg>
                                        )}
                                        {integration.name === 'GitLab CI' && (
                                            <svg className="w-7 h-7 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z" />
                                            </svg>
                                        )}
                                        {integration.name === 'Jenkins' && (
                                            <svg className="w-7 h-7 text-red-400" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                            </svg>
                                        )}
                                        {integration.name === 'CircleCI' && (
                                            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                                                <circle cx="12" cy="12" r="4" />
                                            </svg>
                                        )}
                                        {integration.name === 'Azure DevOps' && (
                                            <svg className="w-7 h-7 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M0 8.877L2.247 5.91l8.405-3.416V.022l7.37 5.393L2.966 8.338v8.225L0 15.707zm24-4.45v14.651l-5.753 4.9-9.303-3.057v3.056l-5.978-7.416 15.057 1.798V5.415z" />
                                            </svg>
                                        )}
                                        {integration.name === 'Bitbucket' && (
                                            <svg className="w-7 h-7 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M.778 1.213c-.424-.006-.772.334-.851.75L.002 22.787c.073.416.42.756.851.75h22.294c.316 0 .583-.234.634-.546l2.22-21.778c.049-.312-.162-.59-.479-.59zM14.52 15.53H9.522L8.17 8.47h7.561z" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-white/70 text-sm font-medium">{integration.name}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Advanced Capabilities - Expandable */}
                    <motion.div
                        className="mt-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <motion.button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/30 hover:border-violet-500/50 transition-all group"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            <span className="text-xl font-bold text-white">🧠 Advanced Capabilities</span>
                            <motion.svg
                                className="w-6 h-6 text-violet-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                animate={{ rotate: showAdvanced ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </motion.svg>
                        </motion.button>

                        <AnimatePresence>
                            {showAdvanced && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                                    className="overflow-hidden"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                                        {advancedCapabilities.map((cap, i) => (
                                            <motion.div
                                                key={cap.title}
                                                className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-violet-500/30 transition-all group"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <span className="text-3xl">{cap.icon}</span>
                                                    <div>
                                                        <h4 className="text-lg font-semibold text-white mb-2">{cap.title}</h4>
                                                        <p className="text-white/50 text-sm">{cap.description}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </section >

            {/* ==================== TRUST SIGNALS SECTION ==================== */}
            < section className="scroll-section relative py-16 z-10" >
                <div className="max-w-7xl mx-auto px-6">
                    {/* Metrics Strip */}
                    <motion.div
                        className="flex flex-wrap justify-center items-center gap-8 md:gap-16 mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="text-center">
                            <p className="text-3xl md:text-4xl font-bold text-white mb-1">
                                <CountUpStats to={10000} suffix="+" />
                            </p>
                            <p className="text-white/40 text-sm">Tests Generated</p>
                        </div>
                        <div className="hidden md:block w-px h-12 bg-white/10" />
                        <div className="text-center">
                            <p className="text-3xl md:text-4xl font-bold text-white mb-1">
                                <CountUpStats to={1} suffix="M+" />
                            </p>
                            <p className="text-white/40 text-sm">Test Steps Executed</p>
                        </div>
                        <div className="hidden md:block w-px h-12 bg-white/10" />
                        <div className="text-center">
                            <p className="text-3xl md:text-4xl font-bold text-gradient-hero mb-1">
                                <CountUpStats to={99.9} decimals={1} suffix="%" />
                            </p>
                            <p className="text-white/40 text-sm">Test Stability</p>
                        </div>
                        <div className="hidden md:block w-px h-12 bg-white/10" />
                        <div className="text-center">
                            <p className="text-3xl md:text-4xl font-bold text-white mb-1">
                                <CountUpStats to={50} suffix="+" />
                            </p>
                            <p className="text-white/40 text-sm">Teams Trust Us</p>
                        </div>
                    </motion.div>

                    {/* Tech Logos Strip */}
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-white/40 text-sm mb-6">Works with teams building on</p>
                        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
                            {[
                                { name: 'Chrome', icon: '🌐' },
                                { name: 'Selenium', icon: '🔷' },
                                { name: 'React', icon: '⚛️' },
                                { name: 'Next.js', icon: '▲' },
                                { name: 'AWS', icon: '☁️' },
                                { name: 'Docker', icon: '🐳' },
                            ].map((tech, i) => (
                                <motion.div
                                    key={tech.name}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-violet-500/30 transition-all"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    viewport={{ once: true }}
                                >
                                    <span className="text-xl">{tech.icon}</span>
                                    <span className="text-white/70 text-sm font-medium">{tech.name}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section >

            {/* ==================== HOW SELAI WORKS ==================== */}
            < section className="scroll-section relative py-32 z-10" >
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div
                        className="text-center mb-20"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-block px-4 py-1.5 text-sm font-medium text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 rounded-full backdrop-blur-sm mb-6">
                            ⚡ 3 Simple Steps
                        </span>
                        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                            How <span className="text-gradient-hero">SelAI</span> Works
                        </h2>
                        <p className="text-xl text-white/50 max-w-xl mx-auto">
                            From URL to tested. In minutes, not weeks.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connection Line */}
                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500/0 via-violet-500/50 to-violet-500/0 -translate-y-1/2" />

                        {[
                            {
                                step: '01',
                                title: 'Paste Your URL',
                                description: 'Drop in your website URL. No login required. No SDK. Just paste and go.',
                                icon: '🔗',
                                color: 'from-violet-500 to-purple-600'
                            },
                            {
                                step: '02',
                                title: 'AI Understands',
                                description: 'SelAI crawls your app, maps user flows, and identifies critical test scenarios.',
                                icon: '🧠',
                                color: 'from-blue-500 to-cyan-500'
                            },
                            {
                                step: '03',
                                title: 'Tests Run & Report',
                                description: 'Automated tests execute in the cloud. Get visual reports, videos, and insights.',
                                icon: '✅',
                                color: 'from-emerald-500 to-teal-500'
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={item.step}
                                className="relative"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2 }}
                                viewport={{ once: true }}
                            >
                                <div className="relative p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl text-center group hover:border-violet-500/30 transition-all">
                                    {/* Step Number */}
                                    <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r ${item.color} text-white text-sm font-bold shadow-lg`}>
                                        {item.step}
                                    </div>

                                    {/* Icon */}
                                    <div className="text-5xl mb-6 mt-4">{item.icon}</div>

                                    {/* Content */}
                                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                    <p className="text-white/50">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >

            {/* ==================== WHO IS SELAI FOR ==================== */}
            < section className="scroll-section relative py-32 z-10" >
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        className="text-center mb-20"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-block px-4 py-1.5 text-sm font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-full backdrop-blur-sm mb-6">
                            👥 Built For You
                        </span>
                        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                            Who Is <span className="text-gradient-hero">SelAI</span> For?
                        </h2>
                        <p className="text-xl text-white/50 max-w-xl mx-auto">
                            Different roles. Same pain. One solution.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                persona: 'Startup Founders',
                                icon: '🚀',
                                pain: '"I can\'t afford a QA team but can\'t ship broken features."',
                                solution: 'SelAI gives you enterprise-grade testing without the enterprise budget.',
                                gradient: 'from-violet-600/20 to-purple-600/20',
                                border: 'border-violet-500/30'
                            },
                            {
                                persona: 'QA Engineers',
                                icon: '🧪',
                                pain: '"I spend 80% of my time maintaining tests, not writing new ones."',
                                solution: 'SelAI handles the maintenance. You focus on test strategy.',
                                gradient: 'from-cyan-600/20 to-blue-600/20',
                                border: 'border-cyan-500/30'
                            },
                            {
                                persona: 'Agencies & Freelancers',
                                icon: '🏢',
                                pain: '"Every client has a different stack. Testing is a nightmare."',
                                solution: 'One tool for all clients. URL in, tests out. Impress every time.',
                                gradient: 'from-amber-600/20 to-orange-600/20',
                                border: 'border-amber-500/30'
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={item.persona}
                                className="group"
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.15 }}
                                viewport={{ once: true }}
                            >
                                <div className={`h-full p-8 rounded-2xl bg-gradient-to-br ${item.gradient} border ${item.border} backdrop-blur-xl transition-all hover:scale-[1.02]`}>
                                    {/* Icon & Persona */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <span className="text-4xl">{item.icon}</span>
                                        <h3 className="text-xl font-bold text-white">{item.persona}</h3>
                                    </div>

                                    {/* Pain */}
                                    <p className="text-white/60 italic mb-4 text-sm leading-relaxed">{item.pain}</p>

                                    {/* Solution */}
                                    <p className="text-white/80 font-medium">{item.solution}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >

            {/* ==================== MID-PAGE CTA BLOCK ==================== */}
            < section className="scroll-section relative py-24 z-10" >
                <div className="max-w-4xl mx-auto px-6">
                    <motion.div
                        className="relative p-12 md:p-16 rounded-3xl bg-gradient-to-br from-violet-900/40 to-indigo-900/40 border border-violet-500/30 backdrop-blur-xl text-center overflow-hidden"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        {/* Background Glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-transparent to-indigo-600/10" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />

                        {/* Content */}
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                                Start Testing in <span className="text-gradient-hero">Minutes</span>
                            </h2>
                            <p className="text-xl text-white/60 mb-10 max-w-lg mx-auto">
                                No credit card. No setup. No code. Just paste your URL and watch the magic.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                                <motion.button
                                    onClick={() => navigate('/app')}
                                    className="group relative px-10 py-4 text-lg font-semibold text-white rounded-full overflow-hidden cta-primary"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        Get Started Free
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </span>
                                    <div className="cta-glow" />
                                </motion.button>

                                <motion.button
                                    className="group px-10 py-4 text-lg font-semibold text-white border border-white/20 rounded-full backdrop-blur-sm hover:bg-white/5 transition-all"
                                    whileHover={{ scale: 1.05, borderColor: "rgba(255,255,255,0.4)" }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                        Watch Demo
                                    </span>
                                </motion.button>
                            </div>

                            <p className="mt-6 text-white/40 text-sm">
                                ✓ Free 14-day trial ✓ No credit card required ✓ Cancel anytime
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section >

            {/* ==================== LIVE DEMO SECTION ==================== */}
            < section id="demo" className="demo-section scroll-section relative py-32 z-10" >
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        className="text-center mb-20"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                            See It In <span className="text-gradient-hero">Action</span>
                        </h2>
                        <p className="text-xl text-white/50 max-w-2xl mx-auto">
                            Watch AI analyze, generate, and execute tests in real-time.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Terminal */}
                        <div className="demo-terminal rounded-2xl bg-slate-900/80 border border-white/10 overflow-hidden backdrop-blur-xl">
                            <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-white/5">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                </div>
                                <span className="text-white/40 text-sm ml-2">Terminal</span>
                            </div>
                            <div className="p-6 font-mono text-sm">
                                <div className="text-violet-400">$ selai analyze</div>
                                <div className="mt-4 text-green-400">
                                    {demoTexts.slice(0, demoStep + 1).map((text, i) => (
                                        <div key={i} className="mb-2">
                                            {i === demoStep ? typedText : text}
                                            {i === demoStep && <span className="animate-pulse">|</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Browser Preview */}
                        <div className="demo-browser rounded-2xl bg-slate-900/80 border border-white/10 overflow-hidden backdrop-blur-xl">
                            <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-white/5">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                </div>
                                <div className="flex-1 mx-4">
                                    <div className="bg-slate-700/50 rounded-full px-4 py-1.5 text-white/40 text-sm">
                                        https://example.com
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {['Login Test', 'Navigation Test', 'Form Validation', 'API Integration'].map((test, i) => (
                                        <motion.div
                                            key={test}
                                            className="demo-output flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5"
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            viewport={{ once: true }}
                                        >
                                            <div className={`w-3 h-3 rounded-full ${i < demoStep ? 'bg-green-500' : 'bg-white/20'}`} />
                                            <span className="text-white/70">{test}</span>
                                            {i < demoStep && (
                                                <span className="ml-auto text-green-400 text-sm">✓ Passed</span>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* ==================== PRICING SECTION ==================== */}
            < section id="pricing" className="scroll-section relative py-32 z-10" >
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                            Simple, Transparent <span className="text-gradient-hero">Pricing</span>
                        </h2>
                        <p className="text-xl text-white/50 max-w-2xl mx-auto mb-10">
                            Start free, scale as you grow. No hidden fees.
                        </p>

                        {/* Billing Toggle */}
                        <div className="inline-flex items-center gap-4 p-1.5 rounded-full bg-white/5 border border-white/10">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === 'monthly'
                                    ? 'bg-violet-600 text-white'
                                    : 'text-white/60 hover:text-white'
                                    }`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingCycle('yearly')}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === 'yearly'
                                    ? 'bg-violet-600 text-white'
                                    : 'text-white/60 hover:text-white'
                                    }`}
                            >
                                Yearly <span className="text-green-400 ml-1">-17%</span>
                            </button>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {pricing.map((plan, i) => (
                            <motion.div
                                key={plan.name}
                                className={`pricing-card relative rounded-2xl p-8 ${plan.popular
                                    ? 'bg-gradient-to-b from-violet-600/20 to-violet-900/20 border-2 border-violet-500/50'
                                    : 'bg-white/5 border border-white/10'
                                    } backdrop-blur-xl`}
                                whileHover={{
                                    y: -10,
                                    scale: 1.02,
                                }}
                                style={{ perspective: 1000 }}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full">
                                        Most Popular
                                    </div>
                                )}

                                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-5xl font-bold text-white">${plan.price}</span>
                                    <span className="text-white/50">/month</span>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-3 text-white/70">
                                            <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <motion.button
                                    className={`w-full py-3 rounded-xl font-semibold transition-all ${plan.popular
                                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-violet-500/30'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                        }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Get Started
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >

            {/* ==================== FINAL CTA SECTION ==================== */}
            < section className="scroll-section relative py-40 z-10 overflow-hidden" >
                {/* Background Glow */}
                < div className="absolute inset-0 bg-gradient-to-t from-violet-900/30 to-transparent" />

                <div className="relative max-w-4xl mx-auto px-6 text-center">
                    <motion.h2
                        className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 text-white leading-tight"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Stop Writing Tests.
                        <br />
                        <span className="text-gradient-hero">Start Letting AI Think.</span>
                    </motion.h2>

                    <motion.p
                        className="text-xl text-white/50 mb-4 max-w-xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        viewport={{ once: true }}
                    >
                        Join thousands of teams who've automated their testing workflow.
                    </motion.p>

                    <motion.p
                        className="text-sm text-violet-300/70 mb-12"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        viewport={{ once: true }}
                    >
                        Used by startups, agencies, and fast-moving teams worldwide.
                    </motion.p>

                    <motion.button
                        onClick={() => navigate('/app')}
                        className="group relative px-12 py-5 text-xl font-semibold text-white rounded-full overflow-hidden cta-primary"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            Start Your Free Trial
                            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                        <div className="cta-glow" />
                    </motion.button>

                    <motion.p
                        className="mt-6 text-white/40 text-sm"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        viewport={{ once: true }}
                    >
                        No credit card required • Setup in under 5 minutes • Cancel anytime
                    </motion.p>
                </div>
            </section >

            {/* ==================== FOOTER ==================== */}
            < footer className="relative py-16 z-10 border-t border-white/5" >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <div className="text-2xl font-bold logo-gradient mb-4">SelAI</div>
                            <p className="text-white/40 mb-4">
                                AI-powered test automation for the modern web.
                            </p>
                            <p className="text-white/30 text-sm italic">
                                Built for modern web testing.
                            </p>
                        </div>

                        {[
                            { title: 'Product', links: ['Features', 'Pricing', 'Docs', 'API', 'Status'] },
                            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
                            { title: 'Legal', links: ['Privacy', 'Terms', 'Security'] },
                        ].map((section) => (
                            <div key={section.title}>
                                <h4 className="text-white font-semibold mb-4">{section.title}</h4>
                                <ul className="space-y-2">
                                    {section.links.map((link) => (
                                        <li key={link}>
                                            <a href="#" className="text-white/40 hover:text-white transition-colors">
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5">
                        <p className="text-white/30 text-sm">
                            © 2024 SelAI. All rights reserved.
                        </p>

                        <div className="flex items-center gap-4 mt-4 md:mt-0">
                            {['twitter', 'github', 'linkedin', 'discord'].map((social) => (
                                <motion.a
                                    key={social}
                                    href="#"
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                                    whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)" }}
                                >
                                    <span className="sr-only">{social}</span>
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                                    </svg>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer >
        </div >
    );
}

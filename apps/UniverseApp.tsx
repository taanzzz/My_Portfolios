import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Compass, Maximize, X, Play, Pause, Search, Database, Disc, Map, Info, ChevronRight, Rocket } from 'lucide-react';

// --- SHADERS ---

// 1. Realistic Sun Shader (Plasma + Corona)
const SUN_VERTEX = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const SUN_FRAGMENT = `
uniform float time;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

// Simplex Noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}

void main() {
    float noise1 = snoise(vPosition * 0.05 + time * 0.1);
    float noise2 = snoise(vPosition * 0.1 - time * 0.2);
    float noise3 = snoise(vPosition * 0.5 + time * 0.5);
    
    vec3 color1 = vec3(1.0, 0.5, 0.0); // Orange
    vec3 color2 = vec3(1.0, 0.1, 0.0); // Red
    vec3 color3 = vec3(1.0, 0.9, 0.5); // Bright Yellow
    
    float intensity = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2;
    vec3 finalColor = mix(color1, color2, intensity);
    finalColor = mix(finalColor, color3, noise3 * 0.5);
    
    // Fresnel glow
    float viewDir = dot(vNormal, vec3(0.0, 0.0, 1.0));
    float glow = pow(1.0 - viewDir, 2.5);
    
    gl_FragColor = vec4(finalColor + vec3(glow) * 0.8, 1.0);
}
`;

// 2. Black Hole Accretion Disk Shader
const BLACKHOLE_FRAGMENT = `
uniform float time;
varying vec2 vUv;

void main() {
    vec2 center = vec2(0.5, 0.5);
    vec2 pos = vUv - center;
    float r = length(pos);
    float angle = atan(pos.y, pos.x);
    
    // Spiral effect
    float spiral = sin(15.0 * r - time * 4.0 + angle * 3.0);
    
    // Disk mask
    float disk = smoothstep(0.1, 0.15, r) * smoothstep(0.5, 0.4, r);
    
    // Color
    vec3 color1 = vec3(1.0, 0.6, 0.2); // Hot Orange
    vec3 color2 = vec3(0.5, 0.1, 0.0); // Dark Red
    
    vec3 finalColor = mix(color2, color1, spiral * 0.5 + 0.5);
    
    // Alpha for transparency
    float alpha = disk * (0.8 + 0.2 * spiral);
    
    gl_FragColor = vec4(finalColor * 2.0, alpha);
}
`;

// 3. Atmosphere Glow Shader
const ATMOSPHERE_VERTEX = `
varying vec3 vNormal;
void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const ATMOSPHERE_FRAGMENT = `
varying vec3 vNormal;
uniform vec3 color;
void main() {
    float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
    gl_FragColor = vec4(color, 1.0) * intensity;
}
`;

// --- DATA ---

const BODIES = [
    { id: 'sun', name: 'The Sun', type: 'star', radius: 20, color: '#FFD700', orbit: 0, speed: 0, desc: "Type G2V Yellow Dwarf Star. Core temp: 15M°C. Contains 99.86% of the Solar System's mass." },
    { id: 'mercury', name: 'Mercury', type: 'planet', radius: 1.5, color: '#A5A5A5', orbit: 40, speed: 0.02, desc: "Smallest planet. No atmosphere. Temperatures fluctuate from 427°C to -173°C." },
    { id: 'venus', name: 'Venus', type: 'planet', radius: 3.5, color: '#E3BB76', orbit: 60, speed: 0.015, atmColor: '#FFA500', desc: "Hottest planet due to greenhouse effect. Surface pressure is 92 times that of Earth." },
    { id: 'earth', name: 'Earth', type: 'planet', radius: 3.8, color: '#2244AA', orbit: 85, speed: 0.01, atmColor: '#4488FF', desc: "Our home. The only known planet to support life. 71% surface is water." },
    { id: 'mars', name: 'Mars', type: 'planet', radius: 2.1, color: '#CC4422', orbit: 110, speed: 0.008, atmColor: '#C1440E', desc: "The Red Planet. Home to Olympus Mons, the largest volcano in the solar system." },
    { id: 'jupiter', name: 'Jupiter', type: 'gas_giant', radius: 10, color: '#D9A066', orbit: 160, speed: 0.004, desc: "Largest planet. A gas giant with a Great Red Spot storm larger than Earth." },
    { id: 'saturn', name: 'Saturn', type: 'gas_giant', radius: 8.5, color: '#FDE047', orbit: 210, speed: 0.003, ring: true, desc: "Famous for its extensive ring system made of ice and rock particles." },
    { id: 'uranus', name: 'Uranus', type: 'ice_giant', radius: 6, color: '#66CCFF', orbit: 260, speed: 0.002, desc: "Rotates on its side. An ice giant with the coldest planetary atmosphere (-224°C)." },
    { id: 'neptune', name: 'Neptune', type: 'ice_giant', radius: 5.8, color: '#3355FF', orbit: 300, speed: 0.001, desc: "Windiest planet with supersonic winds. Deep blue color due to methane." },
];

// --- Procedural Texture Helpers ---
const createProceduralTexture = (colorHex: string, type: string) => {
    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    // Base
    const color = new THREE.Color(colorHex);
    ctx.fillStyle = '#' + color.getHexString();
    ctx.fillRect(0, 0, size, size);
    
    // Noise/Details
    const imgData = ctx.getImageData(0,0,size,size);
    const data = imgData.data;
    
    for(let i=0; i<data.length; i+=4) {
        const noise = Math.random() * 0.2 - 0.1;
        
        if (type === 'gas_giant') {
            // Banding effect
            const y = (i / 4 / size); // 0 to 1
            const band = Math.sin(y * 50.0) * 0.1;
            data[i] = Math.min(255, data[i] * (1 + band + noise));
            data[i+1] = Math.min(255, data[i+1] * (1 + band + noise));
            data[i+2] = Math.min(255, data[i+2] * (1 + band + noise));
        } else {
            // Craters / Terrain
            data[i] = Math.min(255, data[i] + noise * 50);
            data[i+1] = Math.min(255, data[i+1] + noise * 50);
            data[i+2] = Math.min(255, data[i+2] + noise * 50);
        }
    }
    ctx.putImageData(imgData, 0, 0);
    
    // Clouds for Earth
    if (colorHex === '#2244AA') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        for(let j=0; j<50; j++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const r = Math.random() * 100;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI*2);
            ctx.fill();
        }
    }

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
};

// --- COMPONENTS ---

const UniverseApp: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const [selectedObject, setSelectedObject] = useState<any>(null);
    const [viewMode, setViewMode] = useState<'SOLAR' | 'GALAXY' | 'BLACK_HOLE'>('SOLAR');
    const [isPaused, setIsPaused] = useState(false);
    
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const objectsRef = useRef<{[key: string]: THREE.Group}>({});
    const galaxyParticlesRef = useRef<THREE.Points | null>(null);
    const blackHoleRef = useRef<THREE.Group | null>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // 1. Scene Setup
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        scene.fog = new THREE.FogExp2(0x000000, 0.00005); // Deep space fog

        const camera = new THREE.PerspectiveCamera(50, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 100000);
        camera.position.set(0, 150, 300);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.toneMapping = THREE.ReinhardToneMapping;
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.maxDistance = 20000;
        controls.minDistance = 5; // Allow zooming very close
        controlsRef.current = controls;

        // 2. Stars Background
        const starGeo = new THREE.BufferGeometry();
        const starCount = 8000;
        const starPos = new Float32Array(starCount * 3);
        for(let i=0; i<starCount*3; i++) {
            starPos[i] = (Math.random() - 0.5) * 5000;
        }
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
        const starMat = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 1.5, transparent: true, opacity: 0.8 });
        const starField = new THREE.Points(starGeo, starMat);
        scene.add(starField);

        // 3. Solar System Construction
        const solarGroup = new THREE.Group();
        scene.add(solarGroup);
        objectsRef.current['solar_group'] = solarGroup;

        // Lighting
        const sunLight = new THREE.PointLight(0xffffff, 2, 2000);
        solarGroup.add(sunLight);
        solarGroup.add(new THREE.AmbientLight(0x333333));

        BODIES.forEach(body => {
            const group = new THREE.Group();
            
            // Mesh
            let geometry = new THREE.SphereGeometry(body.radius, 64, 64);
            let material;

            if (body.type === 'star') {
                material = new THREE.ShaderMaterial({
                    uniforms: { time: { value: 0 } },
                    vertexShader: SUN_VERTEX,
                    fragmentShader: SUN_FRAGMENT,
                    side: THREE.DoubleSide
                });
                // Glow Sprite
                const spriteMat = new THREE.SpriteMaterial({ 
                    map: new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/glow.png'), 
                    color: 0xffaa00, 
                    blending: THREE.AdditiveBlending 
                });
                const sprite = new THREE.Sprite(spriteMat);
                sprite.scale.set(body.radius*5, body.radius*5, 1);
                group.add(sprite);
            } else {
                material = new THREE.MeshStandardMaterial({
                    map: createProceduralTexture(body.color, body.type),
                    roughness: body.type.includes('gas') ? 1 : 0.7,
                    metalness: 0.1
                });
            }

            const mesh = new THREE.Mesh(geometry, material);
            mesh.userData = { id: body.id, data: body };
            group.add(mesh);

            // Atmosphere
            if (body.atmColor) {
                const atmGeo = new THREE.SphereGeometry(body.radius * 1.2, 64, 64);
                const atmMat = new THREE.ShaderMaterial({
                    vertexShader: ATMOSPHERE_VERTEX,
                    fragmentShader: ATMOSPHERE_FRAGMENT,
                    blending: THREE.AdditiveBlending,
                    side: THREE.BackSide,
                    transparent: true,
                    uniforms: { color: { value: new THREE.Color(body.atmColor) } }
                });
                group.add(new THREE.Mesh(atmGeo, atmMat));
            }

            // Rings
            if (body.ring) {
                const ringGeo = new THREE.RingGeometry(body.radius * 1.4, body.radius * 2.5, 64);
                const ringMat = new THREE.MeshStandardMaterial({ 
                    color: 0xCCAA88, side: THREE.DoubleSide, transparent: true, opacity: 0.6 
                });
                const ring = new THREE.Mesh(ringGeo, ringMat);
                ring.rotation.x = Math.PI / 2;
                group.add(ring);
            }

            // Orbit Path
            if (body.orbit > 0) {
                const orbitGeo = new THREE.RingGeometry(body.orbit - 0.2, body.orbit + 0.2, 128);
                const orbitMat = new THREE.MeshBasicMaterial({ color: 0x444444, side: THREE.DoubleSide, transparent: true, opacity: 0.3 });
                const orbit = new THREE.Mesh(orbitGeo, orbitMat);
                orbit.rotation.x = Math.PI / 2;
                solarGroup.add(orbit);
                
                // Set initial pos
                group.position.x = body.orbit;
            }

            solarGroup.add(group);
            objectsRef.current[body.id] = group;
        });

        // 4. Galaxy Construction
        const galaxyGroup = new THREE.Group();
        // Galaxy is positioned FAR away or we toggle visibility.
        // For seamless zoom, we can scale it down or put it in background. 
        // Let's hide it initially.
        galaxyGroup.visible = false; 
        scene.add(galaxyGroup);

        // Particle Galaxy
        const galParams = { count: 50000, size: 0.5, radius: 1000, branches: 5, spin: 2 };
        const galGeo = new THREE.BufferGeometry();
        const galPos = new Float32Array(galParams.count * 3);
        const galCol = new Float32Array(galParams.count * 3);
        const insideColor = new THREE.Color('#ff6030');
        const outsideColor = new THREE.Color('#1b3984');

        for(let i=0; i<galParams.count; i++) {
            const i3 = i * 3;
            const r = Math.random() * galParams.radius;
            const spinAngle = r * galParams.spin;
            const branchAngle = (i % galParams.branches) / galParams.branches * Math.PI * 2;
            
            const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 50;
            const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 50;
            const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 50;

            galPos[i3] = Math.cos(branchAngle + spinAngle) * r + randomX;
            galPos[i3+1] = randomY * 2 + (Math.random() - 0.5) * r * 0.2; // Height spread
            galPos[i3+2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

            // Color mix
            const mixedColor = insideColor.clone().lerp(outsideColor, r / galParams.radius);
            galCol[i3] = mixedColor.r;
            galCol[i3+1] = mixedColor.g;
            galCol[i3+2] = mixedColor.b;
        }
        galGeo.setAttribute('position', new THREE.BufferAttribute(galPos, 3));
        galGeo.setAttribute('color', new THREE.BufferAttribute(galCol, 3));
        const galMat = new THREE.PointsMaterial({ size: 2, sizeAttenuation: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true });
        const galaxy = new THREE.Points(galGeo, galMat);
        galaxyGroup.add(galaxy);
        galaxyParticlesRef.current = galaxy;

        // 5. Black Hole Construction (Hidden initially)
        const bhGroup = new THREE.Group();
        bhGroup.visible = false;
        scene.add(bhGroup);
        blackHoleRef.current = bhGroup;

        // Event Horizon
        const bhSphere = new THREE.Mesh(
            new THREE.SphereGeometry(20, 64, 64),
            new THREE.MeshBasicMaterial({ color: 0x000000 })
        );
        bhGroup.add(bhSphere);

        // Accretion Disk
        const diskGeo = new THREE.PlaneGeometry(120, 120);
        const diskMat = new THREE.ShaderMaterial({
            uniforms: { time: { value: 0 } },
            vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
            fragmentShader: BLACKHOLE_FRAGMENT,
            transparent: true,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const disk = new THREE.Mesh(diskGeo, diskMat);
        // Tilt disk slightly
        disk.rotation.x = Math.PI / 3;
        bhGroup.add(disk);

        // --- ANIMATION LOOP ---
        let time = 0;
        const animate = () => {
            requestAnimationFrame(animate);
            time += 0.01;

            if (!isPaused) {
                // Solar System Animation
                BODIES.forEach(body => {
                    if (body.id !== 'sun' && objectsRef.current[body.id]) {
                        const grp = objectsRef.current[body.id];
                        // Calculate orbital position
                        const angle = time * body.speed;
                        grp.position.x = Math.cos(angle) * body.orbit;
                        grp.position.z = Math.sin(angle) * body.orbit;
                        
                        // Self rotation
                        grp.children[0].rotation.y += 0.01; 
                    } else if (body.id === 'sun') {
                        // Update sun shader time
                        const sunMesh = objectsRef.current['sun'].children[0] as THREE.Mesh;
                        if (sunMesh.material instanceof THREE.ShaderMaterial) {
                            sunMesh.material.uniforms.time.value = time;
                        }
                    }
                });

                // Galaxy Animation
                if (galaxyGroup.visible) {
                    galaxy.rotation.y += 0.0005;
                }

                // Black Hole Animation
                if (bhGroup.visible) {
                    diskMat.uniforms.time.value = time;
                    disk.rotation.z -= 0.01; // Spin accretion disk
                }
            }

            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Raycaster for clicks
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const onMouseClick = (event: MouseEvent) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            // Raycast logic depends on view mode
            if (viewMode === 'SOLAR') {
                const meshes = Object.values(objectsRef.current).map((g) => (g as THREE.Group).children[0]);
                const intersects = raycaster.intersectObjects(meshes);
                if (intersects.length > 0) {
                    const obj = intersects[0].object;
                    setSelectedObject(obj.userData.data);
                    // Focus camera
                    const targetPos = obj.parent!.position.clone();
                    controls.target.copy(targetPos);
                    // Zoom in
                    const offset = new THREE.Vector3(15, 5, 15);
                    camera.position.copy(targetPos).add(offset);
                }
            }
        };
        renderer.domElement.addEventListener('click', onMouseClick);

        const handleResize = () => {
            if (!mountRef.current) return;
            camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.domElement.removeEventListener('click', onMouseClick);
            mountRef.current?.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, [viewMode]);

    // View Switching Logic
    const switchMode = (mode: 'SOLAR' | 'GALAXY' | 'BLACK_HOLE') => {
        if (!sceneRef.current || !cameraRef.current || !controlsRef.current) return;
        setViewMode(mode);
        setSelectedObject(null);

        const solarGroup = objectsRef.current['solar_group'];
        const galaxyGroup = sceneRef.current.children.find(c => c === galaxyParticlesRef.current?.parent);
        const bhGroup = blackHoleRef.current;

        if (mode === 'SOLAR') {
            solarGroup.visible = true;
            galaxyGroup!.visible = false;
            bhGroup!.visible = false;
            cameraRef.current.position.set(0, 150, 300);
            controlsRef.current.target.set(0, 0, 0);
        } else if (mode === 'GALAXY') {
            solarGroup.visible = false;
            galaxyGroup!.visible = true;
            bhGroup!.visible = false;
            cameraRef.current.position.set(0, 1000, 1500); // Far out
            controlsRef.current.target.set(0, 0, 0);
        } else if (mode === 'BLACK_HOLE') {
            solarGroup.visible = false;
            galaxyGroup!.visible = false;
            bhGroup!.visible = true;
            cameraRef.current.position.set(0, 50, 100);
            controlsRef.current.target.set(0, 0, 0);
        }
    };

    return (
        <div className="w-full h-full bg-black relative text-white font-sans overflow-hidden select-none">
            <div ref={mountRef} className="w-full h-full cursor-crosshair" />

            {/* Navigation HUD */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <div className="bg-black/80 backdrop-blur-md border border-white/20 p-2 rounded-lg">
                    <h1 className="text-2xl font-black uppercase tracking-widest flex items-center gap-2">
                        <Database className="text-yellow-400" /> Universe <span className="text-xs bg-white text-black px-1 rounded">PRO</span>
                    </h1>
                </div>
                
                <div className="flex gap-2">
                    <button 
                        onClick={() => switchMode('SOLAR')}
                        className={`px-3 py-1 text-xs font-bold uppercase border border-white/20 rounded hover:bg-white hover:text-black transition-all ${viewMode === 'SOLAR' ? 'bg-white text-black' : 'bg-black/50'}`}
                    >
                        Solar System
                    </button>
                    <button 
                        onClick={() => switchMode('GALAXY')}
                        className={`px-3 py-1 text-xs font-bold uppercase border border-white/20 rounded hover:bg-white hover:text-black transition-all ${viewMode === 'GALAXY' ? 'bg-white text-black' : 'bg-black/50'}`}
                    >
                        Milky Way
                    </button>
                    <button 
                        onClick={() => switchMode('BLACK_HOLE')}
                        className={`px-3 py-1 text-xs font-bold uppercase border border-white/20 rounded hover:bg-white hover:text-black transition-all ${viewMode === 'BLACK_HOLE' ? 'bg-white text-black' : 'bg-black/50'}`}
                    >
                        Black Hole
                    </button>
                </div>
            </div>

            {/* Info Panel */}
            {selectedObject && (
                <div className="absolute top-20 right-4 w-80 bg-black/80 backdrop-blur-xl border-l-4 border-yellow-400 p-6 shadow-2xl animate-in slide-in-from-right duration-300">
                    <button onClick={() => setSelectedObject(null)} className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded">
                        <X size={16} />
                    </button>
                    <h2 className="text-4xl font-black uppercase mb-1 text-yellow-400">{selectedObject.name}</h2>
                    <span className="text-xs font-mono text-gray-400 uppercase border border-gray-600 px-1 rounded">{selectedObject.type.replace('_', ' ')}</span>
                    <p className="text-sm font-medium text-gray-200 mt-4 leading-relaxed border-l-2 border-white/20 pl-3">
                        {selectedObject.desc}
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="bg-white/10 p-2 rounded">
                            <span className="text-gray-500 block">Radius</span>
                            <span className="font-bold">{selectedObject.radius * 6371} km</span>
                        </div>
                        <div className="bg-white/10 p-2 rounded">
                            <span className="text-gray-500 block">Orbital Speed</span>
                            <span className="font-bold">{selectedObject.speed * 1000} km/s</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Black Hole Info Overlay */}
            {viewMode === 'BLACK_HOLE' && !selectedObject && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center max-w-lg pointer-events-none">
                    <h2 className="text-3xl font-black uppercase text-orange-500 drop-shadow-[0_0_10px_rgba(255,165,0,0.8)]">Gargantua Singularity</h2>
                    <p className="text-sm font-medium text-white/80 bg-black/50 backdrop-blur px-4 py-2 mt-2 rounded border border-orange-500/30">
                        A supermassive black hole with an accretion disk of superheated plasma. The gravity is so immense that light itself orbits the event horizon.
                    </p>
                </div>
            )}

            {/* Controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 flex items-center gap-6 shadow-2xl">
                <button 
                    onClick={() => setIsPaused(!isPaused)} 
                    className="hover:text-yellow-400 transition-colors"
                    title={isPaused ? "Play" : "Pause"}
                >
                    {isPaused ? <Play size={24} fill="currentColor" /> : <Pause size={24} fill="currentColor" />}
                </button>
                <div className="h-6 w-px bg-white/20" />
                <span className="text-xs font-mono uppercase text-gray-400">
                    SCALE: {viewMode === 'SOLAR' ? '1:100M' : viewMode === 'GALAXY' ? '1:100KY' : 'UNK'}
                </span>
            </div>
        </div>
    );
};

export default UniverseApp;